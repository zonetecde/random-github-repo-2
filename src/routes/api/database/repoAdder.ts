import Topic from '../../../models/Topic.js';
import { fetchGithubApi } from '../fetchExtensions.js';
import Repo from '../../../models/Repo.js';
import { Op } from '@sequelize/core';
import Variables from '../globalVariables.js';

async function addReposLoop(specialLoop: boolean = true) {
	let removedTopics: string[] = [];

	const topics: Topic[] = (await Topic.findAll()).toSorted((a, b) => {
		return a.numberOfRepo < b.numberOfRepo ? 1 : -1;
	});

	const tasks: Promise<any>[] = [];

	for (let page = 1; page <= 3; page++) {
		tasks.push(
			new Promise(async (resolve) => {
				if (Variables.processAddingRepos)
					for (let i = 0; i < topics.length; i++) {
						const topic = topics[i];

						if (!Variables.processAddingRepos) {
							await waitToContinue();
						}
						if (removedTopics.includes(topic.tag)) continue;

						let numberOfAddedRepos = 0;

						console.log('Adding repos for topic ' + topic.tag + ' on page ' + page);

						const url = specialLoop
							? `https://api.github.com/search/repositories?q=${encodeURI(
									topic.name
							  )}&sort=updated&per_page=100&page=${page}`
							: `https://api.github.com/search/repositories?q=stars:>0&sort=updated&order=desc&per_page=100&page=${page}`;

						const json = await fetchGithubApi(url);

						if (json === null) {
							console.log('Request failed. Skipping...');
							continue;
						}

						const searchResult = JSON.parse(json);
						for (let index = 0; index < searchResult.items.length; index++) {
							const element = searchResult.items[index];

							if (!Variables.processAddingRepos) {
								await waitToContinue();
							}

							const repoId = element.id;
							const star = element.stargazers_count ?? 0;
							const tags = element.topics as string[];
							const description = element.description ?? '';

							let formattedTopics = tags.join(',');

							description.split(' ').forEach((word: string) => {
								if (
									formattedTopics.includes(',' + word + ',') === false &&
									topics.some((topic) => topic.name === word || topic.tag === word)
								) {
									formattedTopics += formattedTopics.length !== 0 ? ',' : '' + word;
								}
							});

							if (formattedTopics.length > 0) {
								formattedTopics = ',' + formattedTopics + ',';
								formattedTopics = formattedTopics.replace(/,+/g, ','); // Remove duplicate commas
							}

							if (repoId) {
								// If it don't exist yet, create it
								if ((await Repo.count({ where: { repoId: repoId } })) === 0) {
									console.log(
										//'Creating repo ' + repoId + ' : ' + formattedTopics + ' : ' + star + '...'
										'+1'
									);
									Repo.create({
										repoId: repoId,
										star: star,
										topics: formattedTopics
									});
									numberOfAddedRepos++;
								}
							}
						}

						console.log('Done adding repos for topic ' + topic.tag + ' on page ' + page);

						if (numberOfAddedRepos === 0) {
							removedTopics.push(topic.tag);
						}
					}

				resolve(`Done adding repos for page ${page}`);
			})
		);
	}

	await Promise.all(tasks);

	// Recalcul le nombre de repo pour chaque topic
	for (let i = 0; i < topics.length; i++) {
		const topic = topics[i];
		const numberOfRepo = await Repo.count({
			where: {
				topics: {
					[Op.like]: `%,${topic.tag},%`
				}
			}
		});
		topic.update({ numberOfRepo: numberOfRepo });
		topic.save();
	}

	addReposLoop(!specialLoop); // Infinite call
}

async function waitToContinue() {
	while (!Variables.processAddingRepos) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}

export default addReposLoop;

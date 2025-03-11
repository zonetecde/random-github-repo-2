import Topic from '$lib/models/Topic.ts';
import { Op } from '@sequelize/core';
import Variables from '../../routes/api/globalVariables.js';
import { fetchGithubApi } from '../fetchExtensions.js';
import Repo from '$lib/models/Repo.ts';

async function addReposLoop(specialLoop: boolean = false) {
	let removedTopics: string[] = [];

	const topics: Topic[] = (await Topic.findAll()).toSorted((a, b) => {
		return a.numberOfRepo < b.numberOfRepo ? 1 : -1;
	});

	const tasks: Promise<any>[] = [];

	for (let i = 0; i < topics.length; i++) {
		const topic = topics[i];

		for (let page = 1; page <= 5; page++) {
			tasks.push(
				new Promise(async (resolve) => {
					if (Variables.processAddingRepos) {
						if (!Variables.processAddingRepos) {
							await waitToContinue();
						}

						if (!specialLoop || removedTopics.includes(topic.tag)) {
							// Attend un temps aléatoire afin de ne pas avoir les mêmes réponses à chaque fois
							const randomTime = Math.random() * 3000 + 500; // Random time between 0.5 and 3.5 seconds
							await new Promise((resolve) => setTimeout(resolve, randomTime));
							console.log('Waited ' + randomTime + 'ms...');
						}

						let numberOfAddedRepos = 0;

						console.log('Adding repos for topic ' + topic.tag + ' on page ' + page);

						const url =
							specialLoop && !removedTopics.includes(topic.tag)
								? `https://api.github.com/search/repositories?q=${encodeURI(
										topic.name
								  )}&sort=updated&per_page=100&page=${page}`
								: `https://api.github.com/search/repositories?q=stars:>0&sort=updated&order=desc&per_page=100&page=1`;

						const json = await fetchGithubApi(url);

						if (json !== null) {
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

								if (description.trim() === '') continue; // pas de description, on passe

								let formattedTopics = tags.join(',');

								description.split(' ').forEach((word: string) => {
									const lowerCaseWord = word.toLocaleLowerCase();
									if (
										formattedTopics.includes(',' + lowerCaseWord + ',') === false &&
										topics.some(
											(topic) =>
												topic.name.toLowerCase() === lowerCaseWord || topic.tag === lowerCaseWord
										)
									) {
										formattedTopics += formattedTopics.length !== 0 ? ',' : '' + lowerCaseWord;
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
					}

					resolve(`Done adding repos for topic ${topic.tag}`);
				})
			);
		}

		await Promise.all(tasks);
	}

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

	Variables.specialLoopIndex += 1;
	addReposLoop(Variables.specialLoopIndex % 5 === 0); // Infinite call
}

async function waitToContinue() {
	while (!Variables.processAddingRepos) {
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}
}

export default addReposLoop;

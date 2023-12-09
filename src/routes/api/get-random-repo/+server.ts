import Repo, { CRepo } from '../../../models/Repo.js';
import Sequelize, { Op, type Filterable } from '@sequelize/core';
import { sequelize } from '../database/db.js';
import { fetchGithubApi } from '../fetchExtensions.js';
import Variables from '../globalVariables.js';

async function RepoIdToRepo(id: number, randomRepo: Repo) {
	const response = await fetchGithubApi(`https://api.github.com/repositories/${id}`);

	if (response === null) return null;

	const data = JSON.parse(response);
	const repo = new CRepo(data, randomRepo);

	if (repo && repo.RepoName && repo.Creator) return repo;

	return null;
}

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	Variables.pauseAddingRepos();

	// get 'topics' query parameter
	const topicsBrute = url.searchParams.get('topics') ?? '';

	// Start chrono
	const start = Date.now();

	const topics: string[] = topicsBrute !== '' ? topicsBrute?.split(',') : [];
	const fromStar = parseInt(url.searchParams.get('fromStar') ?? '0');
	const toStar = parseInt(url.searchParams.get('toStar') ?? '10000000');

	// Analytic
	fetch(
		'https://www.rayanestaszewski.fr/api/software/software-being-used?softwareName=RGR&detail=' +
			topicsBrute +
			', ' +
			fromStar +
			', ' +
			toStar,
		{
			method: 'POST'
		}
	);

	let whereParams: Sequelize.WhereOptions<
		Sequelize.InferAttributes<
			Repo,
			{
				omit: never;
			}
		>
	> = {};

	if (topics.length > 0) {
		// Get repos that match the topics
		// Conditional because if there are no topics, we don't want to filter by topics
		whereParams = {
			topics: {
				[Op.and]: topics.map((topic) => ({ [Op.like]: `%,${topic},%` }))
			}
		};
	}

	whereParams.star = {
		[Op.and]: [{ [Op.gte]: fromStar }, { [Op.lte]: toStar }]
	};

	const matchedRepos = await Repo.findAll({
		where: whereParams,
		order: Sequelize.literal('RANDOM()'),
		limit: 5 // returns 50 random repos that match the topics
		// and so that the client don't have to request 50 times
	});

	// End chrono
	const end = Date.now();
	console.log(`Request took ${end - start}ms`);

	let convertedRepos = await Promise.all(
		matchedRepos.map(async (repo) => await RepoIdToRepo(repo.repoId, repo))
	);

	// Remove the null values
	convertedRepos = convertedRepos.filter((repo) => repo !== null);

	return new Response(JSON.stringify(convertedRepos));
}

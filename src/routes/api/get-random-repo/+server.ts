import Repo from '../../../models/Repo.js';
import Sequelize, { Op, type Filterable } from '@sequelize/core';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	// get 'topics' query parameter
	const topicsBrute = url.searchParams.get('topics');

	// Start chrono
	const start = Date.now();

	const topics = topicsBrute?.split(',') ?? [];
	const fromStar = parseInt(url.searchParams.get('fromStar') ?? '0');
	const toStar = parseInt(url.searchParams.get('toStar') ?? '10000000');

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
				[Op.and]: topics.map((topic) => ({ [Op.like]: `%${topic}%` }))
			}
		};
	}

	whereParams.star = {
		[Op.and]: [{ [Op.gte]: fromStar }, { [Op.lte]: toStar }]
	};

	const matchedRepos = await Repo.findAll({
		where: whereParams,
		order: Sequelize.literal('RANDOM()'),
		limit: 50 // returns 50 random repos that match the topics
		// and so that the client don't have to request 50 times
	});

	// End chrono
	const end = Date.now();
	console.log(`Request took ${end - start}ms`);

	return new Response(JSON.stringify(matchedRepos));
}

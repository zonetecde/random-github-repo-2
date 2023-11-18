import Repo, { CRepo } from '../../../models/Repo.js';
import Sequelize, { Op, type Filterable } from '@sequelize/core';
import { sequelize } from '../database/db.js';
import { fetchGithubApi } from '../fetchExtensions.js';

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

	const counter = await Repo.count({
		where: whereParams
	});

	return new Response(counter.toString());
}

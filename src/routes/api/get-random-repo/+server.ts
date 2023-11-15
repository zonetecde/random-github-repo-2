import Repo from '../../../models/Repo.js';
import { Op } from '@sequelize/core';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	const topics = ['topic1', 'topic2'];

	const matchedRepos = await Repo.findAll({
		where: {
			topics: {
				[Op.and]: topics.map((topic) => ({ [Op.like]: `%,${topic},%` })) // le topic est entre deux virgules
			}
		}
	});

	return new Response(String('test'));
}

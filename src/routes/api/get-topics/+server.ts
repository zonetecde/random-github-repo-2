import Repo from '../../../models/Repo.js';
import Sequelize, { Op } from '@sequelize/core';
import Topics from '../../../models/Topic.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	return new Response(JSON.stringify(await Topics.findAll()));
}

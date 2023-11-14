import { error } from '@sveltejs/kit';
import Repo from '../../../models/Repo.js';
import { sequelize } from '../database/db.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	await Repo.create({ repoId: 'test', star: 1, topics: 'test' }); // create the model

	return new Response(String('test'));
}

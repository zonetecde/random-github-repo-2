import Repo from '../../../models/Repo.js';
import Sequelize, { Op } from '@sequelize/core';
import Topics from '../../../models/Topic.js';
import { sequelize } from '../database/db.js';
import Variables from '../globalVariables.js';

/** @type {import('./$types').RequestHandler} */
export async function GET({ url }: { url: URL }) {
	Variables.pauseAddingRepos();

	return new Response(JSON.stringify(await Topics.findAll()));
}

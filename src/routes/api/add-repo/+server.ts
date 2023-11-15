import Repo from '../../../models/Repo.js';
import { Op } from '@sequelize/core';
// On importe sequelize même si on l'utilise pas car sinon la db va pas s'initialiser
import { sequelize } from '../database/db.js';

// ex : http://localhost:5173/api/add-repo?topic=test,coucou&repoId=444&star=20

/** @type {import('./$types').RequestHandler} */
export async function POST({ url }: { url: URL }) {
	const star = Number(url.searchParams.get('star'));
	const repoId = url.searchParams.get('repoId');
	let topics = url.searchParams.get('topic') ?? '';

	if (repoId) {
		// Cela est fait car après dans la recherche de topics on utilise les virgules
		// si on en met pas au début ou à la fin ça va pas détecter le topic
		// si on met pas les virgules il y a pas de moyen de différentier c et csharp car
		// les deux contiennent la lettre c
		if (topics.length > 0) {
			if (!topics.startsWith(',')) topics = ',' + topics;
			if (!topics.endsWith(',')) topics = topics + ',';
		}

		await Repo.create({ repoId: repoId, star: star, topics: topics });

		return new Response(String('success'));
	} else {
		console.log('erreur');
		return new Response(String('error : missing parameters'));
	}
}

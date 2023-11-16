import { Sequelize } from '@sequelize/core';
import Repo from '../../../models/Repo.js';
import Topic from '../../../models/Topic.js';
import fs from 'fs';

const sequelize = new Sequelize('sqlite:./database/database.db');

if (!Repo.isInitialized()) {
	console.log('Initializing repo table...');
	sequelize.addModels([Repo]);
}

if (!Topic.isInitialized()) {
	console.log('Initializing topic table...');
	sequelize.addModels([Topic]);
}

sequelize.sync().then(() => {
	//addReposFromFile();
});

process.on('exit', () => {
	console.log('Closing database connection...');
	sequelize.close();
});

async function addReposFromFile() {
	try {
		const data = fs.readFileSync('./database/jsonData.json', 'utf8');
		const jsonObject = JSON.parse(data);

		console.log('Adding repos from JSON file...');

		// Set the batch size to control parallelism
		const batchSize = 100_000; // Adjust this based on your requirements

		let array: any[] = [];

		for (let i = 0; i < jsonObject.length; i += batchSize) {
			const batch = jsonObject.slice(i, i + batchSize);

			await Promise.all(
				batch.map(async (element: any) => {
					let topics = element.Topics.slice(1, -1);
					if (topics.length > 0) {
						if (!topics.startsWith(',')) topics = ',' + topics;
						if (!topics.endsWith(',')) topics = topics + ',';
					}

					const repoId = element.RepoId;

					if (element.RepoId) {
						array.push({
							repoId: repoId,
							star: element.Star,
							topics: topics
						});
					}
				})
			);

			console.log('+100 000 repos added.');
		}

		console.log('Adding repos to database...');
		console.log('Number of repos to add:', array.length);

		Repo.bulkCreate(array, { ignoreDuplicates: true })
			.then(() => {
				console.log('Done adding repos from JSON file.');
			})
			.catch((error) => {
				console.error('Error adding repos:', error);
			});
	} catch (error) {
		console.error('Error reading file or adding repos:', error);
	}
}

export { sequelize };

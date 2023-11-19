import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional
} from '@sequelize/core';

import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';

export default class Repo extends Model<InferAttributes<Repo>, InferCreationAttributes<Repo>> {
	@Attribute(DataTypes.INTEGER)
	@PrimaryKey
	@AutoIncrement
	declare id: CreationOptional<number>;

	@Attribute(DataTypes.INTEGER)
	@NotNull
	declare repoId: number;

	@Attribute(DataTypes.INTEGER)
	@NotNull
	declare star: number;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare topics: string;
}

export class CRepo {
	RepoName: string;
	Creator: string;
	Category: string;
	Description: string;
	Id: number;
	ImageUrl: string;
	ProgrammingLanguage: string;
	Star: number;
	Topics: string;

	constructor(item: any, randomRepo: Repo) {
		this.RepoName = item.name ?? '';
		this.Creator = item.full_name.split('/')[0] ?? '';
		this.Category = '';
		this.Description = item.description;
		this.Id = item.id;
		this.ImageUrl = '';
		this.ProgrammingLanguage = item.language ?? '';
		this.Star = randomRepo.star;
		this.Topics = randomRepo.topics.slice(1, -1);

		// Update the star count if it's different
		if (this.Star !== item.stargazers_count) {
			randomRepo.update({ star: item.stargazers_count });
			randomRepo.save();
			console.log('Updated star count');
		}
		// Update the topics if it's different
		let topicArray = this.Topics.split(',');

		// Si des topics présents dans le repo ne sont pas dans la base de données, on les ajoute
		if ((item.topics as string[]).every((topic: string) => topicArray.includes(topic)) === false) {
			// On ajoute les topics du repo qui sont absent à la base de données
			(item.topics as string[]).forEach((topic: string) => {
				if (!topicArray.includes(topic)) {
					topicArray.push(topic);
				}
			});

			// On met à jour les topics du repo
			let newTopics = ',' + topicArray.join(',') + ',';

			if (newTopics !== ',,') {
				// console.log('Old topics:', this.Topics);
				// console.log('New topics:', newTopics);

				randomRepo.update({ topics: newTopics });
				randomRepo.save();
				console.log('Updated topics');
			}
		}
	}
}

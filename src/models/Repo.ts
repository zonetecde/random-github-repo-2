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
	id: number;
	repoId: number;
	star: number;
	topics: string;
	constructor(repo: Repo) {
		this.id = repo.id;
		this.repoId = repo.repoId;
		this.star = repo.star;
		this.topics = repo.topics;
	}
}

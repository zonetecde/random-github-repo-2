import {
	DataTypes,
	Model,
	type InferAttributes,
	type InferCreationAttributes,
	type CreationOptional
} from '@sequelize/core';

import { Attribute, PrimaryKey, AutoIncrement, NotNull } from '@sequelize/core/decorators-legacy';

export default class Topic extends Model<InferAttributes<Topic>, InferCreationAttributes<Topic>> {
	@Attribute(DataTypes.INTEGER)
	@PrimaryKey
	@AutoIncrement
	declare id: CreationOptional<number>;

	@Attribute(DataTypes.INTEGER)
	@NotNull
	declare numberOfRepo: number;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare name: string;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare imageUrl: string;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare description: string;

	@Attribute(DataTypes.STRING)
	@NotNull
	declare tag: string;
}

export class CTopic {
	id: number;
	numberOfRepo: number;
	name: string;
	imageUrl: string;
	description: string;
	tag: string;

	constructor(
		id: number,
		numberOfRepo: number,
		name: string,
		imageUrl: string,
		description: string,
		tag: string
	) {
		this.id = id;
		this.numberOfRepo = numberOfRepo;
		this.name = name;
		this.imageUrl = imageUrl;
		this.description = description;
		this.tag = tag;
	}
}

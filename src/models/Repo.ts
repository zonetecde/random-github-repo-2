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

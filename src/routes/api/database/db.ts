import { Sequelize } from '@sequelize/core';
import Repo from '../../../models/Repo.js';
import Topic from '../../../models/Topic.js';

const sequelize = new Sequelize('sqlite:./database/database.db');

if (!Repo.isInitialized()) {
	console.log('Initializing repo table...');
	sequelize.addModels([Repo]);
}

if (!Topic.isInitialized()) {
	console.log('Initializing topic table...');
	sequelize.addModels([Topic]);
}

sequelize.sync({ alter: true });

process.on('exit', () => {
	console.log('Closing database connection...');
	sequelize.close();
});

export { sequelize };

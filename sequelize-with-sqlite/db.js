const { Sequelize } = require('sequelize');

const db = new Sequelize({
	dialect: 'sqlite',
	storage: 'database.sqlite', // this is the filename.
});

module.exports = {
	db,
	connectDB: async () => await db.authenticate(),
	disconnectDB: async () => await db.close()
};

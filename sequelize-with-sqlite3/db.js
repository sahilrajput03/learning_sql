const { Sequelize } = require('sequelize');

const db = new Sequelize({
	dialect: 'sqlite',
	storage: 'database.sqlite', // this is the filename.
	// Learn: Sequelize’s does SQL logging for every query to the
	// 			console. To disables all SQL logs:
	logging: false,
	// Learn: For custom logger, use:
	// logging: (msg) => console.log("Sequelize log:", msg), 
	// Learn: We can disable logging for a particular query as well via - `await UserModel.sync({ logging: false });`
});

module.exports = {
	db,
	connectDB: async () => await db.authenticate(),
	disconnectDB: async () => await db.close()
};

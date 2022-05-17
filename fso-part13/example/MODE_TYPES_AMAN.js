// -Reference projects
// -
// -- [les-chat](https://github.com/amand33p/les-chat)
// -- [bug-tracker](https://github.com/amand33p/bug-tracker)
// -- official sequelize-express example: https://github.com/sequelize/express-example

/*
	type: Sequelize.INTEGER,
	type: Sequelize.STRING,
	type: Sequelize.DATE,
	type: Sequelize.ARRAY(Sequelize.INTEGER),
	type: Sequelize.ENUM('public', 'private', 'group'),

	:: Others useful property type:
	allowNull, primaryKey, autoIncrement, unique
*/

// create-user.js
'use strict'
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			username: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			passwordHash: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable('users')
	},
}
// create-message.js
;('use strict')
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				type: Sequelize.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			username: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			passwordHash: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable('users')
	},
}
// create-conversation
;('use strict')
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('conversations', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
			},
			admin: {
				type: Sequelize.INTEGER,
			},
			type: {
				type: Sequelize.ENUM('public', 'private', 'group'),
				allowNull: false,
			},
			participants: {
				type: Sequelize.ARRAY(Sequelize.INTEGER),
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
			},
		})
	},
	down: async (queryInterface) => {
		await queryInterface.dropTable('conversations')
	},
}

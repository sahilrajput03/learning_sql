const {DataTypes} = require('sequelize')

module.exports = {
	up: async ({context: queryInterface}) => {
		await queryInterface.createTable('notes', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			important: {
				type: DataTypes.BOOLEAN,
			},
			date: {
				type: DataTypes.DATE,
			},
		})
		await queryInterface.createTable('users', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			username: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		})
		await queryInterface.addColumn('notes', 'user_id', {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {model: 'users', key: 'id'},
		})
	},
	down: async ({context: queryInterface}) => {
		await queryInterface.dropTable('notes')
		await queryInterface.dropTable('users')
	},
}

// FIRST TIMES EXECUTION ON CONNECTION TO DB VIA SERVER CODE RESULTS IN PRINTING BELOW LOGS:
// {
//   event: 'migrating',
//   name: '20211209_00_initialize_notes_and_users.js'
// }
// {
//   event: 'migrated',
//   name: '20211209_00_initialize_notes_and_users.js',
//   durationSeconds: 0.029
// }
// Migrations up to date { files: [ '20211209_00_initialize_notes_and_users.js' ] }

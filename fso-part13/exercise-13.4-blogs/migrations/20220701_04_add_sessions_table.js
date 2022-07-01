const {DataTypes} = require('sequelize')

module.exports = {
	up: async ({context: queryInterface}) => {
		// :::FIX THIS TABLE MIGRATION::::
		queryInterface.createTable('sessions', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {model: 'users', key: 'id'},
			},
			token: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		})
	},
	down: async ({context: queryInterface}) => {
		queryInterface.dropTable('sessions')
	},
}

// FIRST TIMES EXECUTION ON CONNECTION TO DB VIA SERVER CODE RESULTS IN PRINTING BELOW LOGS:
/*
{ event: 'migrating', name: '20220701_04_add_sessions_table.js' }
{
  event: 'migrated',
  name: '20220701_04_add_sessions_table.js',
  durationSeconds: 0.017
}
Migrations up to date { files: [ '20220701_04_add_sessions_table.js' ] }
 */

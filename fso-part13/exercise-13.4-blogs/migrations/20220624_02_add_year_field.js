const {DataTypes} = require('sequelize')

module.exports = {
	up: async ({context: queryInterface}) => {
		await queryInterface.addColumn('blogs', 'year', {
			type: DataTypes.INTEGER,
		})
	},
	down: async ({context: queryInterface}) => {
		await queryInterface.removeColumn('blogs', 'year')
	},
}

// FIRST TIMES EXECUTION ON CONNECTION TO DB VIA SERVER CODE RESULTS IN PRINTING BELOW LOGS:
// { event: 'migrating', name: '20220624_02_add_year_field.js' }
// {
//   event: 'migrated',
//   name: '20220624_02_add_year_field.js',
//   durationSeconds: 0.015
// }
// Migrations up to date { files: [ '20220624_02_add_year_field.js' ] }

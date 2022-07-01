const {DataTypes} = require('sequelize')

module.exports = {
	up: async ({context: queryInterface}) => {
		await queryInterface.addColumn('users', 'admin', {
			type: DataTypes.BOOLEAN,
			default: false,
		})
		await queryInterface.addColumn('users', 'disabled', {
			type: DataTypes.BOOLEAN,
			default: false,
		})
	},
	down: async ({context: queryInterface}) => {
		await queryInterface.removeColumn('users', 'admin')
		await queryInterface.removeColumn('users', 'disabled')
	},
}

// Migration:
// { event: 'migrating', name: '20220701_03_add_disabled.js' }
// {
//   event: 'migrated',
//   name: '20220701_03_add_disabled.js',
//   durationSeconds: 0.015
// }
// Migrations up to date { files: [ '20220701_03_add_disabled.js' ] }

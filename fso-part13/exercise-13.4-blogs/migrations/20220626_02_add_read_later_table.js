const {DataTypes} = require('sequelize')

module.exports = {
	up: async ({context: queryInterface}) => {
		queryInterface.createTable(
			'readinglists',
			{
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
				blog_id: {
					type: DataTypes.INTEGER,
					allowNull: false,
					references: {model: 'blogs', key: 'id'},
				},
				is_read: {
					type: DataTypes.BOOLEAN,
					allowNull: false,
					defaultValue: false,
				},
			}
			// underscored property with umzug doesn't work, check the status of this answer to know more: https://github.com/sequelize/umzug/discussions/478
			// {
			// 	underscored: true,
			// }
		)
	},
	down: async ({context: queryInterface}) => {
		queryInterface.dropTable('readinglist')
	},
}

// FIRST TIMES EXECUTION ON CONNECTION TO DB VIA SERVER CODE RESULTS IN PRINTING BELOW LOGS:
// {
//   event: 'migrated',
//   name: '20220626_02_add_read_later_table.js',
//   durationSeconds: 0.01
// }

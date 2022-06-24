const {DataTypes} = require('sequelize')

module.exports = {
	up: async ({context: queryInterface}) => {
		await queryInterface.createTable('blogs', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			author: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			url: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			title: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			likes: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			// LEARN: We must add created_at and updated_at manually else they won't be created!
			created_at: {
				type: DataTypes.DATE,
			},
			updated_at: {
				type: DataTypes.DATE,
			},
		})
		await queryInterface.createTable('users', {
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true, // PRIMARY KEY
				autoIncrement: true,
			},
			username: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				// exercise: 13.9
				validate: {
					isEmail: true,
				},
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			// LEARN: We must add created_at and updated_at manually else they won't be created!
			created_at: {
				type: DataTypes.DATE,
			},
			updated_at: {
				type: DataTypes.DATE,
			},
		})
		await queryInterface.addColumn('blogs', 'user_id', {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {model: 'users', key: 'id'},
		})
	},
	down: async ({context: queryInterface}) => {
		await queryInterface.dropTable('blogs')
		await queryInterface.dropTable('users')
	},
}

// FIRST TIMES EXECUTION ON CONNECTION TO DB VIA SERVER CODE RESULTS IN PRINTING BELOW LOGS:
// {
//   event: 'migrating',
//   name: '20220624_01_initialize_blogs_and_users.js'
// }
// {
//   event: 'migrated',
//   name: '20220624_01_initialize_blogs_and_users.js',
//   durationSeconds: 0.03
// }
// Migrations up to date { files: [ '20220624_01_initialize_blogs_and_users.js' ] }

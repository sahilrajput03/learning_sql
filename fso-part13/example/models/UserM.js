const {Model, DataTypes} = require('sequelize')
const {sequelize} = require('../db')

class User extends Model {}

User.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true, // PRIMARY KEY
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
	},
	{
		sequelize,
		underscored: true,
		timestamps: false,
		modelName: 'user',
	}
)

module.exports = User

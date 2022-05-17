const {Model, DataTypes} = require('sequelize')
const sequelize = require('../db')

class NoteM extends Model {}

NoteM.init(
	{
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
			type: DataTypes.NUMBER,
			defaultValue: 0,
		},
	},
	{
		sequelize,
		underscored: true,
		timestamps: false,
		modelName: 'blogs', // this is table name the model is associated to.
	}
)

NoteM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/

module.exports = NoteM

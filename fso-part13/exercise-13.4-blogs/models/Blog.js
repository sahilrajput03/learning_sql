const {Model, DataTypes} = require('sequelize')
// const sequelize = require('../db')

class BlogM extends Model {}

const init = (sequelize) => {
	BlogM.init(
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
				type: DataTypes.INTEGER,
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
}

module.exports.BlogM = BlogM
module.exports.init = init
global.BlogM = BlogM

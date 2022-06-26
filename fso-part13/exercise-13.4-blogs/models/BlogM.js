const {Model, DataTypes} = require('sequelize')
// const sequelize = require('../db')

class BlogM extends Model {}

const initBlogM = (sequelize) => {
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
			year: {
				type: DataTypes.INTEGER,
				validate: {
					// ~my custom validation function, docs: https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/
					isCorrectYear(value) {
						// @ts-ignore
						let currentYear = new Date().getYear() + 1900
						if (value < 1991 || value > currentYear) {
							throw new Error('year field must be between 1991 to ' + currentYear + ', but give year value is: ' + value + '.')
						}
					},
				},
			},
		},
		{
			sequelize,
			// Learn: underscored property: https://sequelize.org/docs/v6/other-topics/naming-strategies/#the-underscored-option
			underscored: true,
			// LEARN: By default, Sequelize automatically adds the fields createdAt and updatedAt to every model, using the data type DataTypes.DATE. Src: https://sequelize.org/docs/v6/core-concepts/model-basics/#timestamps
			// timestamps: false,
			modelName: 'blog', // pluralized to `blogs`, src: https://sequelize.org/docs/v6/core-concepts/model-basics/#table-name-inference
		}
	)
}

// You should use imported version of models so you get autoomplete for methods in both tests and server code, yikes!
module.exports = {BlogM, initBlogM}

// Using global is not a good programming technique at all
// global.BlogM = BlogM

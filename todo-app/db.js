const {Sequelize, DataTypes} = require('sequelize')

const db = new Sequelize({
	dialect: 'sqlite',
	storage: 'database.sqlite', // this is the filename.
})

module.exports = db

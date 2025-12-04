// @ts-nocheck
const { DataTypes } = require('sequelize');
const { db } = require('../db.js');

// model definition
const UserModel = db.define(
	'User',
	{
		// Learn: Data types: https://sequelize.org/master/manual/model-basics.html#data-types
		firstName: { type: DataTypes.STRING, allowNull: false, /** default: true */ },
		lastName: { type: DataTypes.STRING },
		age: { type: DataTypes.NUMBER },
		gender: { type: DataTypes.STRING },
		india: { type: DataTypes.STRING },
	},
	{
		// Learn: We stop the auto-pluralization performed by Sequelize via `freezeTableName: true`
		freezeTableName: true,
	}
);

module.exports = { UserModel };

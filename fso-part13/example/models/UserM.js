const {Model, DataTypes} = require('sequelize')

class UserM extends Model {}

const initUserM = (sequelize) =>
	UserM.init(
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
			admin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			disabled: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			// Learn: underscored property: https://sequelize.org/docs/v6/other-topics/naming-strategies/#the-underscored-option
			underscored: true,
			timestamps: false,
			modelName: 'user',
		}
	)

module.exports = {UserM, initUserM}

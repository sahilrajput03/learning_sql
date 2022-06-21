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
				// exercise: 13.9
				validate: {
					isEmail: true,
				},
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			underscored: true,
			// LEARN: By default, Sequelize automatically adds the fields createdAt and updatedAt to every model, using the data type DataTypes.DATE. Src: https://sequelize.org/docs/v6/core-concepts/model-basics/#timestamps
			// timestamps: false,
			modelName: 'user',
		}
	)

module.exports = {UserM, initUserM}

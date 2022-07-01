const {Model, DataTypes} = require('sequelize')

class SessionM extends Model {}

const initSessionM = (sequelize) =>
	SessionM.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {model: 'users', key: 'id'},
			},
			token: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			sequelize,
			// Learn: underscored property: https://sequelize.org/docs/v6/other-topics/naming-strategies/#the-underscored-option
			underscored: true,
			// LEARN: By default, Sequelize automatically adds the fields createdAt and updatedAt to every model, using the data type DataTypes.DATE. Src: https://sequelize.org/docs/v6/core-concepts/model-basics/#timestamps
			timestamps: false,
			modelName: 'sessions', // pluralized to `sessions`, src: https://sequelize.org/docs/v6/core-concepts/model-basics/#table-name-inference
		}
	)

module.exports = {SessionM, initSessionM}

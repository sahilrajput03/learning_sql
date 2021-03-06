const {Model, DataTypes} = require('sequelize')

class TeamM extends Model {}

const initTeamM = (sequelize) =>
	TeamM.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			name: {
				type: DataTypes.TEXT,
				allowNull: false,
				unique: true,
			},
		},
		{
			sequelize,
			// Learn: underscored property: https://sequelize.org/docs/v6/other-topics/naming-strategies/#the-underscored-option
			underscored: true,
			timestamps: false,
			modelName: 'team', // pluralized to `teams`, src: https://sequelize.org/docs/v6/core-concepts/model-basics/#table-name-inference
		}
	)

module.exports = {TeamM, initTeamM}

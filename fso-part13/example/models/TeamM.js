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
			underscored: true,
			timestamps: false,
			modelName: 'team',
		}
	)

module.exports = {TeamM, initTeamM}

const {Model, DataTypes} = require('sequelize')

class MembershipM extends Model {}

const initMembershipM = (sequelize) =>
	MembershipM.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			// user_id: {
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {model: 'users', key: 'id'},
			},
			// team_id: {
			teamId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {model: 'teams', key: 'id'},
			},
		},
		{
			sequelize,
			// Learn: underscored property: https://sequelize.org/docs/v6/other-topics/naming-strategies/#the-underscored-option
			underscored: true,
			timestamps: false,
			modelName: 'membership',
		}
	)

module.exports = {MembershipM, initMembershipM}

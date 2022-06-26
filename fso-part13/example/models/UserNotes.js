const {Model, DataTypes} = require('sequelize')

// connection table between `users` and `notes` table
class UserNotesM extends Model {}

let initUserNotesM = (sequelize) =>
	UserNotesM.init(
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
			noteId: {
				type: DataTypes.INTEGER,
				allowNull: false,
				references: {model: 'notes', key: 'id'},
			},
		},
		{
			sequelize,
			// Learn: underscored property: https://sequelize.org/docs/v6/other-topics/naming-strategies/#the-underscored-option
			underscored: true,
			timestamps: false,
			modelName: 'userNotesM',
		}
	)

module.exports = {UserNotesM, initUserNotesM}

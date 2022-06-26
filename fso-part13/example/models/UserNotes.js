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
			// ! Checkif modelName is below is correct, fyi; It has to be singular only IMO>
			modelName: 'userNotes', // pluralized to `user_notes`, src: https://sequelize.org/docs/v6/core-concepts/model-basics/#table-name-inference
		}
	)

module.exports = {UserNotesM, initUserNotesM}

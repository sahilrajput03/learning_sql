const {Sequelize, Model, DataTypes} = require('sequelize')

// NoteModel
class NoteM extends Model {}

const initNoteM = (sequelize) =>
	NoteM.init(
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			important: {
				type: DataTypes.BOOLEAN,
			},
			date: {
				type: DataTypes.DATE,
			},
		},
		{
			sequelize,
			underscored: true,
			timestamps: false,
			modelName: 'note',
		}
	)

module.exports = {NoteM, initNoteM}

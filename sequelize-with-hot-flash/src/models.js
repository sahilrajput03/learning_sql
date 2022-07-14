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
			updatedAt: false,
			// tableName: 'Note', // (optional) explicity providing table name!
			// freezeTableName: true, // (optional) This enforces the model to be exactly equal to table name i.e., disabled pluralization.
		}
	)

module.exports = {NoteM, initNoteM}

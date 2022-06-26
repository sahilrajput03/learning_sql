const {Model, DataTypes} = require('sequelize')

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
			// Learn: underscored property: https://sequelize.org/docs/v6/other-topics/naming-strategies/#the-underscored-option
			underscored: true,
			timestamps: false,
			modelName: 'note',
		}
	)

module.exports = {NoteM, initNoteM}

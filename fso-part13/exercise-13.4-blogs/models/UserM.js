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
					isEmail: true, // on failure throws error as ```{ name: 'SequelizeValidationError', message: 'Validation error: Validation isEmail on username failed'}```
				},
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			admin: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			disabled: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{
			sequelize,
			// Learn: underscored property: https://sequelize.org/docs/v6/other-topics/naming-strategies/#the-underscored-option
			underscored: true,
			// LEARN: By default, Sequelize automatically adds the fields createdAt and updatedAt to every model, using the data type DataTypes.DATE. Src: https://sequelize.org/docs/v6/core-concepts/model-basics/#timestamps
			// timestamps: false,
			modelName: 'user', // pluralized to `users`, src: https://sequelize.org/docs/v6/core-concepts/model-basics/#table-name-inference
		}
	)

module.exports = {UserM, initUserM}

const {Sequelize, Model, DataTypes} = require('sequelize')
const dotenv = require('dotenv')
dotenv.config()

let {DATABASE_URL} = process.env
// console.log('we got db url as :::', DATABASE_URL)
let enableSSL = false
let dialectOptions = enableSSL
	? {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
	  }
	: null

let config = {
	logging: false, // Turn off logging, src: https://stackoverflow.com/a/55874733/10012446
	// logging: true, // for debugging only.
	dialectOptions,
}
// config = null; // Its must be null(can't send undefined).

const sequelize = new Sequelize(DATABASE_URL, config)

if (!DATABASE_URL.includes('test')) {
	throw new Error('Please use a database with test in its name for testing... ~ Sahil')
}
module.exports = sequelize.authenticate()
// .then(() => {
// 	console.log('Connection has been established successfully.'.mb)
// })
// .catch((err) => {
// 	console.error('~Sahil: Unable to connect to the database :'.bgRed, err)
// })

// NoteModel
class NoteM extends Model {}

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

global.NoteM = NoteM
global.sequelize = sequelize

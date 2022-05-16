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

// They say that all tables get delete within the database:
// sequelize.sync({force: true})

NoteM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/

global.NoteM = NoteM
global.sequelize = sequelize

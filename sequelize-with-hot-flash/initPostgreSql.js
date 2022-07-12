const {Sequelize} = require('sequelize')
const {initNoteM, NoteM} = require('./models')
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

async function connect() {
	try {
		await sequelize.authenticate()
		console.log('CONNECTION TO DB SUCCESSFULLY.')
		initNoteM(sequelize)
		// Autopilot - Fix the schema
		await NoteM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	} catch (error) {
		// 	console.error('~Sahil: Unable to connect to the database :'.bgRed, err)
	}
}

module.exports = connect()

global.sequelize = sequelize

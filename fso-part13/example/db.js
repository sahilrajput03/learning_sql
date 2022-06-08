const {Sequelize} = require('sequelize')
const {NoteM, UserM, initNoteM, initUserM, setupAssociations} = require('./models')

let {DATABASE_URL, NODE_ENV} = process.env
// console.log({DATABASE_URL, NODE_ENV})

let isDev = NODE_ENV === 'dev'
let isTesting = NODE_ENV === 'test'
let isLocal = isDev || isTesting

let config = {
	logging: isLocal ? false : true, // Turn off logging based upon environment, src: https://stackoverflow.com/a/55874733/10012446
	dialectOptions: {
		ssl: isLocal
			? null
			: {
					require: true,
					rejectUnauthorized: false,
			  },
	},
}

console.log('DATABASE_URL'.bgGreen, DATABASE_URL.green)
const sequelize = new Sequelize(DATABASE_URL, config)

// let connection = sequelize
// 	.authenticate()
// 	.then(async () => {
// 		console.log('Connection has been established successfully.'.mb)

// 		initNoteM(sequelize)
// 		initUserM(sequelize)

// 		setupAssociations()

// 		// Create table if doesn't exist already!
// 		// Fix the schema on the fly.
// 		// This causes error imo when new tables are created so `alter: true` doesn't create the table at all as it only tries to fix the already existing tables.
// 		await NoteM.sync({alter: true}) // LEARN: order of syncing these tables has to be like this only!
// 		await UserM.sync({alter: true})
// 	})
// 	.catch((err) => {
// 		console.error('~Sahil: Unable to connect to the database :'.bgRed, err)
// 	})

const connect = async () => {
	try {
		await sequelize.authenticate()
		console.log('Connection has been established successfully.'.mb)

		// Setup models
		initNoteM(sequelize)
		initUserM(sequelize)

		// Setup Associations
		setupAssociations()

		// Create table if doesn't exist already!
		// Fix the schema on the fly.
		// This causes error imo when new tables are created so `alter: true` doesn't create the table at all as it only tries to fix the already existing tables.
		await NoteM.sync({alter: true}) // LEARN: order of syncing these tables has to be like this only!
		await UserM.sync({alter: true})
	} catch (err) {
		console.error('~Sahil: Unable to connect to the database :'.bgRed, err)
	}
}

let connection = connect()

module.exports.sequelize = sequelize
module.exports.connection = connection
global.sequelize = sequelize

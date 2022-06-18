const {Sequelize} = require('sequelize')
const {initUserM, UserM, initBlogM, BlogM, setupAssociations} = require('./models')
const {silog, tlog, slog, logger} = require('./utils/logger')

let {DATABASE_URL, NODE_ENV} = process.env
let log = console.log
// log({DATABASE_URL, NODE_ENV})

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

// config = null; // Its must be null(can't send undefined).

const {inspect} = require('util')

logger.success('DATABASE_URL', DATABASE_URL)

const sequelize = new Sequelize(DATABASE_URL, config)

// log({sequelize})

// exporting a promise
// TODO: Make it a async function called and export that...!!
let connect = async () => {
	await sequelize.authenticate()
	logger.success('CONNECTION TO DB::SUCCESSFUL')

	// Setup models
	initBlogM(sequelize)
	initUserM(sequelize)

	// Setup Association
	setupAssociations()

	// Create table if doesn't exist already!
	// Fix the schema on the fly.
	// This causes error imo when new tables are created so `alter: true` doesn't create the table at all as it only tries to fix the already existing tables.
	await UserM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	await BlogM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/
}

let connection = connect()

module.exports = {connection, sequelize}
global.sequelize = sequelize

// .then(() => {
// 	log('Connection has been established successfully.'.mb)
// })
// .catch((err) => {
// 	console.error('~Sahil: Unable to connect to the database :'.bgRed, err)
// })

// I don't need to export this now.. (i was using this in model only though ~ Sahil)
// module.exports = sequelize

const {Umzug, SequelizeStorage} = require('umzug') // src: https://github.com/sequelize/umzug
const {Sequelize} = require('sequelize')
const {setupModels} = require('./models')
const {logger} = require('./utils/logger')

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

const migrationConf = {
	migrations: {
		glob: 'migrations/*.js',
	},
	storage: new SequelizeStorage({sequelize, tableName: 'migrations'}),
	context: sequelize.getQueryInterface(),
	logger: console,
}

const runMigrations = async () => {
	const migrator = new Umzug(migrationConf)
	const migrations = await migrator.up()
	console.log('Migrations up to date', {
		files: migrations.map((mig) => mig.name),
	})
}

const rollbackMigration = async () => {
	await sequelize.authenticate()
	const migrator = new Umzug(migrationConf)
	await migrator.down()
}

let connect = async () => {
	await sequelize.authenticate()
	logger.success('CONNECTION TO DB::SUCCESSFUL')

	// Setup Models
	setupModels(sequelize)

	// Create table if doesn't exist already!
	// Fix the schema on the fly.
	// This causes error imo when new tables are created so `alter: true` doesn't create the table at all as it only tries to fix the already existing tables.
	// await UserM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	// await BlogM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/

	// LEARN: We are gonna use different way to fix the table migrations now (instead of using `.sync({alter: true})` method coz we want our migrations to be trackable by these migration files over the time, YIKES!)
	await runMigrations()
}

let connection = connect()

module.exports = {connection, sequelize, rollbackMigration}
global.sequelize = sequelize

// .then(() => {
// 	log('Connection has been established successfully.'.mb)
// })
// .catch((err) => {
// 	console.error('~Sahil: Unable to connect to the database :'.bgRed, err)
// })

// I don't need to export this now.. (i was using this in model only though ~ Sahil)
// module.exports = sequelize

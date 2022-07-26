const {Umzug, SequelizeStorage} = require('umzug') // src: https://github.com/sequelize/umzug
const {Sequelize} = require('sequelize')
const {NoteM, UserM, setupModels} = require('./models')
// @ts-ignore
const {logger} = require('sahilrajput03-logger')

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

logger.info('DATABASE_URL', DATABASE_URL)
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

const connect = async () => {
	try {
		await sequelize.authenticate()
		logger.success('connection to db::SUCCESSFUL')

		// Setup Models with sequelize
		setupModels(sequelize)

		// Create table if doesn't exist already!
		// Fix the schema on the fly.
		// This causes error imo when new tables are created so `alter: true` doesn't create the table at all as it only tries to fix the already existing tables.
		// await NoteM.sync({alter: true}) // LEARN: order of syncing these tables has to be like this only!
		// await UserM.sync({alter: true})

		// LEARN: We are gonna use different way to fix the table migrations now (instead of using `.sync({alter: true})` method coz we want our migrations to be trackable by these migration files over the time, YIKES!)
		await runMigrations()
	} catch (err) {
		logger.err('~Sahil: Unable to connect to the database :', err)
	}
}

let connection = connect()

module.exports = {sequelize, connection, rollbackMigration}

global.sequelize = sequelize

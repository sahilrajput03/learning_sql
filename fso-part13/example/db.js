const {Sequelize} = require('sequelize')

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

let connection = sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.'.mb)
	})
	.catch((err) => {
		console.error('~Sahil: Unable to connect to the database :'.bgRed, err)
	})

module.exports.sequelize = sequelize
module.exports.connection = connection
global.sequelize = sequelize

const {Sequelize} = require('sequelize')

let {DATABASE_URL, NODE_ENV} = process.env
// console.log({DATABASE_URL, NODE_ENV})
let log = console.log

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

console.log('DATABASE_URL'.bgGreen, DATABASE_URL.green)
const sequelize = new Sequelize(DATABASE_URL, config)

// Importing models here..
let {BlogM, init} = require('./models/Blog')
// log({sequelize})
init(sequelize)

// exporting a promise
let connection = sequelize.authenticate().then(() => {
	// Dont need to amend below code ever ~ Sahil
	if (process.env.NODE_ENV !== 'test') {
		// I am managing this in testing some other way coz this returns promise imo ~ so i should handle it different way with tests.
		BlogM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	}
})
module.exports = {BlogM, connection}
global.sequelize = sequelize

// .then(() => {
// 	console.log('Connection has been established successfully.'.mb)
// })
// .catch((err) => {
// 	console.error('~Sahil: Unable to connect to the database :'.bgRed, err)
// })

// I don't need to export this now.. (i was using this in model only though ~ Sahil)
// module.exports = sequelize

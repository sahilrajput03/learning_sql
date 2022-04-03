const {Sequelize} = require('sequelize')

const prod = 0
let DATABASE_URL, config
if (prod) {
	DATABASE_URL = process.env.db_connect_string
	config = {
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	}
} else {
	DATABASE_URL = 'postgres://array@localhost:5432/myDb1'
	// config = null; // Its must be null(can't send undefined).
	config = {
		logging: false, // Turn off logging, src: https://stackoverflow.com/a/55874733/10012446
	}
}

console.log('DATABASE_URL'.bgGreen, DATABASE_URL.green)
const sequelize = new Sequelize(DATABASE_URL, config)

sequelize
	.authenticate()
	.then(() => {
		console.log('Connection has been established successfully.'.mb)
	})
	.catch((err) => {
		console.error('~Sahil: Unable to connect to the database :'.bgRed, err)
	})

module.exports = sequelize

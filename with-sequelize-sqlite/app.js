const db = require('./db.js')
require('./colorsConfig')

// For express+sequelize example, please refer official guide on it
// https://github.com/sequelize/express-example

async function main() {
	try {
		await db.authenticate()
		console.log('\n:: ---- CONNECTED\n'.by)

		await require('./1')()

		await db.close() // close the connection.
		console.log('\n:: ---- DISCONNECTED\n'.by)
	} catch (error) {
		console.error('Unable to connect to the database:', error)
	}
}

main()

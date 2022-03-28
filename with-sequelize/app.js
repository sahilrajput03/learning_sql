require('colors')
const db = require('./db.js')
// const sequelize = require("seqelize");

async function main() {
	try {
		await db.authenticate()
		console.log('\n:: ---- CONNECTED\n'.yellow.bold)

		await require('./1')()

		await db.close() // close the connection.
		console.log('\n:: ---- DISCONNECTED\n'.yellow.bold)
	} catch (error) {
		console.error('Unable to connect to the database:', error)
	}
}

main()

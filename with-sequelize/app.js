const db = require('./db.js')
require('./colorsConfig')
// const sequelize = require("seqelize");

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

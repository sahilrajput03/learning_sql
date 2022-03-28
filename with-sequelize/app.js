require('colors')
const {Sequelize} = require('sequelize')

const sqz = new Sequelize({
	dialect: 'sqlite',
	storage: 'database.sqlite', // this is the filename.
})

async function main() {
	try {
		await sqz.authenticate()
		console.log('\n:: ---- CONNECTED\n'.yellow.bold)

		await require('./1')()

		await sqz.close() // close the connection.
		console.log('\n:: ---- DISCONNECTED\n'.yellow.bold)
	} catch (error) {
		console.error('Unable to connect to the database:', error)
	}
}

main()

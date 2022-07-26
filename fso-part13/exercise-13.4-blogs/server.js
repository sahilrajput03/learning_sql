require('dotenv').config({path: process.argv[2]})
// LEARN: It is important to separate app from this file bcoz we need to load .env.test file for app.js while running tests.
// LEARN: If we had put `require('dotenv').config()` in app.js we would not be able to load .env.test in the case of running a test with jest(We are loading .env.test file with `dotenv` in our tests before we import `App` module).

const app = require('./app')
const {connect} = require('./initPostgreSql')
const {logger, setupColors} = require('sahilrajput03-logger')

setupColors()
const PORT = process.env.PORT || 3001

async function main() {
	try {
		await connect()

		app.listen(PORT, () => {
			logger.success(`SERVER RUNNING ON PORT ${PORT}`)
		})
	} catch (error) {
		logger.err('SORRY, FAILED TO CONNECT TO DATABASE!!')
		process.exit(1)
	}
}
main()

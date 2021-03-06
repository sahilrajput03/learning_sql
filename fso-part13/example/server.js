const dotenv = require('dotenv')
dotenv.config({path: process.argv[2]})

let log = console.log
log('db url>>>>', process.env.DATABASE_URL)
require('./setupColors')

const app = require('./app')
// LEARN: It is important to separate app from this file bcoz we need to load .env.test file for app.js while running tests.
// LEARN: If we had put `require('dotenv').config()` in app.js we would not be able to load .env.test in the case of running a test with jest(We are loading .env.test file with `dotenv` in our tests before we import `App` module).

const PORT = process.env.PORT || 3001

async function main() {
	try {
		const {connection} = require('./db')
		await connection

		app.listen(PORT, () => {
			log(`Server running on port ${PORT}`)
		})
	} catch (error) {
		log('Sorry, failed to connect to database!!')
		process.exit(1)
	}
}
main()

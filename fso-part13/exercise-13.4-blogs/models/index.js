const {BlogM, init} = require('./Blog')

// In `test` environemnt we reset the tables completely to get pure testing (similar to pure functions).
if (process.env.NODE_ENV !== 'test') {
	// Create a table in the db if doesn't exist already using query: `CREATE TABLE IF NOT EXISTS`
	BlogM.sync() // ^^ that returns a async function though.
}

module.exports = {
	BlogM,
}

#!/usr/bin/env -S node -r
// Please run this file from src directory, i.e., `rpl repl.js`

const {NoteM} = require('./models')
const dotenv = require('dotenv')
// Setting envionment on start of the program is necessary.
dotenv.config({
	path: '../.env.test',
})

const greet = 'Welcome to repl mode'
console.log(greet)

async function main() {
	await require('./initPostgreSql')
}
main()

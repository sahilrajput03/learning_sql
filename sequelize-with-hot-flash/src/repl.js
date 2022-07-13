/**
 * USAGE: `rpl repl.js`
 */

const {NoteM} = require('./models')
const dotenv = require('dotenv')

// Setting envionment on start of the program is necessary.
dotenv.config({
	path: '../.env.test',
})

/**
 * Useful to convert something, i.e, an sqlz array/item to vanilla js object/array of objects.
 * Use it only in repl mode else don't be this lazy at but execute the inside code each time to have close feelings with code.
 * */
const clean = (d) => {
	if (Array.isArray(d)) {
		return d.map((row) => row.toJSON())
	} else {
		return d.toJSON()
	}
}

const greet = 'Welcome to repl mode'
console.log(greet)

// Use m, n and a in repl mode to access their values blazingly fast... ~Sahil
let m = NoteM,
	n,
	a

async function main() {
	await require('./initPostgreSql')

	let NOTES = [
		{
			content: 'i am note 1',
			important: false,
			date: new Date(),
		},
		{
			content: 'i am note 2',
			important: false,
			date: new Date(),
		},
	]

	// Clear notes table
	await m.destroy({where: {}})

	await m.sync({force: true})

	// Add some dummy data to play with
	let notes_sqz = await m.bulkCreate(NOTES)
	n = notes_sqz.map((n) => n.toJSON())

	a = await m.findAll()
	a = a.map((n) => n.toJSON())
}
main()

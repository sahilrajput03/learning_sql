require('dotenv').config()
const {expect} = require('expect')
// expect DOCS (from jest): https://jestjs.io/docs/expect
// toMatchObject: (src: https://jestjs.io/docs/expect#tomatchobjectobject) Used to check that a JavaScript object matches a subset of the properties of an object

// LEARN: ALL CONNECTION AND MODEL RELATED STUFF GOES HERE..
connectToDb(async () => {
	// await require('./initMongodb.js')
	await require('./initPostgreSql')
	log('connected to db..')
	setTimeout(() => {}, 10 * 60 * 1000)
})

beforeAll(async () => {
	await NoteM.sync({force: true}) // This creates the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/
})

// LEARN: You may never use console.log but simply use debugger to debug values like reply below by placing breakpoint in the functin end brace.
const _note = {
	// id: '', // You should not give id manually coz its always auto assigned.
	content: 'i am note 1',
	important: false,
	date: new Date(),
}

test('save note', async () => {
	const note = await NoteM.create(_note)
	expect(note.dataValues).toMatchObject(_note)
})

test('save note with given id', async () => {
	const _noteWithId = {..._note, id: 2}
	const note = await NoteM.create(_noteWithId)
	expect(note.dataValues).toMatchObject(_noteWithId)
})

test('save note with already existing id should throw error', async () => {
	const _noteWithId = {..._note, id: 2}

	const er = 'id must be unique'

	expect(async () => {
		let note = await NoteM.create(_noteWithId)
	}).rejects.toThrow('Validation error')
	// LEARN: `rejects.toThrow` method compares `error.message` property

	// Testing specific errors with above operation.
	try {
		let note = await NoteM.create(_noteWithId)
	} catch (error) {
		let expectedMessage1 = 'Validation error'
		let expectedMessage2 = 'id must be unique'

		expect(error.message).toBe(expectedMessage1)
		expect(error.errors[0].message).toBe(expectedMessage2)
	}
})

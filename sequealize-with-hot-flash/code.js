require('dotenv').config()
const {Op} = require('sequelize')
// log('::Available operators::', Object.keys(Op))
// eg,ne,gte,gt,lte,lt,not,is,notIn,notLike,iLike,notILike,etc
const {expect} = require('expect')
// expect DOCS (from jest): https://jestjs.io/docs/expect
// toMatchObject: (src: https://jestjs.io/docs/expect#tomatchobjectobject) Used to check that a JavaScript object matches a subset of the properties of an object

//? Sequelize querying methods: https://sequelize.org/docs/v6/core-concepts/model-querying-finders/

watchingService()

// LEARN: ALL CONNECTION AND MODEL RELATED STUFF GOES HERE..
connectToDb(async () => {
	// await require('./initMongodb.js')
	await require('./initPostgreSql')
	log('connected to db..')
})

beforeAll(async () => {
	// let k = await sequelize.sync({force: true})
	await NoteM.sync({force: true}) // This creates the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/
})

// LEARN: You may never use console.log but simply use debugger to debug values like reply below by placing breakpoint in the functin end brace.
const _note = {
	// id: '', // You should *not* give id manually coz its always auto assigned.
	content: 'i am note 1',
	important: false,
	date: new Date(),
}

test('save note', async () => {
	const note = await NoteM.create(_note)
	expect(note).toMatchObject(_note)
	expect(note.dataValues).toMatchObject(_note)
})

test('find a note by primary key', async () => {
	let id = 1
	const note = await NoteM.findByPk(id)

	expect(note).toMatchObject({..._note, id})
})

test('findOne using filter', async () => {
	const note = await NoteM.findOne({where: {content: 'i am note 1'}})

	expect(note).toMatchObject(_notes[0])
	expect(note.dataValues).toMatchObject(_notes[0])
})

test('save note with given id', async () => {
	const _noteWithId = {..._note, id: 2}
	const note = await NoteM.create(_noteWithId)
	expect(note.dataValues).toMatchObject(_noteWithId)
})

let dataValues = (data) => data.map((n) => n.dataValues)

test('saving note with duplicate id should throw unique id error', async () => {
	// inspiration: https://stackoverflow.com/a/48707461/10012446
	let receivedErr

	try {
		let _noteWithId = {..._note, id: 2}
		let note = await NoteM.create(_noteWithId)
	} catch (err) {
		receivedErr = err
	}

	const validationErr = 'Validation error'
	const uniqueIdErr = 'id must be unique'

	expect(receivedErr.message).toBe(validationErr)
	expect(receivedErr.errors[0].message).toBe(uniqueIdErr)
})

test('drop notes table', async () => {
	// Below method doesn't return anything meaningful ~ imo ~ Sahil
	await NoteM.sync({force: true}) // This creates the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/

	let notes = await NoteM.findAll()
	expect(notes.length).toBe(0)
})

let _notes = [
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

test('insert many notes/rows', async () => {
	let notes = await NoteM.bulkCreate(_notes)
	notes = dataValues(notes)

	expect(notes.length).toBe(_notes.length)

	notes.forEach((note, idx) => {
		expect(note).toMatchObject(_notes[idx])
	})
})

test('get all notes/rows', async () => {
	let notes = await NoteM.findAll()

	dataValues(notes).forEach((row, idx) => {
		expect(row).toMatchObject(_notes[idx])
	})
})

test('get all notes/rows (with empty filter)', async () => {
	let filter = {}
	let notes = await NoteM.findAll(filter)

	dataValues(notes).forEach((row, idx) => {
		expect(row).toMatchObject(_notes[idx])
	})
})

test('get all notes/rows using for a matching property value', async () => {
	const notes = await NoteM.findAll({where: {important: false}})

	dataValues(notes).forEach((row, idx) => {
		expect(row).toMatchObject(_notes[idx])
	})
})

test('pagination', async () => {
	// drop notes table
	await NoteM.sync({force: true})

	// Saving 8 notes from data.js file
	let _notes = require('./data')
	let notes = await NoteM.bulkCreate(_notes)

	// pagination
	let page = 1 // e.g., 1,2,3...
	let limit = 2 // items per page
	let offset = (page - 1) * limit
	// LEARN: offset=skip we use mongoosejs, yikes!

	// LEARN: The findAndCountAll method is a convenience method that combines findAll and count.
	// Docs: https://sequelize.org/docs/v6/core-concepts/model-querying-finders/#findandcountall
	const {count, rows} = await NoteM.findAndCountAll({
		where: {
			content: {
				[Op.like]: 'i am note%', // This searchs for any row that entry for content having prefix as `i am note`
			},
		},
		offset,
		limit,
	})
	expect(dataValues(rows).length).toBe(limit)

	// LEARN: count is the total number of results in db!
	expect(count).toBe(_notes.length)
})

// Learn JEST:
// expect(async () => {
// 	let note = await NoteM.create(_noteWithId)
// }).rejects.toThrow('Validation error')
// LEARN: `rejects.toThrow` method compares `error.message` property

// This works buddy in jest though!
// expect(() => {
// 	throw new Error('cool')
// }).toThrow('cool')

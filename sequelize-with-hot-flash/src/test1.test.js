const {Op} = require('sequelize')
const {expect} = require('expect')
const dotenv = require('dotenv')
const DUMMY_NOTES = require('./dummyNotes')
const {NoteM} = require('./models')

// Setting envionment on start of the program is necessary.
dotenv.config({
	path: '.env.test',
})

/**
 * Docs and Learnings ~Sahil
 * =========================
 *
 * DOCS - SEQUELIZE
 * ================
 * expect : https://jestjs.io/docs/expect
 * `toMatchObject`: Used to check that a JavaScript object matches a subset of the properties of an object.
 * src: https://jestjs.io/docs/expect#tomatchobjectobject
 *
 * SEQUELIZE QUERYING METHODS:
 * ===========================
 * Sequelize querying methods (findAll, findByPk, findOne, findOrCreate, findAndCountAll): https://sequelize.org/docs/v6/core-concepts/model-querying-finders/
 *
 * OPERATORS FROM SEQUELIZE:
 * =========================
 * log('::Available operators::', Object.keys(Op)) // Output: eg,ne,gte,gt,lte,lt,not,is,notIn,notLike,iLike,notILike,in etc.
 */

let connectToDb = global.connectToDb,
	closeDb = global.closeDb,
	beforeAll = global.beforeAll,
	test = global.test,
	log = global.log,
	describe = global.describe

// LEARN: ALL CONNECTION AND MODEL RELATED STUFF GOES HERE..
connectToDb(async () => {
	await require('./initPostgreSql')
})

closeDb(async () => {
	const db = global.sequelize // using global.sequelize is necessary ~Sahil
	await db.close() // close the connection.
})

beforeAll(async () => {
	// Create the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	// LEARN: .sync method also returns a promise, how badly sequelize has named this particular naming ~ Sahil. :(
	await NoteM.sync({force: true})
})

// LEARN: You may never use console.log but simply use debugger to debug values like reply below by placing breakpoint in the functin end brace.

const NOTE = {
	// id: '', // You should *not* give id manually coz its always auto assigned.
	content: 'i am note 1',
	important: false,
	date: new Date(),
}

const NOTE_WITH_ID = {...NOTE, id: 2}

// Sequelize docs on .toJSON(), https://sequelize.org/docs/v6/core-concepts/model-instances/#note-logging-instances
// Sequlize object to plain js object, src: https://stackoverflow.com/questions/21961818/sequelize-convert-entity-to-plain-object
// Issue @ sequelize: https://github.com/sequelize/sequelize/issues/4291

test('save note', async () => {
	const note_sqz = await NoteM.create(NOTE)
	expect(note_sqz).toMatchObject(NOTE) // this has lots of unnecessar information so not suitable to send over http request.

	let note = note_sqz.toJSON()
	expect(note).toMatchObject(NOTE)
	expect(typeof note).toBe('object')
})

test('find a note by primary key', async () => {
	let id = 1
	const note = await NoteM.findByPk(id)

	expect(note).toMatchObject({...NOTE, id})
})

test('findOne using filter', async () => {
	const note = await NoteM.findOne({where: {content: 'i am note 1'}})

	const expected = {...NOTE}
	delete expected.date // ! THIS SUCK WITH TIME INCONSISTENSIES, Not matching date coz sometimes it causes discrepancies idk why the date saved in db is actually a delayed time IDK

	expect(note.toJSON()).toMatchObject(NOTE)
})

test('a non-existent note/row is null', async () => {
	const note = await NoteM.findOne({where: {content: 'i am a non-existent note'}})

	expect(note).toBeNull()
})

test('save note with given id', async () => {
	const note = await NoteM.create(NOTE_WITH_ID)

	expect(note.toJSON()).toMatchObject(NOTE_WITH_ID)
})

//?I don't prefer to use this at all. => let dataValues = (data) => data.map((n) => n.dataValues)

test('saving note with duplicate id should throw unique id error', async () => {
	// inspiration: https://stackoverflow.com/a/48707461/10012446
	let receivedErr

	try {
		let _noteWithId = {...NOTE, id: 2}
		let note = await NoteM.create(_noteWithId)
	} catch (err) {
		receivedErr = err
	}

	const validationErr = 'Validation error'
	const uniqueIdErr = 'id must be unique'

	expect(receivedErr.message).toBe(validationErr)
	expect(receivedErr.errors[0].message).toBe(uniqueIdErr)
})

let FILTER_MATCH_ALL = {where: {}}

test('drop notes table (#delete all)', async () => {
	await NoteM.destroy(FILTER_MATCH_ALL)

	let notes = await NoteM.findAll()
	expect(notes.length).toBe(0)
})

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

test('insert many notes/rows', async () => {
	// drop notes table
	await NoteM.destroy(FILTER_MATCH_ALL)

	let notes_sqz = await NoteM.bulkCreate(NOTES)
	let notes = notes_sqz.map((n) => n.toJSON())

	expect(notes.length).toBe(NOTES.length)
	notes.forEach((note, idx) => {
		expect(note).toMatchObject(NOTES[idx])
	})
})

test('count document', async () => {
	const filter = {}
	let notesCount = await NoteM.count(filter)

	expect(notesCount).toBe(NOTES.length)
})

test('get all notes/rows', async () => {
	let notes_sqz = await NoteM.findAll()

	// FSO WAY and Sequelize docs way: (actually good way!)
	let notes = notes_sqz.map((n) => n.toJSON())
	notes.forEach((row, idx) => {
		expect(row).toMatchObject(NOTES[idx])
	})
})

test('get all notes/rows (with empty filter)', async () => {
	let filter = {}
	let notes_sqz = await NoteM.findAll(filter)

	let notes = notes_sqz.map((n) => n.toJSON())

	notes.forEach((row, idx) => {
		expect(row).toMatchObject(NOTES[idx])
	})
})

test('get all notes/rows using for a matching property value', async () => {
	const notes_sqz = await NoteM.findAll({where: {important: false}})

	let notes = notes_sqz.map((n) => n.toJSON())

	notes.forEach((row, idx) => {
		expect(row).toMatchObject(NOTES[idx])
	})
})

test('pagination', async () => {
	// drop notes table
	await NoteM.destroy(FILTER_MATCH_ALL)

	// Saving 8 notes from data.js file
	let __notes = await NoteM.bulkCreate(DUMMY_NOTES)

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
				[Op.like]: 'i am note%', // This searchs for any row that entry for content having prefix as `i am note` // #using like operator, for search indexing
			},
		},
		offset,
		limit,
	})

	let notes = rows.map((n) => n.toJSON())
	// console.log(notes)
	expect(notes.length).toBe(limit)

	// LEARN: count is the total number of results in db!
	expect(count).toBe(DUMMY_NOTES.length)
})

test('delete a note/row', async () => {
	const note = await NoteM.findOne({where: {id: 8}})
	expect(note).not.toBeNull()

	// Docs: https://sequelize.org/docs/v6/core-concepts/paranoid/#deleting
	let deleteCount = await NoteM.destroy({
		where: {
			id: 8,
		},
	})

	expect(deleteCount).toBe(1)

	// Check if its deleted!
	const nonExistentNote = await NoteM.findOne({where: {id: 8}})
	expect(nonExistentNote).toBeNull()
})

test('delete many notes/rows', async () => {
	let filter = {
		where: {
			content: {
				[Op.like]: '%note%', // This searchs for any row that entry for content having  text `note` in it.
			},
		},
	}

	let count = await NoteM.count(filter)
	expect(count).not.toBe(0)

	let deletedCount = await NoteM.destroy(filter)
	expect(deletedCount).toBe(count)

	count = await NoteM.count(filter)
	expect(count).toBe(0)
})

const ERROR_NAME = 'SequelizeUniqueConstraintError'
const ERROR_MESSAGE_UNIQUE = 'Validation error'

describe('testing errors with sequelize', () => {
	test('SAMPLE', async () => {
		expect(() => {
			throw new Error('cool')
		}).toThrow('cool')
	})

	test('validation err', async () => {
		expect(async () => {
			await NoteM.destroy({where: {}})
			await NoteM.create(NOTE_WITH_ID)
			await NoteM.create(NOTE_WITH_ID)
		}).rejects.toThrow(ERROR_MESSAGE_UNIQUE) // LEARN: `rejects.toThrow` method compares `error.message` property
	})

	// ? A simple test to verify sequelize error.
	test('test validation errors using simple expects', async () => {
		let err
		try {
			await NoteM.create(NOTE_WITH_ID)
			await NoteM.create(NOTE_WITH_ID)
		} catch (error) {
			err = error
		}
		expect(err.name).toBe(ERROR_NAME)
		expect(err.message).toBe(ERROR_MESSAGE_UNIQUE)
	})
})

describe('delete multiple of given ids', async () => {
	let NOTES_WITH_IDS = [
		{
			id: 1,
			content: 'i am note 1',
			important: false,
			date: new Date(),
		},
		{
			id: 2,
			content: 'i am note 2',
			important: false,
			date: new Date(),
		},
	]

	test('using simple array way', async () => {
		// Reset and bulkInsert notes
		await NoteM.destroy(FILTER_MATCH_ALL)
		let expectedIds = NOTES_WITH_IDS.map((n) => n.id)

		let noteIds = (await NoteM.bulkCreate(NOTES_WITH_IDS)).map((n) => n.toJSON().id)
		expect(noteIds).toEqual(expectedIds)

		// Delete using filter1
		let filter1 = {where: {id: noteIds}}
		let deletedCount = await NoteM.destroy(filter1)
		expect(deletedCount).toBe(noteIds.length)
	})

	test('using `Op.in` operator way', async () => {
		// Reset and bulkInsert notes
		await NoteM.destroy(FILTER_MATCH_ALL)
		let expectedIds = NOTES_WITH_IDS.map((n) => n.id)

		let noteIds = (await NoteM.bulkCreate(NOTES_WITH_IDS)).map((n) => n.toJSON().id)
		expect(noteIds).toEqual(expectedIds)

		// Delete using filter2
		let filter2 = {where: {id: {[Op.in]: noteIds}}} // Using in operator
		let deletedCount = await NoteM.destroy(filter2)
		expect(deletedCount).toBe(noteIds.length)
	})
})

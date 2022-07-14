const {Op} = require('sequelize')
const {expect} = require('expect')
const dotenv = require('dotenv')
const DUMMY_NOTES = require('./dummyNotes')
const {NoteM} = require('./models')
// @ts-ignore
const {loggert} = require('@array/logger')

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
	// vs.
	// await NoteM.destroy({where: {}})
	// ^^^ This deletes all the notes but keeps the hold on older ids of which were previously created, thus any new notes created will have ids in sequence continuing from the last id of the previous deleted notes.
})

// LEARN: You may never use console.log but simply use debugger to debug values like reply below by placing breakpoint in the functin end brace.

const NOTE = {
	// id: '', // You should *not* give id manually coz its always auto assigned.
	content: 'i am note 1',
	important: false,
	date: new Date(),
}

const NOTE_WITH_ID = {...NOTE, id: 101}

// Sequelize docs on .toJSON(), https://sequelize.org/docs/v6/core-concepts/model-instances/#note-logging-instances
// Sequlize object to plain js object, src: https://stackoverflow.com/questions/21961818/sequelize-convert-entity-to-plain-object
// Issue @ sequelize: https://github.com/sequelize/sequelize/issues/4291

test('save note', async () => {
	const note_sqz = await NoteM.create(NOTE)
	// If you don't specify any field value(which is there in schema) will be assigned NULL as value.
	// If you specify any field that is not in model, then it'll be removed simply!

	expect(note_sqz).toMatchObject(NOTE) // this has lots of unnecessar information so not suitable to send over http request.

	let note = note_sqz.toJSON()
	expect(note).toMatchObject(NOTE)
	expect(typeof note).toBe('object')
})

test('save note using build method', async () => {
	/** @type any */
	const noteBuild = NoteM.build(NOTE)
	noteBuild.important = true // Also legit way to change properties.
	let note_sqz = await noteBuild.save()
	let note = note_sqz.toJSON()
	// loggert.info(note)
})

test('save note and save only certain properties', async () => {
	const note_sqz = await NoteM.create(NOTE, {
		fields: ['content'], // only `content` property will be saved for the note and rest other properties will be discarded.
	})

	let note = note_sqz.toJSON()
	// loggert.info(note) // important and date value will be either null or their deafult property if set in the model definition.
	expect(note.content).toBe(NOTE.content)
	expect(note.important).toBeNull()
	expect(note.date).toBeNull()
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

test('drop notes table (#delete all)', async () => {
	await NoteM.sync({force: true})

	let notes = (await NoteM.findAll()).map((n) => n.toJSON())
	loggert.info(notes)
	expect(notes.length).toBe(0)
})

/* 	
	? Both of below ways also delete all rows in the table but the new ids given to newer notes will continue from the maximum id that was earlier present for some row in the table. So better to use `Model.sync({force: true})` to empty the table in comletely fresh manner.
	await NoteM.destroy({truncate: true})
	await NoteM.destroy({where: {}})
	
	? For verifying ids of newer created notes when we use any of above two ways of clearing the table.
	let notes_sqz = await NoteM.bulkCreate(NOTES)
*/

let NOTES = [
	{
		content: 'i am note 1',
		important: false,
		date: new Date(),
	},
	{
		content: 'i am note 2',
		important: true,
		date: new Date(),
	},
]

test('insert many notes/rows', async () => {
	// drop notes table
	await NoteM.sync({force: true})

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

test('using "GROUP BY" to get count for all the rows which have same values in that column', async () => {
	let sequelize = global.sequelize

	let notes_sqz = await NoteM.findAll({
		attributes: [
			[sequelize.fn('COUNT', sequelize.col('important')), 'n_important'],
			// [sequelize.fn("COUNT", sequelize.col("cash")), "n_cash"],
			/** Putting more attributes here break the output,says something like "you must use some aggregation/group by thing to use it." */
		],
	})
	let notes = notes_sqz.map((n) => n.toJSON())
	// loggert.info(notes)
	expect(notes).toEqual([{n_important: '2'}])
})

test('get all notes/rows', async () => {
	let notes_sqz = await NoteM.findAll()

	const isEveryNoteIsSequelizeModelInstance = notes_sqz.every((n) => n instanceof NoteM)
	expect(isEveryNoteIsSequelizeModelInstance).toBe(true)

	let notes = notes_sqz.map((n) => n.toJSON())
	// loggert.info(notes)
	notes.forEach((row, idx) => {
		expect(row).toMatchObject(NOTES[idx])
	})
})

test('get all notes but only specific properties of each note (attributes)', async () => {
	let notes_sqz = await NoteM.findAll({
		attributes: ['id', 'important'],
	})

	let notes = notes_sqz.map((n) => n.toJSON())
	// loggert.info(notes)
	notes.forEach((n) => {
		let keyNames = Object.keys(n) // array
		let numberOfKeys = keyNames.length // number of keys in the object.
		expect(numberOfKeys).toBe(2) // bcoz `id` and `important` adds to two properties.
		expect(keyNames).toStrictEqual(['id', 'important'])
	})
})

test('exclude specific properties when fetching', async () => {
	let notes_sqz = await NoteM.findAll({
		attributes: {
			exclude: ['id', 'content'],
			// This will fetch all properties except id and age fields.
		},
	})
	let notes = notes_sqz.map((n) => n.toJSON())
	notes.forEach((n) => {
		let keys = Object.keys(n)
		// loggert.info(keys)
		expect(keys).toEqual(['important', 'date'])
		expect(n.id).toBeUndefined()
		expect(n.content).toBeUndefined()
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

test('get all notes/rows using filter', async () => {
	const notes_sqz = await NoteM.findAll({where: {important: false}})

	let notes = notes_sqz.map((n) => n.toJSON())

	notes.forEach((row, idx) => {
		expect(row).toMatchObject(NOTES[idx])
	})
})

test('pagination', async () => {
	// drop notes table
	await NoteM.sync({force: true})

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
			// This will destroy multiple records if matched!
			id: 8,
			// Other fields can be added here as well.
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
		await NoteM.sync({force: true})
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
		await NoteM.sync({force: true})
		let expectedIds = NOTES_WITH_IDS.map((n) => n.id)

		let noteIds = (await NoteM.bulkCreate(NOTES_WITH_IDS)).map((n) => n.toJSON().id)
		expect(noteIds).toEqual(expectedIds)

		// Delete using filter2
		let filter2 = {where: {id: {[Op.in]: noteIds}}} // Using in operator
		let deletedCount = await NoteM.destroy(filter2)
		expect(deletedCount).toBe(noteIds.length)
	})
})

test('using op.eq', async () => {
	await NoteM.bulkCreate(DUMMY_NOTES)

	let notes_sqz = await NoteM.findAll({
		where: {
			// age: {
			important: {
				[Op.eq]: false,
				// This is equivalent to `important: false` ~ imo i.e., having no operator at all.
			},
			// Other fields can be specified here too.
		},
		// This will fetch multiple records if matched!
		// Also, will fetch empty array if nothing is matched.
	})
	let notes = notes_sqz.map((n) => n.toJSON())
	// loggert.info(notes)
	const nonImportantInDummyNotes = DUMMY_NOTES.filter((n) => n.important === false).length
	expect(notes.length).toBe(nonImportantInDummyNotes)
	/**
	 * Read all operators @ https://sequelize.org/master/manual/model-querying-basics.html#operators

	Op.eq =

	Op.ne !=

	Op.is , Used to check for null, true, false values.
	Read more about is operator at postgres docs(not sequelize), https://www.postgresql.org/docs/9.1/functions-comparison.html

	OP.not , Used to check for null, true, false values. Its just opposite of Op.is thingg.

	Op.or , Feed values as an array i.e., [5,6]

	Op.gt , greater than

	Op.gte , greater than equal to

	Op.lt , less than

	Op.lte , less than equal to

	Op.between , Feed value as array i.e., [6,10]

	Op.notBetween , Feed value as array i.e., [11,15]
 */
})

test('using "Op.or" operator', async () => {
	let notes_sqz = await NoteM.findAll({
		where: {
			[Op.or]: [{id: 1}, {id: 4}],
			// Other fields can be specified here too.
		},
		// This will fetch multiple records if matched!
		// Also, will fetch empty array if nothing is matched.
	})
	let notes = notes_sqz.map((n) => n.toJSON())
	// loggert.info(notes)
	let ids = notes.map((n) => n.id)
	// loggert.info({ids})
	expect(ids.length).toBe(2)
	expect(ids).toEqual([1, 4])
})

test('using "Op.or" operator with destroy', async () => {
	let deletedCount = await NoteM.destroy({
		where: {
			id: {
				[Op.or]: [1, 4],
			},
		},
	})
	// loggert.info(deletedCount)
	expect(deletedCount).toBe(2)
})

test('update a note', async () => {
	let update = {content: 'i am super note 6'}
	let filter = {
		where: {
			id: '6',
			content: 'i am note 6',
		},
	}

	let [updateCount] = await NoteM.update(
		update, // NOTE: This type of update is type of update like newData = {...oldData, cash: "6_999"} i.e., other older properties will be preserved, yikes!
		filter
	)

	// loggert.info(updateCount)
	expect(updateCount).toBe(1) // total number of rows updated is 1 in our case.

	let note_sqz = await NoteM.findByPk(6) // this finds by "id:6"
	let note = note_sqz.toJSON()
	expect(note.content).toBe(update.content)
})

test('update all non-important notes to important', async () => {
	let filter = {
		where: {
			important: false,
		},
	}

	let update = {important: true}
	let [updateCount] = await NoteM.update(
		update, // NOTE: This type of update is type of update like newData = {...oldData, lastName: "Doe"} i.e., other older properties will be preserved, yikes!
		filter
	)
	// loggert.info(updateCount)
	expect(updateCount).toBe(3) // 3 is manually verified from above log.

	let notes = (await NoteM.findAll()).map((n) => n.toJSON())
	// loggert.info(notes)
	notes.forEach((n) => {
		expect(n.important).toBe(true)
	})
})

test('drop table', async () => {
	await NoteM.drop() // It drops the table completely and doesn't return anything.
	console.log('::MyInfo::User table dropped!')

	// RE-Create table to prevent errors from sequelize from further queries.
	await NoteM.sync({force: true})

	let notes = (await NoteM.findAll()).map((n) => n.toJSON())
	// loggert.info(notes)
})

test('delete all tables in the db', async () => {
	const sequelize = global.sequelize
	await sequelize.drop() // Removes all tables
	// loggert.info('::MyInfo::All tables dropped!')
})

test('re-create notes table', async () => {
	await NoteM.sync({force: true})

	let notes = (await NoteM.findAll()).map((n) => n.toJSON())
})

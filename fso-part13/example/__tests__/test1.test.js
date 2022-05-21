/* global connectToDb, closeDb beforeAll test sequelize */
//? Use .env.test file for environment.
const path = require('path')
const dotenv = require('dotenv')
dotenv.config({path: path.join(__dirname, '..', '.env.test')}) // Joining path using path.join and __dirname allows us to execute files withSupertest using `fr withSupertest` from inside __tests__ folder and from the root folder as well.

if (process.env.NODE_ENV !== 'test' || !process.env.DATABASE_URL.includes('test')) {
	console.log("what's going on??", process.env.NODE_ENV !== 'test', !process.env.DATABASE_URL.includes('test'))
	throw new Error('*CRITICAL ERROR*: You are not using test environment ~ flash-runner')
}

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const {expect} = require('expect')
const NoteM = require('../models/Note')
const chalk = require('chalk')

let log = (...args) => console.log(chalk.blue.bgRed.bold(...args))
let js = (...args) => JSON.stringify(...args)

// withSupertest.test
connectToDb(async () => {
	// await require('../initMongodb.js')
	const {connection} = require('../db')
	// wait till the connection establishes to postgresql!
	await connection
	log('connection to db::SUCCESSFUL')
})

closeDb(async () => {
	// await mongoose.connection.close()
	const db = sequelize
	await db.close() // close the connection.
})

beforeAll(async () => {
	// Fix the schema on the fly.
	await NoteM.sync({alter: true})

	// Create the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	// LEARN: .sync method also returns a promise, how badly sequelize has named this particular naming ~ Sahil. :(
	await NoteM.sync({force: true})
})

test('post a note', async () => {
	const expectedBody = {content: 'very good buddy!'}

	const {body} = await api.post('/api/notes').send(expectedBody).expect(200)
	expect(body).toMatchObject(expectedBody)
	expect(body).toHaveProperty('id')
})

test('modify note', async () => {
	const expectedBody = {content: 'this is new note', important: false}

	let {body} = await api.put('/api/notes/1').send(expectedBody)

	expect(body).toMatchObject(expectedBody)
})

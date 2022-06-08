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
// const NoteM = require('../models/Note')
const {NoteM, UserM} = require('../models/')
const chalk = require('chalk')

let log = (...args) => console.log(chalk.blue.bgRed.bold(JSON.stringify(...args, null, 2)))
// let log = (...args) => console.log(chalk.blue.bgRed.bold(...args))
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
	// Create the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	// LEARN: .sync method also returns a promise, how badly sequelize has named this particular naming ~ Sahil. :(
	await NoteM.sync({force: true})
	await UserM.sync({force: true})
})

//! USERS ROUTER TESTS //
test('post user', async () => {
	// empty users table
	await UserM.sync({force: true})

	const expectedBody = {username: 'sahilrajput03', name: 'Sahil Rajput'}
	const {body} = await api.post('/api/users').send(expectedBody)

	expect(body).toMatchObject(expectedBody)
	expect(body).toHaveProperty('id')
	// console.log({body})
})

test('get single users', async () => {
	const expectedBody = {id: 1, username: 'sahilrajput03', name: 'Sahil Rajput'}

	const {body} = await api.get('/api/users/1')

	expect(body).toMatchObject(expectedBody)
})

test('get all users', async () => {
	const expectedBody = [{notes: [], id: 1, username: 'sahilrajput03', name: 'Sahil Rajput'}]
	const {body} = await api.get('/api/users')

	expect(body).toEqual(expect.arrayContaining(expectedBody))
})

test('LEARN: array containing an object', () => {
	// src: https://jestjs.io/docs/expect#expectarraycontainingarray
	const expected = [{name: 'Sahil'}]
	const received = [{name: 'Sahil'}, {name: 'Rohit'}]

	expect(received).toEqual(expect.arrayContaining(expected))
})

//! LOGIN ROUTER TEST
test('login (failed scenario)', async () => {
	const expectedErr = {
		error: 'invalid username or password',
	}
	const {body, statusCode} = await api.post('/api/login').send({username: 'sahilrajput03'})

	expect(statusCode).toBe(401)
	expect(body).toMatchObject(expectedErr)
})

let _token
test('login', async () => {
	const cred = {username: 'sahilrajput03', password: 'secret'}
	const expectedBody = {username: 'sahilrajput03', name: 'Sahil Rajput'}

	const {body, statusCode} = await api.post('/api/login').send(cred)

	expect(statusCode).toBe(200)
	expect(body).toMatchObject(expectedBody)
	expect(body).toHaveProperty('token')
	_token = 'bearer ' + body.token
})

//! NOTES ROUTER TESTS //
test('post a note', async () => {
	// // create a user
	// await api.post('/api/users').send({username: 'username001', name: 'alice robert', token: _token})

	const expectedBody = {content: 'very good buddy!'}

	const {body} = await api.post('/api/notes').set('Authorization', _token).send(expectedBody).expect(200)
	expect(body).toMatchObject(expectedBody)
	expect(body).toHaveProperty('id')
	log(body)
})

// This test is intentionally put after posting a note so that we see notes attached in the user output.
test('get all users with some linked notes', async () => {
	const {body} = await api.get('/api/users')
	// log(body)
})

test('modify note', async () => {
	const expectedBody = {content: 'this is new note', important: false}

	let {body} = await api.put('/api/notes/1').send(expectedBody)

	expect(body).toMatchObject(expectedBody)
})

test('delete note', async () => {
	let {status} = await api.delete('/api/notes/1')
	expect(status).toBe(204)
})

test('all notes', async () => {
	// Clear db
	await NoteM.sync({force: true})

	const expectedBody = {content: 'very good buddy!'}

	await api.post('/api/notes').send(expectedBody).set('Authorization', _token).expect(200)
	await api.post('/api/notes').send(expectedBody).set('Authorization', _token).expect(200)

	const {body, statusCode} = await api.get('/api/notes')

	// log({body})

	expect(statusCode).toBe(200)
	expect(body.length).toBe(2)
})

test('reset notes', async () => {
	const response = await api.delete('/api/notes/reset').expect(200)
	const expectedResponse = {message: 'notes removed!'}
	expect(response.body).toMatchObject(expectedResponse)

	// Verify
	const {body} = await api.get('/api/notes').expect(200)
	expect(body.length).toBe(0)
})

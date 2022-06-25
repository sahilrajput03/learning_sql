/* global connectToDb, closeDb beforeAll test sequelize */
//? Use .env.test file for environment.
// @ts-ignore
const {loggert} = require('logger-sahil')
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
const {NoteM, UserM, TeamM, MembershipM, UserNotesM} = require('../models/')
const chalk = require('chalk')

let js = (...args) => JSON.stringify({...args})

// Reuired bcoz I am using @ts-check and it complains via vscode.
let isFlashRunner = global.isFlashRunner,
	connectToDb = global.connectToDb,
	sequelize = global.sequelize,
	closeDb = global.closeDb,
	beforeAll = global.beforeAll,
	test = global.test

// withSupertest.test
connectToDb(async () => {
	// await require('../initMongodb.js')
	const {connection} = require('../db')
	// wait till the connection establishes to postgresql!
	await connection
})

closeDb(async () => {
	// await mongoose.connection.close()
	const db = global.sequelize
	await db.close() // close the connection.
})

beforeAll(async () => {
	// Create the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	// LEARN: .sync method also returns a promise, how badly sequelize has named this particular naming ~ Sahil. :(
	await NoteM.sync({force: true})
	await UserM.sync({force: true})
	await TeamM.sync({force: true})
	await MembershipM.sync({force: true})
	await UserNotesM.sync({force: true})
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

test('get single user', async () => {
	const expectedBody = {id: 1, username: 'sahilrajput03', name: 'Sahil Rajput'}

	const {body} = await api.get('/api/users/1')
	// loggert.info(body)

	expect(body).toMatchObject(expectedBody)
	expect(body).toHaveProperty('note_count')
})

test('get all users', async () => {
	// Test a single user only in the give array of users from backend.
	const expected = {notes: [], id: 1, username: 'sahilrajput03', name: 'Sahil Rajput'}

	let {body} = await api.get('/api/users')
	// loggert.info(body)

	// ? See below `LEARN:` test to know the minimal working of this and source of learning.
	expect(body).toEqual(expect.arrayContaining([expect.objectContaining(expected)]))
})

test('get all users + {admin, disabled} props <duplicate_of_above>', async () => {
	const expected = {admin: false, disabled: false, notes: [], id: 1, username: 'sahilrajput03', name: 'Sahil Rajput'}

	let {body} = await api.get('/api/users')
	// loggert.info(body)

	// ? See below `LEARN:` test to know the minimal working of this and source of learning.
	expect(body).toEqual(expect.arrayContaining([expect.objectContaining(expected)]))
})

test('LEARN: array containing an object', () => {
	// src: https://jestjs.io/docs/expect#expectarraycontainingarray
	const expected = {name: 'sahil'}
	const received = [{name: 'sahil', lastname: 'rajput'}, {otherObjectsAnyShape: 'Rohit'}]

	// Src: https://codewithhugo.com/jest-array-object-match-contain/
	expect(received).toEqual(expect.arrayContaining([expect.objectContaining(expected)]))
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

let TOKEN_sahilrajput03
test('login', async () => {
	const cred = {username: 'sahilrajput03', password: 'secret'}
	const expectedBody = {username: 'sahilrajput03', name: 'Sahil Rajput'}

	const {body, statusCode} = await api.post('/api/login').send(cred)

	expect(statusCode).toBe(200)
	expect(body).toMatchObject(expectedBody)
	expect(body).toHaveProperty('token')
	TOKEN_sahilrajput03 = 'bearer ' + body.token
})

//! NOTES ROUTER TESTS //
test('post a note', async () => {
	// // create a user
	// await api.post('/api/users').send({username: 'username001', name: 'alice robert', token: _token})

	const expectedBody = {content: 'very good buddy!'}

	const {body} = await api.post('/api/notes').set('Authorization', TOKEN_sahilrajput03).send(expectedBody).expect(200)
	expect(body).toMatchObject(expectedBody)
	expect(body).toHaveProperty('id')
	// log(body)
})

// This test is intentionally put after posting a note so that we see notes attached in the user output.
test('get all users with respective linked notes', async () => {
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

	const expectedBody = {content: 'very good buddy!', important: true}

	await api.post('/api/notes').send(expectedBody).set('Authorization', TOKEN_sahilrajput03).expect(200)
	await api.post('/api/notes').send(expectedBody).set('Authorization', TOKEN_sahilrajput03).expect(200)

	const {body, statusCode} = await api.get('/api/notes')

	// log({body})

	expect(statusCode).toBe(200)
	expect(body.length).toBe(2)
})

test('all notes (with query params)', async () => {
	// Clear db
	await NoteM.sync({force: true})

	await api.post('/api/notes').send({content: 'note abc', important: true}).set('Authorization', TOKEN_sahilrajput03).expect(200)
	await api.post('/api/notes').send({content: 'note def', important: true}).set('Authorization', TOKEN_sahilrajput03).expect(200)
	await api.post('/api/notes').send({content: 'note def 2', important: false}).set('Authorization', TOKEN_sahilrajput03).expect(200)
	await api.post('/api/notes').send({content: 'note ghi', important: false}).set('Authorization', TOKEN_sahilrajput03).expect(200)

	const search1 = await api.get('/api/notes?search=def&important=true')
	let contentList1 = search1.body.map((note) => note.content)
	// loggert.info(contentList)
	expect(contentList1).toEqual(['note def'])

	const search2 = await api.get('/api/notes?search=def')
	let contentList2 = search2.body.map((note) => note.content)
	// loggert.info(contentList2)
	expect(contentList2).toEqual(['note def', 'note def 2'])
})

test('reset notes', async () => {
	const response = await api.delete('/api/notes/reset').expect(200)
	const expectedResponse = {message: 'notes removed!'}
	expect(response.body).toMatchObject(expectedResponse)

	// Verify
	const {body} = await api.get('/api/notes').expect(200)
	expect(body.length).toBe(0)
})

const CRED_jami_kousa = {username: 'jami_kousa', password: 'secret'}

test('disable login for a user', async () => {
	// post user
	let user = {username: 'jami_kousa', name: 'Jami Kousa', disabled: true}
	await api.post('/api/users').send(user)

	// try logging in
	const {body, statusCode} = await api.post('/api/login').send(CRED_jami_kousa)

	expect(body).toEqual({error: 'account disabled, please contact admin'})
	expect(statusCode).toBe(401)
	// loggert.info(body, statusCode)
})

let ADMIN_TOKEN

test('disable user via api call using an admin user', async () => {
	// post admin user
	let user = {username: 'new_admin', name: 'I am admin', admin: true}
	await api.post('/api/users').send(user)

	// Login admin user to get token
	const cred = {username: 'new_admin', password: 'secret'}
	const response_login = await api.post('/api/login').send(cred)
	ADMIN_TOKEN = 'bearer ' + response_login.body.token
	// loggert.info(admin_token)

	// Disable user
	let payload = {disabled: true}
	const {body, statusCode} = await api.put('/api/users/jami_kousa').set('Authorization', ADMIN_TOKEN).send(payload)
	// loggert.info(body)
	// loggert.info(statusCode)
	expect(body.disabled).toBe(true)
	expect(statusCode).toBe(200)
})

let TOKEN_jami_kousa
test('get one/all users (SIMPLY DUPLICATE)', async () => {
	// Enable login for jami_kousa
	let payload = {disabled: false}
	await api.put('/api/users/jami_kousa').set('Authorization', ADMIN_TOKEN).send(payload)

	// Login jami_kousa
	let loginResponse = await api.post('/api/login').send(CRED_jami_kousa)
	TOKEN_jami_kousa = 'bearer ' + loginResponse.body.token

	// Post note
	await api.post('/api/notes').set('Authorization', TOKEN_jami_kousa).send({content: 'very good buddy!'})

	// ADD TEAM AND MEMBERSHIP DETAILS
	// ===============================
	// insert into teams (name) values ('toska');
	// insert into teams (name) values ('mosa climbers');
	//
	// insert into memberships (user_id, team_id) values (1, 1);
	// insert into memberships (user_id, team_id) values (1, 2);
	// insert into memberships (user_id, team_id) values (2, 1);
	// insert into memberships (user_id, team_id) values (3, 2);
	//
	// INSERT DATA WITH SEQUELIZE
	await TeamM.create({name: 'toska'})
	await TeamM.create({name: 'mosa climbers'})
	//
	await MembershipM.create({userId: 1, teamId: 1})
	await MembershipM.create({userId: 1, teamId: 2})
	await MembershipM.create({userId: 2, teamId: 1})
	await MembershipM.create({userId: 3, teamId: 2})

	// post a sample note for the user `sahilrajput03`
	const notePostedResponse = await api.post('/api/notes').set('Authorization', TOKEN_sahilrajput03).send({content: 'This note is created by sahilrajput03!'}).expect(200)
	// loggert.info('posted by jami:', notePostedResponse.body)

	// MARK A NOTES FOR OTHER USERS
	// ============================
	//	insert into user_notes (user_id, note_id) values (1, 4);
	// insert into user_notes (user_id, note_id) values (1, 5);
	// await UserNotesM.create({userId: 1, noteId: 1})
	//
	// INSERT DATA WITH SEQUELIZE
	await UserNotesM.create({userId: 1, noteId: 2})
	await UserNotesM.create({userId: 2, noteId: 2})

	// GET ALL USERS
	// let response1 = await api.get('/api/users')
	// loggert.info(response1.body)

	// GET ONE USER
	const {body} = await api.get('/api/users/2')
	loggert.info(body)
})

test('new', async () => {
	const user = await UserM.findByPk(1, {
		include: {
			model: NoteM,
		},
	})

	// @ts-ignore
	user.notes.forEach((note) => {
		// loggert.info(note.content)
	})
	// loggert.info(user.toJSON())
	expect(typeof user.toJSON()).toBe('object')
})

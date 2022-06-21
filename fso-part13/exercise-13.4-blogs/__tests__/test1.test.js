// @ts-check
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
const {BlogM, UserM} = require('../models')
const {loggert, logger} = require('../utils/logger') // Only import loggert (testing) from logger file.

// Reuired bcoz I am using @ts-check and it complains via vscode.
let isFlashRunner = global.isFlashRunner,
	connectToDb = global.connectToDb,
	sequelize = global.sequelize,
	closeDb = global.closeDb,
	beforeAll = global.beforeAll,
	test = global.test

if (isFlashRunner) {
	// withSupertest.test
	connectToDb(async () => {
		// await require('../initMongodb.js')
		const {connection} = require('../initPostgreSql')
		// wait till the connection establishes to postgresql!
		await connection
	})

	closeDb(async () => {
		// await mongoose.connection.close()
		const db = sequelize
		await db.close() // close the connection.
	})
}

beforeAll(async () => {
	// Fix the schema on the fly.
	await BlogM.sync({alter: true})

	// Create the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	// LEARN: .sync method also returns a promise, how badly sequelize has named this particular naming ~ Sahil. :(
	await BlogM.sync({force: true})
})

test('bad request ', async () => {
	// Please read code of ``CAUTION`` in `middleware/errorHandler` function to know why I have disabled error logging for `test` mode in backend by default but still you can enable it very easily enable it.
	let expectedError
	const res = await api.get('/api/bugged/bugged_api')

	expect(res.body.error).toBeDefined()
	expect(res.body.error.message).toBe('Some stupid error..')
})

test('bad request (with `express-async-errors`)', async () => {
	// Please read code of ``CAUTION`` in `middleware/errorHandler` function to know why I have disabled error logging for `test` mode in backend by default but still you can enable it very easily enable it.
	let expectedError
	const res = await api.get('/api/bugged/bugged_api_2')

	expect(res.body.error.message).toBeDefined()
	expect(res.body.error.message).toBe('Some stupid error..')
})

test('delete BLOG post', async () => {
	let id = 21
	let expectedStatus = 201
	await api.delete(`/api/blogs/${id}`).expect(expectedStatus)
	loggert.success('pavement', {cool: 'biju'})
})

//! USERS ROUTER TESTS //
test('post USER', async () => {
	// empty users table
	await UserM.sync({force: true})

	const expectedBody = {username: 'sahilrajput03@gmail.com', name: 'Sahil Rajput'}
	const {body} = await api.post('/api/users').send(expectedBody)

	expect(body).toMatchObject(expectedBody)

	expect(body).toHaveProperty('id')
	expect(body).toHaveProperty('createdAt')
	expect(body).toHaveProperty('updatedAt')
})

test('get all USERS', async () => {
	const expectedBody = [{blogs: [], id: 1, username: 'sahilrajput03@gmail.com', name: 'Sahil Rajput'}]
	const {body} = await api.get('/api/users')

	body.forEach((blog) => {
		expect(blog).toHaveProperty('createdAt')
		expect(blog).toHaveProperty('updatedAt')
	})

	expect(body).toMatchObject(expectedBody)
})

test('SAMPLE: toMatchObject works for arrays as well', () => {
	const received = [{username: 'sahilrajput03@gmail.com', unnecessary: 'values here..', unnecessary_2: 'values here..'}]
	const expected = [{username: 'sahilrajput03@gmail.com'}]
	// Fyi: Below received value will *not* match (test will fail) though. Weird, right? ~Sahil
	// const received = [{username: 'sahilrajput03@gmail.com', unnecessary: 'values here..', unnecessary_2: 'values here..'}, {username: 'otheruser'}]

	expect(received).toMatchObject(expected)
})

let _token
test('login USER', async () => {
	const cred = {username: 'sahilrajput03@gmail.com', password: 'secret'}
	const expectedBody = {username: 'sahilrajput03@gmail.com', name: 'Sahil Rajput'}

	const {body, statusCode} = await api.post('/api/login').send(cred)

	expect(statusCode).toBe(200)
	expect(body).toMatchObject(expectedBody)
	expect(body).toHaveProperty('token')
	_token = 'bearer ' + body.token
})

test('post BLOG + blog is associated with logged-in user', async () => {
	const expectedBody = {author: 'rohan ahuja', url: 'www.rohan.com', title: 'rohan is alive', likes: 32}
	const expectedStatus = 200

	const {body} = await api
		.post('/api/blogs')
		.set('Authorization', _token)
		.send(expectedBody)
		.expect('Content-Type', /application\/json/)
		.expect(expectedStatus)

	// for status, body: we can do - (*it matches for exact object instead of something like toMatchObject() method from expect).
	// .expect(expectedStatus, expectedBody)

	// tlog({body})
	expect(body).toMatchObject(expectedBody)
	expect(body).toHaveProperty('id')
	expect(body.id).toBe(1)

	// blog is associated with a user
	expect(body.userId).not.toBeNull()
	expect(typeof body.userId).toBe('number')
})

test('post BLOG with custom id', async () => {
	const expectedBody = {id: 21, author: 'rohan ahuja', url: 'www.rohan.com', title: 'rohan is alive', likes: 32}
	const expectedStatus = 200

	const {body} = await api
		.post('/api/blogs')
		.set('Authorization', _token)
		.send(expectedBody)
		.expect('Content-Type', /application\/json/)
		.expect(expectedStatus)

	// for status, body: we can do - (*it matches for exact object instead of something like toMatchObject() method from expect).
	// .expect(expectedStatus, expectedBody)

	// log({body})
	expect(body).toMatchObject(expectedBody)
	// loggert.info('id', body.id)
	expect(body).toHaveProperty('id')
	expect(typeof body.id).toBe('number')

	// logger testing
	// loggert.info('post-blog', body)
	// loggert.success('post-blog', body)
	// loggert.err('post-blog', body)
})

test('modify BLOG', async () => {
	let expectedBody = {
		author: 'new author',
		url: 'fb.com/new_author',
		title: 'very new blog',
		likes: 50,
	}

	let {body} = await api.put('/api/blogs/1').send(expectedBody)

	expect(body).toMatchObject(expectedBody)
})

test('get list of BLOGS', async () => {
	let blogs = await api.get('/api/blogs')

	// loggert.info('blogs', blogs.body)
	let idList = blogs.body.map((b) => b.id)
	// loggert.info('idList', idList)
	expect(idList).toContain(1)
	expect(idList).toContain(21)
})

test("modify USER's username", async () => {
	const expectedBody = {username: 's03@gmail.com'}
	let {body} = await api.put('/api/users/sahilrajput03@gmail.com').set('Authorization', _token).send(expectedBody)

	expect(body).toMatchObject(expectedBody)
})

test('bad username err on USER creation  ', async () => {
	const expectedBody = {username: 'some_bad_username', name: 'Sahil Rajput'}
	const expectedError = {
		error: ['Validation isEmail on username failed'],
	}
	const {body, statusCode} = await api.post('/api/users').send(expectedBody)
	loggert.info(body) // { error: { name: 'SequelizeValidationError', errors: [ [Object] ] } }
	// loggert.info(statusCode)
	expect(statusCode).toBe(400)
	expect(body).toMatchObject(expectedError)
})

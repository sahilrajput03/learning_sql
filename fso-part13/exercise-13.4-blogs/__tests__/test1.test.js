/* global connectToDb, closeDb beforeAll test sequelize BlogM */
//? Use .env.test file for environment.
const path = require('path')

const dotenv = require('dotenv')
dotenv.config({path: path.join(__dirname, '..', '.env.test')}) // Joining path using path.join and __dirname allows us to execute files withSupertest using `fr withSupertest` from inside __tests__ folder and from the root folder as well.

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const {expect} = require('expect')

// withSupertest.test
connectToDb(async () => {
	// await require('../initMongodb.js')
	const {connection, BlogM} = require('../initPostgreSql')
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
	await BlogM.sync({alter: true})

	// Create the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	// LEARN: .sync method also returns a promise, how badly sequelize has named this particular naming ~ Sahil. :(
	await BlogM.sync({force: true})
})

test('post blog', async () => {
	const expectedBody = {id: 201, author: '', url: '', title: '', likes: 1}
	const expectedStatus = 200

	const {body} = await api.post('/api/blogs').send(expectedBody)
	// log({body})
	expect(body).toMatchObject(expectedBody)
})

test('Check /b endpoint, #supertest', async () => {
	const expectedBody = {car: 20, bike: 30}
	const expectedStatus = 203

	await api
		.get('/b')
		.send(expectedBody) //🔥︎ This is how you send data.
		.expect('Content-Type', /application\/json/)
		.expect(expectedStatus, expectedBody)
})

test('database request', async () => {
	const expectedBody = {
		name: 'Bruno Mars',
		phoneNumber: 123456789,
		address: 'Some address here',
	}

	const expectedStatus = 200

	// Never await api call if you are using .end function on the api call.
	const res = await api.post('/c').send(expectedBody).expect(expectedStatus) //🔥︎ This is how you send data.
	// .expect('Content-Type', /application\/json/) // this fails the request.

	expect(res.body).toMatchObject(expectedBody)
	expect(res.body).toHaveProperty('_id')
})

test('bad request ', async () => {
	// Please read code of ``CAUTION`` in `middleware/errorHandler` function to know why I have disabled error logging for `test` mode in backend by default but still you can enable it very easily enable it.
	let expectedError
	const res = await api.get('/bugged_api')

	expect(res.body.error).toBeDefined()
	expect(res.body.error).toBe('Some stupid error..')
})

test('bad request (with `express-async-errors`)', async () => {
	// Please read code of ``CAUTION`` in `middleware/errorHandler` function to know why I have disabled error logging for `test` mode in backend by default but still you can enable it very easily enable it.
	let expectedError
	const res = await api.get('/bugged_api_2')

	expect(res.body.error).toBeDefined()
	expect(res.body.error).toBe('Some stupid error..')
})

//? Add below thing as important..!
// if (
// 	process.env.NODE_ENV !== 'test' ||
// 	!process.env.DATABASE_URL.includes('test')
// ) {
// 	throw new Error('*CRITICAL ERROR*: You are not using test environment')
// }

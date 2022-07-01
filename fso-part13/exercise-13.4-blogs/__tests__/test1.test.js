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
const {BlogM, UserM, ReadingListM, SessionM} = require('../models')
const {loggert, logger} = require('../utils/logger') // Only import loggert (testing) from logger file.

// Reuired bcoz I am using @ts-check and it complains via vscode.
let isFlashRunner = global.isFlashRunner,
	connectToDb = global.connectToDb,
	sequelize = global.sequelize,
	closeDb = global.closeDb,
	beforeAll = global.beforeAll,
	test = global.test,
	describe = global.describe

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
	// Create the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	// LEARN: .sync method also returns a promise, how badly sequelize has named this particular naming ~ Sahil. :(
	await BlogM.sync({force: true})
	await ReadingListM.sync({force: true})
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

//! USERS ROUTER TESTS //
test('post USER (signup)', async () => {
	// empty users table
	await UserM.sync({force: true})

	const expectedBody = {username: 'sahilrajput03@gmail.com', name: 'Sahil Rajput'}
	const {body} = await api.post('/api/users').send(expectedBody)

	expect(body).toMatchObject(expectedBody)

	expect(body).toHaveProperty('id')
	expect(body).toHaveProperty('createdAt')
	expect(body).toHaveProperty('updatedAt')
})

/* FOR REFERENCE */
// test('SAMPLE: toMatchObject works for arrays as well', () => {
// const received = [{username: 'sahilrajput03@gmail.com', unnecessary: 'values here..', unnecessary_2: 'values here..'}]
// const expected = [{username: 'sahilrajput03@gmail.com'}]
// >>>>>
// Fyi: Below received value will *not* match (test will fail) though. Weird, right? ~Sahil
// const received = [{username: 'sahilrajput03@gmail.com', unnecessary: 'values here..', unnecessary_2: 'values here..'}, {username: 'otheruser'}]
// <<<<<
// 	expect(received).toMatchObject(expected)
// })

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

test('post BLOG + assure blog is associated with logged-in user', async () => {
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

test('get all USERS', async () => {
	const expectedBody = [{id: 1, username: 'sahilrajput03@gmail.com', name: 'Sahil Rajput'}]
	const {body} = await api.get('/api/users')

	body.forEach((blog) => {
		expect(blog).toHaveProperty('createdAt')
		expect(blog).toHaveProperty('updatedAt')
	})

	expect(body).toMatchObject(expectedBody)
	// Assure the blogs are returned, exercise: 13.12
	expect(body[0].blogs.length).toBeGreaterThan(0)
})

test('delete BLOG post (only feasible by the user who created it)', async () => {
	// Create blog with id 7
	const expectedBody = {id: 7, author: 'rohan ahuja', url: 'www.rohan.com', title: 'rohan is alive', likes: 32}
	await api
		.post('/api/blogs')
		.set('Authorization', _token)
		.send(expectedBody)
		.expect('Content-Type', /application\/json/)
		.expect(200)

	// Delete the blog with id 7
	let id = 7
	let expectedStatus = 201
	let {statusCode} = await api.delete(`/api/blogs/${id}`).set('Authorization', _token).expect(expectedStatus)
	// loggert.info(statusCode)
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

test('get all BLOGS + assure that username is returned for each blog', async () => {
	let blogs = await api.get('/api/blogs')

	// loggert.info('blogs', blogs.body)
	let idList = blogs.body.map((b) => b.id)
	// loggert.info('idList', idList)
	expect(idList).toContain(1)
	expect(idList).toContain(21)

	// Assure username is returned for each blog, ex 13.12
	let usernameList = blogs.body.map((b) => b.user.username)

	// Expect that username is returned for each blog
	usernameList.forEach((element) => {
		expect(typeof element).toBe('string')
	})
})

test("modify USER's username", async () => {
	const expectedBody = {username: 's03@gmail.com'}
	let {body} = await api.put('/api/users/sahilrajput03@gmail.com').set('Authorization', _token).send(expectedBody)

	expect(body).toMatchObject(expectedBody)
	// loggert.info(body)
})

test('bad username err on USER creation  ', async () => {
	const expectedBody = {username: 'some_bad_username', name: 'Sahil Rajput'}
	const expectedError = {
		error: ['Validation isEmail on username failed'],
	}
	const {body, statusCode} = await api.post('/api/users').send(expectedBody)
	loggert.info('body: ', body) // { error: { name: 'SequelizeValidationError', errors: [ [Object] ] } }
	// loggert.info(statusCode)
	expect(statusCode).toBe(400)
	expect(body).toMatchObject(expectedError)
})

test('get all blogs + searching', async () => {
	// Clear all blogs
	await BlogM.sync({force: true})

	await api.post('/api/blogs').set('Authorization', _token).send({id: 20, title: 'blog abc', author: 'rohan', url: 'www.rohan.com', likes: 6})
	await api.post('/api/blogs').set('Authorization', _token).send({id: 21, title: 'blog def', author: 'rohan', url: 'www.rohan.com', likes: 8})
	await api.post('/api/blogs').set('Authorization', _token).send({id: 22, title: 'blog def', author: 'def fernandis', url: 'www.rohan.com', likes: 11})

	// search blogs
	let search1 = await api.get('/api/blogs?search=def')
	// loggert.info('blogs', search1.body)
	expect(search1.body.map((blog) => blog.id)).toEqual(expect.arrayContaining([22, 21]))

	let search2 = await api.get('/api/blogs?search=rohan')
	// loggert.info('blogs', search2.body)
	expect(search2.body.map((blog) => blog.id)).toEqual(expect.arrayContaining([20, 21]))
})

/* FOR REFERENCE
test('STATIC: ascending order array check', () => {
	expect([1, 2, 3]).toEqual([1, 2, 3])

	expect(() => {
		expect([1, 2, 3]).toEqual([3, 2, 1])
	}).toThrow()
})
 */

// exercise 13.15
test('get all blogs in `likes` descending order', async () => {
	let search1 = await api.get('/api/blogs')
	// loggert.info(search1.body)
	let orderedBlogs = search1.body.map((blog) => blog.likes)
	expect(orderedBlogs).toEqual([11, 8, 6])
})

test('prepare for next test', async () => {
	await api.post('/api/blogs').set('Authorization', _token).send({id: 23, title: 'blog def', author: 'Varun Mayya', url: 'www.varyn-mayya.com', likes: 50})
	await api.post('/api/blogs').set('Authorization', _token).send({id: 24, title: 'blog def', author: 'Varun Mayya', url: 'www.varyn-mayya.com', likes: 5})
})

// ex: 13.16
test('get all authors with respected no. of blogs and total no. of likes', async () => {
	const expectedBody = [
		{author: 'Varun Mayya', articles: '2', total_likes: '55'},
		{author: 'rohan', articles: '2', total_likes: '14'},
		{author: 'def fernandis', articles: '1', total_likes: '11'},
	]
	const {body} = await api.get('/api/authors')
	// loggert.info(body)
	expect(body).toEqual(expectedBody)
})

test('test error thrown for invalid year value while saving a blog', async () => {
	const expectedBody = {author: 'rohan ahuja', url: 'www.rohan.com', title: 'rohan is alive', likes: 32, year: 1800}
	// const expectedStatus = 200

	const expected = {
		error: {
			name: 'SequelizeValidationError',
			message: 'Validation error: year field must be between 1991 to 2022, but give year value is: 1800.',
		},
	}
	const {body} = await api.post('/api/blogs').set('Authorization', _token).send(expectedBody)
	// loggert.info(body)
	expect(body).toEqual(expected)
})

describe('readinglist many to many relation', () => {
	test('test readinglist many to many relation ', async () => {
		// 	{
		//   "blogId": 10,
		//   "userId": 3
		// }

		// Check blogs
		// loggert.info(JSON.stringify(await BlogM.findAll(), null, 2))

		await ReadingListM.create({blogId: 20, userId: 1})
		await ReadingListM.create({blogId: 21, userId: 1})
		await ReadingListM.create({blogId: 22, userId: 2})
		// loggert.info(JSON.stringify(await ReadingListM.findAll(), null, 2))

		// let {body} = await api.get('/api/users/1').set('Authorization', _token).send()
		let {body} = await api.get('/api/users/1')
		// loggert.info(body)
		expect(body).toHaveProperty('id')
		expect(body).toHaveProperty('username')
		expect(body).toHaveProperty('name')
		expect(body).toHaveProperty('readings')
		expect(Array.isArray(body.readings)).toBe(true)

		const readingItem = body.readings[0].readinglist
		expect(readingItem).toHaveProperty('id')
		expect(readingItem).toHaveProperty('read')
	})

	test('put request to change read status of the relation', async () => {
		let payload = {read: true}
		let {body} = await api.put('/api/readinglists/1').set('Authorization', _token).send(payload)

		// loggert.info(body)
		expect(body.isRead).toBe(payload.read)
	})

	test("put request to change read status of the different user's relation", async () => {
		const expected = {error: 'blog does not belong to user'}
		let payload = {read: true}
		let {body, statusCode} = await api.put('/api/readinglists/3').set('Authorization', _token).send(payload)

		// loggert.info(body)
		expect(body).toEqual(expected)
		expect(statusCode).toBe(401)
	})

	test('return only read: true notes for a user', async () => {
		// when no query is sent
		let allNotes = await api.get('/api/users/1')
		let allNotesReadingList = allNotes.body.readings.map((entity) => entity.readinglist)
		// loggert.info(allNotesReadingList)
		const expected = [
			{id: 1, read: true},
			{id: 2, read: false},
		]
		expect(allNotesReadingList).toEqual(expected)

		let readTrueResponse = await api.get('/api/users/1?read=true')
		let readingList1 = readTrueResponse.body.readings.map((entity) => entity.readinglist)
		// loggert.info('readings?', readTrueResponse.body.readings)
		// loggert.info('all should be true:', readingList1)

		expect(readingList1.length).not.toBe(0)
		readingList1.forEach((element) => {
			expect(element).toMatchObject({read: true})
		})

		//
		//
		// now check for false case
		let readFalseresponse = await api.get('/api/users/1?read=false')
		let readingList2 = readFalseresponse.body.readings.map((entity) => entity.readinglist)
		// loggert.info('all should be false:', readingList2)

		expect(readingList2.length).not.toBe(0)
		readingList2.forEach((element) => {
			expect(element).toMatchObject({read: false})
		})
	})
})

describe('user session management', async () => {
	// Exercise: 13.24
	// TASK1(DONE): Store token in session table (connection table) in db when a user logs in.
	// TASK2(DONE): Add a check in `tokenExtractor` middleware that checks if the token is present is `sessions` table after the decoding of token is complete. THIS WILL ENSURE THAT IF THE TOKEN IS VALID COZ ANY ADMIN CAN REMOVE THE ISSUED FROM SESSION TABLE ANYTIME THE ADMIN WANTS.

	let expectedBody1, response1
	test('deleted token should throw `expired token` error  - ex13.24', async () => {
		//? POST USER (REGISTER USER/CREATE USER)
		expectedBody1 = {username: 'u1@site.com', name: 'Nick Morris'}
		response1 = await api.post('/api/users').send(expectedBody1)
		// loggert.info(response1.body) //!
		expect(response1.body).toMatchObject(expectedBody1)

		//? LOGIN NOW:
		const cred = {username: expectedBody1.username, password: 'secret'}
		const expectedBody2 = {username: expectedBody1.username}
		const response2 = await api.post('/api/login').send(cred)
		// loggert.info(response2.body) //!
		expect(response2.body).toMatchObject(expectedBody2)
		expect(response2.body).toHaveProperty('token')
		const loggedInToken = 'bearer ' + response2.body.token

		//? DELETE ALL ACTIVE SESSIONS FOR THE USER. LEARN: `Model.destroy` DELETES ALL ENTRIES WHICH MATCHES THE FILER.
		// i.e., logout user
		const response6 = await api.delete('/api/logout').set('Authorization', loggedInToken)
		let expected6 = {message: 'logout successful'}
		expect(response6.body).toMatchObject(expected6)

		//? POST BLOG WHICH REQUIRES (LOGIN) A USER TO BE LOGGED IN
		const payload = {author: 'rohan ahuja', url: 'www.rohan.com', title: 'rohan is alive', likes: 32}
		const expectedErrResponse = {error: 'expired token', reason: 'probably token was delete from sessions table via an api action or manually action.'}
		const expectedErrStatusCode = 402

		const response4 = await api.post('/api/blogs').set('Authorization', loggedInToken).send(payload)
		expect(response4.body).toMatchObject(expectedErrResponse)
		expect(response4.statusCode).toBe(expectedErrStatusCode)
	})

	test('disable user', async () => {
		//? DISABLE USER
		// Bcoz in the fso exercise 13.24, its said we can disable user directly via db (so no need to make api for this)
		let response3 = await UserM.update(
			// Values to update
			{
				disabled: true,
			},
			// clause
			{
				where: {
					username: expectedBody1.username,
				},
			}
		)
		// loggert.info(response3) //!
		// @ts-ignore
		expect(response3).toMatchObject([1]) // idk what this value means but on updation this is returned ~Sahil
		const response5 = await UserM.findByPk(response1.body.id)
		// loggert.info(response5.toJSON()) //!
		expect(response5.toJSON().disabled).toBe(true)
	})
})

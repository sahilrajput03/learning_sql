const usersRouter = require('express').Router()
const tokenExtractor = require('../utils/tokenExtractor')

const {UserM, BlogM} = require('../models')
const {logger, loggert} = require('../utils/logger')

//?  join query is done using the `include` option as a `query parameter`
const includeBlogs = {
	include: {
		model: BlogM, // This adds `blogs` of the user to `blogs` key (array itself).
		attributes: {exclude: ['userId']}, // Removes `userId` property from each note definition bcoz its redundant as `userId` is simply `user.id` which we save at the time of note creation.
	},
}

// ex-13.8
usersRouter.get('/', async (req, res) => {
	// const users = await UserM.findAll()

	// Join query (aka populate in mongodb), docs: `include`: https://sequelize.org/docs/v6/core-concepts/assocs/#eager-loading-example
	const users = await UserM.findAll(includeBlogs)
	// Generates query like:
	// SELECT "User". "id", "User". "username", "User". "name", "Notes". "id" AS "Notes.id", "Notes". "content" AS "Notes.content", "Notes". "important" AS "Notes.important", "Notes". "date" AS "Notes.date", "Notes". "user_id" AS "Notes.UserId"
	// FROM "users" AS "User" LEFT OUTER JOIN "notes" AS "Notes" ON "User". "id" = "Notes". "user_id";

	res.json(users)
	// res.jso(users)
})

// ex-13.8
usersRouter.post('/', async (req, res) => {
	const user = await UserM.create(req.body)
	// console.log({user})
	res.json(user)
})

// ex-13.8
// The main difference between the PUT and PATCH method is that the PUT method uses the request URI to supply a modified version of the requested resource which replaces the original version of the resource, whereas the PATCH method supplies a set of instructions to modify the resource.
usersRouter.put('/:username', tokenExtractor, async (req, res) => {
	// const user = await UserM.findByPk(req.params.id)
	// LEARN: `notes` key doesnt exist if we use above query.

	// Join query
	/** @type any */
	const user = await UserM.findOne({
		where: {
			username: req.params?.username,
		},
		// ...includeBlogs, // to include `blogs` array as well.
	})
	// We get `notes` key which is array of notes rows(objects) from User table.
	// silog(user)

	if (user) {
		if (typeof req.body.username !== 'undefined') {
			user.username = req.body.username
		}

		let updatedUser = await user.save()

		res.json(user)
	} else {
		res.status(404).end()
	}
})

// ex 13.20 and 13.21
usersRouter.get('/:id', async (req, res) => {
	let queryOptions = {
		include: {
			model: BlogM,
			as: 'readings',
			attributes: {exclude: ['userId']}, // Eliminates `userId` property from each blog entry i.e., `readings[*].userId` key.
			// through: {
			// 	attributes: [], // Eliminates `readinglist` key from each blog entry i.e., `readings[*].readinglist` which is an array i.e., rows objects of `readinglists` table.
			// },
		},
	}

	let user_sequelize = await UserM.findByPk(req.params.id, queryOptions)
	let user = user_sequelize.toJSON()

	let userDesiredShape = {
		...user,
		readings: user.readings.map((item) => ({...item, readinglist: {id: item.readinglist.id, read: item.readinglist.isRead}})),
	}

	// logger.info('queryRead?', req.query.read)
	if (!req.query.read) {
		res.json(userDesiredShape)
	} else {
		const queryRead = req.query.read === 'true'

		let newUserDesiredShape = {
			...userDesiredShape,
			readings: userDesiredShape.readings.filter((item) => {
				return item.readinglist.read === queryRead
			}),
		}
		res.json(newUserDesiredShape)
	}
})

module.exports = usersRouter

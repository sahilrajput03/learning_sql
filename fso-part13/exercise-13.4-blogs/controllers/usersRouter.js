const router = require('express').Router()

const {UserM, BlogM} = require('../models')

//?  join query is done using the `include` option as a `query parameter`
const includeBlogs = {
	include: {
		model: BlogM, // This adds `blogs` of the user to `blogs` key (array itself).
		attributes: {exclude: ['userId']}, // Removes `userId` property from each note definition bcoz its redundant as `userId` is simply `user.id` which we save at the time of note creation.
	},
}

// ex-13.8
router.get('/', async (req, res) => {
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
router.post('/', async (req, res) => {
	try {
		const user = await UserM.create(req.body)
		// console.log({user})
		res.json(user)
	} catch (error) {
		return res.status(400).json({error})
	}
})

// ex-13.8
// The main difference between the PUT and PATCH method is that the PUT method uses the request URI to supply a modified version of the requested resource which replaces the original version of the resource, whereas the PATCH method supplies a set of instructions to modify the resource.
router.put('/:username', async (req, res) => {
	// const user = await UserM.findByPk(req.params.id)
	// LEARN: `notes` key doesnt exist if we use above query.

	// Join query
	const user = await UserM.findByPk(req.params.id, includeBlogs)
	// We get `notes` key which is array of notes rows(objects) from User table.

	if (user) {
		res.json(user)
	} else {
		res.status(404).end()
	}
})

module.exports = router

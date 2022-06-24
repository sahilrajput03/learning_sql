const router = require('express').Router()
const {tokenExtractor} = require('../utils/middleware.js')
const {UserM, NoteM} = require('../models')

//?  join query is done using the `include` option as a `query parameter`
const includeNotes = {
	include: {
		model: NoteM, // This adds notes of the user to `notes` key (array itself).
		attributes: {exclude: ['userId']}, // Removes `userId` property from each note definition bcoz its redundant as `userId` is simply `user.id` which we save at the time of note creation.
	},
}

router.get('/', async (req, res) => {
	// const users = await UserM.findAll()

	// Join query (aka populate in mongodb), docs: `include`: https://sequelize.org/docs/v6/core-concepts/assocs/#eager-loading-example
	const users = await UserM.findAll(includeNotes)
	// Generates query like:
	// SELECT "User". "id", "User". "username", "User". "name", "Notes". "id" AS "Notes.id", "Notes". "content" AS "Notes.content", "Notes". "important" AS "Notes.important", "Notes". "date" AS "Notes.date", "Notes". "user_id" AS "Notes.UserId"
	// FROM "users" AS "User" LEFT OUTER JOIN "notes" AS "Notes" ON "User". "id" = "Notes". "user_id";

	res.json(users)
	// res.jso(users)
})

router.post('/', async (req, res) => {
	try {
		const user = await UserM.create(req.body)
		// console.log({user})
		res.json(user)
	} catch (error) {
		return res.status(400).json({error})
	}
})

router.get('/:id', async (req, res) => {
	// const user = await UserM.findByPk(req.params.id)
	// LEARN: `notes` key doesnt exist if we use above query.

	// Join query
	const user = await UserM.findByPk(req.params.id, includeNotes)
	// We get `notes` key which is array of notes rows(objects) from User table.

	if (user) {
		res.json(user)
	} else {
		res.status(404).end()
	}
})

const isAdmin = async (req, res, next) => {
	/** @type any */
	const user = await UserM.findByPk(req.decodedToken.id)
	if (!user.admin) {
		return res.status(401).json({error: 'operation not allowed'})
	}
	next()
}

// To be able to disable/enable any user
router.put('/:username', tokenExtractor, isAdmin, async (req, res) => {
	/** @type any */
	const user = await UserM.findOne({
		where: {
			username: req.params.username,
		},
	})

	if (user) {
		user.disabled = req.body.disabled
		await user.save()
		res.json(user)
	} else {
		res.status(404).end()
	}
})

module.exports = router

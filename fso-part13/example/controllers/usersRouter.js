const router = require('express').Router()
const {tokenExtractor} = require('../utils/middleware.js')
const {UserM, NoteM, TeamM} = require('../models')

//?  join query is done using the `include` option as a `query parameter`
// Old way (with a single include)
// const includeNotes = {
// 	include: {
// 		model: NoteM, // This adds notes of the user to `notes` key (array itself).
// 		attributes: {exclude: ['userId']}, // Removes `userId` property from each note definition bcoz its redundant as `userId` is simply `user.id` which we save at the time of note creation.
// 	},
// }
// New way (with an array way to have multiple model includes)
const queryOptions = {
	// So this user returned will have `notes` and appropriate teams for which user is part of.
	// That means its three table joined together.
	include: [
		{
			model: NoteM, // This adds notes of the user to `notes` key (array itself).
			attributes: {exclude: ['userId']}, // Removes `userId` property from each note definition bcoz its redundant as `userId` is simply `user.id` which we save at the time of note creation.
		},
		{
			model: TeamM,
			attributes: ['name', 'id'],
			through: {
				attributes: [],
			},
			// Why is `through` used here?
			// Before :`through.attribute=[]`: user.teams[*].membership[*] = { id: 1, userId: 1, teamId: 1 }
			// After  :`through.attribute=[]`: user.teams[*].membership[*] = { name: 'toska', id: 1 }
			// :: Observation: id is removed each membership row entry, we did this coz we don't want it.
		},
	],
}

router.get('/', async (req, res) => {
	// const users = await UserM.findAll()

	// Join query (aka populate in mongodb), docs: `include`: https://sequelize.org/docs/v6/core-concepts/assocs/#eager-loading-example
	const users = await UserM.findAll(queryOptions)
	// Generates query like:
	// SELECT "User". "id", "User". "username", "User". "name", "Notes". "id" AS "Notes.id", "Notes". "content" AS "Notes.content", "Notes". "important" AS "Notes.important", "Notes". "date" AS "Notes.date", "Notes". "user_id" AS "Notes.UserId"
	// FROM "users" AS "User" LEFT OUTER JOIN "notes" AS "Notes" ON "User". "id" = "Notes". "user_id";

	res.json(users)
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
	let queryOptions = {
		include: [
			{
				// This will fetch notes (array) owned by the user `notes` key.
				model: NoteM,
				attributes: {exclude: ['userId']}, // Removes `userId` from `users[*].notes[*].userId`.
			},
			{
				// This will fetch notes (array) marked for the user in table `user_notes` in `marked_notes` key.
				model: NoteM,
				as: 'marked_notes',
				attributes: {exclude: ['userId']},
				through: {
					attributes: [],
				},
				// add `user` property
				include: {
					model: UserM,
					attributes: ['name'],
				},
			},
			{
				// Adds `users[*].teams[*]`
				model: TeamM,
				attributes: ['name', 'id'],
				// "Why is through used here?" [refer older explanation in this file for same topic.]
				through: {
					attributes: [],
				},
			},
		],
	}

	/** @type object */
	const user = await UserM.findByPk(req.params.id, queryOptions)
	// We get `notes` key which is array of notes rows(objects) from User table.

	if (user) {
		// ! THIS would not work with sequelize.
		// user.note_count = user.notes.length
		// delete user.notes

		// ? Below works
		// let userNew = {
		// 	id: user.id,
		// 	username: user.username,
		// 	name: user.name,
		// 	note_count: user.notes.length,
		// }

		// ? Learn: Below works as well.
		let userNew = {
			// ...user, // < That doesn't work coz sequelize returns special objects.
			...user.toJSON(), // This is necessary
			note_count: user.notes.length,
		}
		res.json(userNew)
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

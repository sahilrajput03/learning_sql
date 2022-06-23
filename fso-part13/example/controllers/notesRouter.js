const {Op} = require('sequelize')
const express = require('express')
const chalk = require('chalk')
const jwt = require('jsonwebtoken')

const {NoteM, UserM} = require('../models/')
const {dataValues} = require('../utils')
const router = express.Router()

let js = (...args) => JSON.stringify({...args})
let log = (...args) => console.log(chalk.yellow.bgRed.bold(JSON.stringify({...args})))

router.get('/', async (req, res) => {
	let notes
	/** @type {Object.<String, any>} */
	const where = {}

	if (req.query.important) {
		where.important = req.query.important === 'true'
	} else {
		where.important = {
			[Op.in]: [true, false],
		}
	}

	if (req.query.search) {
		where.content = {
			[Op.substring]: req.query.search,
		}
	}

	notes = await NoteM.findAll({
		attributes: {exclude: ['userId']},
		include: {
			model: UserM,
			attributes: ['name'], // only include name field form the user table.
		},
		where,
	})

	// notes = await NoteM.findAll({}) // LEARN: Shape of notes is: [{id: Int(1), content: String, important: Boolean, date: String, userId: Int(1)}]

	// notes = await NoteM.findAll({
	// 	attributes: {exclude: ['userId']}, // userId is case-sensitive, it removes `userId` from each `note`, fyi: `userId` is not in schema of NoteM either but still its saved in each note bcoz we save it in `POST` route of note saving.
	// 	include: {
	// 		model: UserM, // LEARN: this adds `user: {id: Int, username: String, name: String}` property to each note object.
	// 		attributes: ['name'], // LEARN: This removes all properties in `user` key but keeps `name` property.
	// 	},
	// })
	// log('notes:', dataValues(notes)) // This is another way of printing values though!
	// log('notes:', _dataValues(notes)) // This is another way of printing values though!

	return res.json(notes) // notes.count is the total number of records(not pages).
})

const noteFinder = async (req, res, next) => {
	req.note = await NoteM.findByPk(req.params.id)
	next()
}

router.get('/:id', noteFinder, async (req, res) => {
	// added this to `noteFinder` middleware...
	// const note = await NoteM.findByPk(req.params.id)

	// return if note is not found!

	// Using this way coz ts-check silents for error on errors like 'note' doens't exist on req object.
	let note = req['note']
	if (!note) return res.status(400).json({message: 'note not found!'})

	// log('my note::', note.dataValues) //? However, perhaps a better solution is to turn the collection into JSON for printing by using the method JSON.stringify:
	// log('my note::', s(note)) //? indented + no data type syntax highlight
	// log('my note::', ps(note)) //? no indentation + data type syntax highlight

	note.important = req.body.important
	await note.save()
	return res.json(note)
})

router.put('/:id', noteFinder, async (req, res, next) => {
	// added this to `noteFinder` middleware...
	// let note = await NoteM.findByPk(req.params.id)

	let note = req['note']
	if (note) {
		if (typeof req.body.important !== 'undefined') {
			note.important = req.body.important
		}
		if (typeof req.body.content !== 'undefined') {
			note.content = req.body.content
		}
		await note.save()
		res.json(note)
	} else {
		// @ts-ignore
		res(404).end()
	}
})

router.delete('/reset', async (req, res) => {
	// NoteM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/

	await NoteM.sync({force: true}) // This creates the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	return res.json({message: 'notes removed!'})
})

// This is intentionally put below `delete@/reset` route so that below wildcard middleware doesn't catch `delete@/reset` route.
router.delete('/:id', noteFinder, async (req, res, next) => {
	let note = req['note']
	if (note) {
		await note.destroy()
		res.status(204).end()
	} else {
		res.status(404).send("Sorry can't find that!")
	}
})

// ! The token is retrieved from the request headers, decoded and placed in the req object by the tokenExtractor middleware. When creating a note, a date field is also given indicating the time it was created.
const tokenExtractor = (req, res, next) => {
	// log(req.headers)
	const authorization = req.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		try {
			req.decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET || 'secret')
			next() // ~Sahil
		} catch {
			res.status(401).json({error: 'token invalid'})
		}
	} else {
		res.status(401).json({error: 'token missing'})
	}
	// next()
}

router.post('/', tokenExtractor, async (request, res) => {
	// log(js(req.body))
	try {
		/** @type {Object.<String, any>} */
		let req = request

		/** @type {Object.<String, any>} */
		const user = await UserM.findByPk(req.decodedToken.id)
		const note = await NoteM.create({...request.body, important: request.body.important, userId: user.id, date: new Date()}) // LEARN: If we don't supply `userId` property then `userId` property will be saved as null (unless we have defined ``foreignKey: { allowNull: false }`` in the Association i.e., ```User.hasMany(NoteM, {..HERE..})``` ).
		// LEARN: In index.js file, we define ```UserM.hasMany(NoteM)``` which applies that - Sequelize will automatically create an attribute called `userId` on the Note model to which, when referenced gives access to the database column `user_id`.  ~ FSO

		return res.json(note)
	} catch (error) {
		return res.status(400).json({error})
	}
})

module.exports = router

// LEARN: Instead of using NoteM.create method we can use: NoteM.build method as well to save a note:
// Src: FSO: https://fullstackopen.com/en/part13/join_tables_and_queries#attention-to-the-definition-of-the-models
// async function anotherWay() {
// create a note without saving it yet
// const note = NoteM.build({...req.body, date: new Date()}) // eslint-disable-line no-undef

// put the user id in the userId property of the created note
// note.userId = user.id // eslint-disable-line no-undef

// store the note object in the database
// await note.save()
// }

const express = require('express')
const chalk = require('chalk')
const jwt = require('jsonwebtoken')

const {NoteM, UserM} = require('../models/')
const {dataValues} = require('../utils')
const router = express.Router()

let js = (...args) => JSON.stringify(...args)
let log = (...args) => console.log(chalk.yellow.bgRed.bold(JSON.stringify(...args)))

router.get('/', async (req, res) => {
	let notes
	notes = await NoteM.findAll({})
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
	if (!req.note) return res.status(400).json({message: 'note not found!'})

	// log('my note::', note.dataValues) //? However, perhaps a better solution is to turn the collection into JSON for printing by using the method JSON.stringify:
	// log('my note::', s(note)) //? indented + no data type syntax highlight
	// log('my note::', ps(note)) //? no indentation + data type syntax highlight

	req.note.important = req.body.important
	await req.note.save()
	return res.json(req.note)
})

router.put('/:id', noteFinder, async (req, res, next) => {
	// added this to `noteFinder` middleware...
	// let note = await NoteM.findByPk(req.params.id)

	if (req.note) {
		if (typeof req.body.important !== 'undefined') {
			req.note.important = req.body.important
		}
		if (typeof req.body.content !== 'undefined') {
			req.note.content = req.body.content
		}
		await req.note.save()
		res.json(req.note)
	} else {
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
	if (req.note) {
		await req.note.destroy()
		res.status(204).end()
	} else {
		res(404).end()
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

router.post('/', tokenExtractor, async (req, res) => {
	// log(js(req.body))
	try {
		const user = await UserM.findByPk(req.decodedToken.id)
		const note = await NoteM.create({...req.body, important: true, userId: user.id, date: new Date()})

		return res.json(note)
	} catch (error) {
		return res.status(400).json({error})
	}
})

module.exports = router

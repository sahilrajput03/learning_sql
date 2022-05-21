const express = require('express')
const chalk = require('chalk')
const NoteM = require('./models/Note')
const {dataValues} = require('./utils')
const router = express.Router()

let js = (...args) => JSON.stringify(...args)
let log = (...args) => console.log(chalk.yellow.bgRed.bold(...args))
// let log = console.log

router.get('/api/notes', async (req, res) => {
	let notes
	notes = await NoteM.findAll({})
	log('notes:', dataValues(notes)) // This is another way of printing values though!
	// log('notes:', _dataValues(notes)) // This is another way of printing values though!

	return res.json(notes) // notes.count is the total number of records(not pages).
})

router.get('/api/notes/:id', async (req, res) => {
	const note = await NoteM.findByPk(req.params.id)

	// return if note is not found!
	if (!note) return res.status(400).json({message: 'note not found!'})

	// log('my note::', note.dataValues) //? However, perhaps a better solution is to turn the collection into JSON for printing by using the method JSON.stringify:
	// log('my note::', s(note)) //? indented + no data type syntax highlight
	// log('my note::', ps(note)) //? no indentation + data type syntax highlight

	note.important = req.body.important
	await note.save()
	return res.json(note)
})

router.put('/api/notes/:id', async (req, res, next) => {
	let note = await NoteM.findByPk(req.params.id)

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
		res(404).end()
	}
})

router.post('/api/notes', async (req, res) => {
	// log(js(req.body))
	try {
		const note = await NoteM.create({...req.body, important: true})
		return res.json(note)
	} catch (error) {
		return res.status(400).json({error})
	}
})

router.get('/api/reset/notes', async (req, res) => {
	// NoteM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	log('?>', NoteM.sync({force: true})) // This creates the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/

	return res.json({message: 'notes removed!'})
})

module.exports = router

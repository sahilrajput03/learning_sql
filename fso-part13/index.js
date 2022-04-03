require('dotenv').config()
require('./setupColors')

const express = require('express')
const NoteM = require('./models/Note')
const logMw = require('logmw')
const {l, s, ps, dataValues, _dataValues} = require('./utils')

const app = express()

app.use(express.json())
app.use(logMw)

app.get('/api/notes', async (req, res) => {
	let notes
	notes = await NoteM.findAll({})
	l('notes:', dataValues(notes)) // This is another way of printing values though!
	// l('notes:', _dataValues(notes)) // This is another way of printing values though!

	return res.json(notes) // notes.count is the total number of records(not pages).
})

app.get('/api/notes/:id', async (req, res) => {
	const note = await NoteM.findByPk(req.params.id)

	// return if note is not found!
	if (!note) return res.status(400).json({message: 'note not found!'})

	l('my note::', note.dataValues) //? However, perhaps a better solution is to turn the collection into JSON for printing by using the method JSON.stringify:
	// l('my note::', s(note)) //? indented + no data type syntax highlight
	// l('my note::', ps(note)) //? no indentation + data type syntax highlight

	note.important = req.body.important
	await note.save()
	return res.json(note)
})

app.post('/api/notes', async (req, res) => {
	l(req.body)
	try {
		const note = await NoteM.create({...req.body, important: true})
		return res.json(note)
	} catch (error) {
		return res.status(400).json({error})
	}
})

app.get('/api/reset/notes', async (req, res) => {
	// NoteM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	l('?>', NoteM.sync({force: true})) // This creates the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/

	return res.json({message: 'notes removed!'})
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
	l(`Server running on port ${PORT}`)
})

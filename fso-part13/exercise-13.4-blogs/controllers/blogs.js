const express = require('express')
const {BlogM} = require('../models/Blog')
const router = express.Router()
require('../initPostgreSql')

let dataValues = (data) => data.map((n) => n.dataValues)

router.get('/api/blogs', async (req, res) => {
	let blogs
	blogs = await BlogM.findAll({})
	// log('notes:', dataValues(blogs)) // This is another way of printing values though!
	// l('notes:', _dataValues(notes)) // This is another way of printing values though!

	return res.json(blogs) // notes.count is the total number of records(not pages).
})

router.get('/api/blogs/:id', async (req, res) => {
	const blog = await BlogM.findByPk(req.params.id)

	// return if note is not found!
	if (!blog) return res.status(400).json({message: 'note not found!'})

	log('my note::', blog.dataValues) //? However, perhaps a better solution is to turn the collection into JSON for printing by using the method JSON.stringify:
	// log('my note::', s(note)) //? indented + no data type syntax highlight
	// log('my note::', ps(note)) //? no indentation + data type syntax highlight

	blog.important = req.body.important
	await blog.save()
	return res.json(blog)
})

router.delete('/api/blogs/:id', async (req, res) => {
	const blog = await BlogM.destroy({
		where: {
			id: req.params?.id,
		},
	})
	// log('server::', blog)
	res.status(201).end()
	return
})

router.put('/api/blogs/:id', async (req, res, next) => {
	const blog = await BlogM.findByPk(req.params.id)

	if (typeof req.body.author !== 'undefined') {
		blog.author = req.body.author
	}
	if (typeof req.body.url !== 'undefined') {
		blog.url = req.body.url
	}
	if (typeof req.body.title !== 'undefined') {
		blog.title = req.body.title
	}
	if (typeof req.body.likes !== 'undefined') {
		blog.likes = req.body.likes
	}

	let updatedBlog = await blog.save()
	res.send(updatedBlog)
})

router.post('/api/blogs', async (req, res) => {
	try {
		const blog = await BlogM.create({...req.body, important: true})
		const blogJson = blog.toJSON()
		return res.json(blogJson)
	} catch (error) {
		return res.status(400).json({error})
	}
})

router.get('/api/reset/blogs', async (req, res) => {
	// NoteM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	log('?>', BlogM.sync({force: true})) // This creates the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/

	return res.json({message: 'notes removed!'})
})

router.get('/bugged_api', async (req, res, next) => {
	try {
		// always wrap your controller code with try catch and pass error to next() so error can be handled by errorHandler middleware.
		// Testing random error handling by errorHandler middleware!
		throw new Error('Some stupid error..')
	} catch (error) {
		next(error)
	}
})

router.get('/bugged_api_2', async (req, res, next) => {
	// always wrap your controller code with try catch and pass error to next() so error can be handled by errorHandler middleware.
	// Testing random error handling by errorHandler middleware!
	throw new Error('Some stupid error..')
})

module.exports = router

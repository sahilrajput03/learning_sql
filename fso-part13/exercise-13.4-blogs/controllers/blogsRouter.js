const express = require('express')
const {UserM} = require('../models')
const {BlogM} = require('../models/BlogM')
const {logger} = require('../utils/logger')
const router = express.Router()
const tokenExtractor = require('../utils/tokenExtractor')

require('../initPostgreSql')

let dataValues = (data) => data.map((n) => n.dataValues)

// Works pretty well too!
const includeUser = {
	include: {
		model: UserM, // This adds User of the blog to `user` key ( in each blog item in the array).
		// attributes: {exclude: ['blogs']}, // Removes `userId` property from each note definition bcoz its redundant as `userId` is simply `user.id` which we save at the time of note creation.
	},
}

router.get('/', async (req, res) => {
	let blogs
	blogs = await BlogM.findAll(includeUser)
	// log('notes:', dataValues(blogs)) // This is another way of printing values though!
	// l('notes:', _dataValues(notes)) // This is another way of printing values though!

	// Make user undefined and only send username for each blog item.
	blogs = blogs.map((b) => ({...b.dataValues, user: undefined, username: b.dataValues.user.username}))

	return res.json(blogs) // notes.count is the total number of records(not pages).
})

router.get('/:id', async (req, res) => {
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

router.delete('/:id', tokenExtractor, async (req, res) => {
	const blog = await BlogM.findByPk(req.params.id)
	let blogBelongsToUser = blog.userId == req.decodedToken.id

	if (blogBelongsToUser) {
		const result = await BlogM.destroy({
			where: {
				id: req.params?.id,
			},
		})
		// log('server::', result)
		res.status(201).end()

		return
	} else {
		logger.err('You are not authorized to delete this note!')
		res.status(401).end()
	}
})

router.put('/:id', async (req, res, next) => {
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

router.post('/', tokenExtractor, async (req, res) => {
	let userId = req.decodedToken.id
	// logger.success('userId', userId)
	const blog = await BlogM.create({...req.body, important: true, userId})
	const blogJson = blog.toJSON()
	return res.json(blogJson)
	// try {
	// } catch (error) {
	// 	return res.status(400).json({error})
	// }
})

router.delete('/reset', async (req, res) => {
	// NoteM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	log('?>', BlogM.sync({force: true})) // This creates the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/

	return res.json({message: 'notes removed!'})
})

module.exports = router

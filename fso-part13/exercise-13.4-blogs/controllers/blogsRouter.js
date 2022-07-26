const express = require('express')
const {Op} = require('sequelize')
const {UserM} = require('../models')
const {BlogM} = require('../models/BlogM')
const {logger} = require('sahilrajput03-logger')
const blogsRouter = express.Router()
const tokenExtractor = require('../utils/tokenExtractor')

// To fix the ts-check warnings.
let log = global.log

require('../initPostgreSql')

let dataValues = (data) => data.map((n) => n.dataValues)

// src: https://stackoverflow.com/a/64315233/10012446, year: 2020
// We can do something like that for exclude or include specific attribute with sequelize in Node.js.
// Payment.findAll({
//     where: {
//         DairyId: req.query.dairyid
//     },
//     attributes: {
//         exclude: ['createdAt', 'updatedAt']
//     },
//     include: {
//         model: Customer,
//         attributes:['customerName', 'phoneNumber']
//     }
// })

blogsRouter.get('/', async (req, res) => {
	let blogs
	let where = {}

	if (req.query.search) {
		// exercise 13.13 + 13.14
		where = {
			[Op.or]: [
				{
					author: {[Op.substring]: req.query.search},
				},
				{
					title: {[Op.substring]: req.query.search},
				},
			],
		}
	}

	// Debug where
	// logger.success({where})

	// [Op.or]: [{ a: 5 }, { b: 6 }],

	blogs = await BlogM.findAll({
		// Docs: https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#ordering-and-grouping
		order: [
			// Will escape `likes` and validate DESC against a list of valid direction parameters
			['likes', 'DESC'],
		],
		include: {
			model: UserM, // This adds User of the blog to `user` key ( in each blog item in the array).
			attributes: ['username'], // Only include `username` property from each `user` in each blog definition.
			// ^^ this works, 100%, Source of above: See stackoverflow answer.
		},
		where,
	})
	// log('notes:', dataValues(blogs)) // This is another way of printing values though!
	// l('notes:', _dataValues(notes)) // This is another way of printing values though!

	return res.json(blogs) // notes.count is the total number of records(not pages).
})

blogsRouter.get('/:id', async (req, res) => {
	/** @type object */
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

blogsRouter.delete('/:id', tokenExtractor, async (req, res) => {
	/** @type object */
	const blog = await BlogM.findByPk(req.params.id)

	let blogBelongsToUser = blog.userId == req['decodedToken'].id

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

blogsRouter.put('/:id', async (req, res, next) => {
	/** @type {Object.<String, any>} */
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

blogsRouter.post('/', tokenExtractor, async (req, res) => {
	let userId = req['decodedToken'].id
	// logger.success('userId', userId)
	const blog = await BlogM.create({...req.body, important: true, userId})
	const blogJson = blog.toJSON()
	return res.json(blogJson)
	// try {
	// } catch (error) {
	// 	return res.status(400).json({error})
	// }
})

blogsRouter.delete('/reset', async (req, res) => {
	// NoteM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/
	log('?>', BlogM.sync({force: true})) // This creates the table, dropping it first if it already existed, src: https://sequelize.org/docs/v6/core-concepts/model-basics/

	return res.json({message: 'notes removed!'})
})

module.exports = blogsRouter

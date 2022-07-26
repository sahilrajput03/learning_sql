const jwt = require('jsonwebtoken')
const {SessionM} = require('../models')
const router = require('express').Router()
const {UserM} = require('../models/UserM')
const {logger} = require('sahilrajput03-logger')

router.post('/', async (request, response) => {
	const body = request.body

	/** @type object */
	const user = await UserM.findOne({
		where: {
			username: body.username,
		},
	})

	const passwordCorrect = body.password === 'secret'

	let isEligibleForToken = user && passwordCorrect

	if (!isEligibleForToken) {
		return response.status(401).json({
			error: 'invalid username or password',
		})
	}

	const userForToken = {
		username: user.username,
		id: user.id,
	}

	const token = jwt.sign(userForToken, process.env.SECRET || 'secret')

	// logger.info('got id:', user.id) //!
	//? saving to sessions table
	await SessionM.create({
		userId: user.id,
		token,
	})

	response.status(200).send({token, username: user.username, name: user.name})
})

module.exports = router

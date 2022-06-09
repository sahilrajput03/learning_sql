const jwt = require('jsonwebtoken')
const router = require('express').Router()
const {UserM} = require('../models/UserM')

router.post('/', async (request, response) => {
	const body = request.body

	const user = await UserM.findOne({
		where: {
			username: body.username,
		},
	})

	const passwordCorrect = body.password === 'secret'

	if (!(user && passwordCorrect)) {
		return response.status(401).json({
			error: 'invalid username or password',
		})
	}

	const userForToken = {
		username: user.username,
		id: user.id,
	}

	const token = jwt.sign(userForToken, process.env.SECRET || 'secret')

	response.status(200).send({token, username: user.username, name: user.name})
})

module.exports = router

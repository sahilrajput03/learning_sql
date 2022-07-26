const jwt = require('jsonwebtoken')
const {SessionM} = require('../models')
const router = require('express').Router()
const {logger} = require('sahilrajput03-logger')
const tokenExtractor = require('../utils/tokenExtractor')

router.delete('/', tokenExtractor, async (request, response) => {
	await SessionM.destroy({
		where: {
			// @ts-ignore
			userId: request.decodedToken.id,
		},
	})

	response.status(200).send({message: 'logout successful'})
})

module.exports = router

const jwt = require('jsonwebtoken')
const {SessionM} = require('../models')

// ! The token is retrieved from the request headers, decoded and placed in the req object by the tokenExtractor middleware. When creating a note, a date field is also given indicating the time it was created.
const tokenExtractor = async (req, res, next) => {
	// log(req.headers)
	const authorization = req.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		try {
			req.decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET || 'secret')

			// @ts-ignore
			// let kk = await SessionM.findOne({userId: req.decodedToken.id})
			let session = await SessionM.findOne({
				where: {
					userId: req.decodedToken.id,
				},
			})

			if (session) {
				// only call next if the token is already present in sessions table
				next() // ~Sahil
			} else {
				const errResponse = {error: 'expired token', reason: 'probably token was delete from sessions table via an api action or manually action.'}
				res.status(402).json(errResponse)
			}
		} catch {
			res.status(401).json({error: 'token invalid'})
		}
	} else {
		res.status(401).json({error: 'token missing'})
	}
}
module.exports = tokenExtractor

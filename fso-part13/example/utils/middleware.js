const jwt = require('jsonwebtoken')

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

module.exports = {tokenExtractor}

const router = require('express').Router()

router.get('/bugged_api', async (req, res, next) => {
	try {
		// always wrap your controller code with try catch and pass error to next() so error can be handled by errorHandler middleware.
		// Testing random error handling by errorHandler middleware!
		throw new Error('Some stupid error..')
		// LEARN: Printing error logs of this particular error is supressed in the error handle middleware in `middleware.js` file.
	} catch (error) {
		next(error)
	}
})

router.get('/bugged_api_2', async (req, res, next) => {
	// always wrap your controller code with try catch and pass error to next() so error can be handled by errorHandler middleware.
	// Testing random error handling by errorHandler middleware!
	throw new Error('Some stupid error..')
	// LEARN: Printing error logs of this particular error is supressed in the error handle middleware in `middleware.js` file.
})

module.exports = router

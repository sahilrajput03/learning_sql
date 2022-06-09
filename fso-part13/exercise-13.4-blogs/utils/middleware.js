const unknownEndpoint = (request, response) => {
	response.status(404).send({error: 'unknown endpoint'})
}

// Centralize the application error handling in this middleware
const errorHandler = (error, request, response, next) => {
	// console.error(error.message)

	// console.log('got error... -- BOOO YAHHHH')

	switch (error.name) {
		case 'CastError':
			response.status(400).send({error: 'malformatted id'})
			break

		case 'ValidationError':
			response.status(400).json({error: error.message})
			break

		default:
			response.status(400).json({
				error: error.message,
				funFact: 'Server does not have separate error detecting case for this error in errorHndler middleware yet!! ~ Sahil',
			})
			break
	}

	let NODE_ENV = process.env
	// log({NODE_ENV})

	if (process.env.NODE_ENV === 'test') {
		let enabled = 1
		console.log('SERVER ERROR LOGS ARE', enabled ? '`enabled`' : '`disabled`', '~ Express `errorHandler` middleware ~ Sahil')
		if (enabled) {
			if (error.message === 'Some stupid error..') {
				return // supressing prinitng my stupid errors.
			}

			// Since at times we want to read error messages in express server else  errors won't show in the terminal at all.
			console.log({error}) // coz we need enable loggging of error when we are using `express-async-errors`.
		}
		next(error)
	} else {
		// LEARN: Enable errors logging for dev and production environment by default!
		next(error)
		// ^^ LEARN: ALERT: When we use `express-async-errors` express doesn't print the error to the console at all so we must print the error to console manually by having:
		console.log({error}) // coz we need enable loggging of error when we are using `express-async-errors`.
	}
}

module.exports = {unknownEndpoint, errorHandler}

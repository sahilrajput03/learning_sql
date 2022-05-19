/* globals log */
const unknownEndpoint = (request, response) => {
	response.status(404).send({error: 'unknown endpoint'})
}

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
				funFact: 'Server does not have separate error detecting case for this error in errorHndler middleware yet!!',
			})
			break
	}

	let NODE_ENV = process.env
	// log({NODE_ENV})

	if (process.env.NODE_ENV === 'test') {
		// ! Caution here for test mode!
		// Only uncomment below line if you want errors in test mode.
		// Since at times we want to read error messages in express server so we would need to uncomment below line to read such errors else it the errors won't show  in the terminal at all.
		// next(error)
	} else {
		// LEARN: Enable errors logging for dev and production environment by default!
		next(error)
	}
}

module.exports = {unknownEndpoint, errorHandler}

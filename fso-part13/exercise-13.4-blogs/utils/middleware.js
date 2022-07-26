const {logger, loggert} = require('sahilrajput03-logger')

const unknownEndpoint = (request, response) => {
	logger.err('got here unknownEndpoint', request.path)
	response.status(404).send({error: 'unknown endpoint'})
}

// FYI: https://github.com/sahilrajput03/sahilrajput03/blob/master/README.md#did-you-know-we-can-get-the-number-of-parameters-defined-in-its-function-definition-
// Centralize the application error handling in this middleware
const errorHandler = (err, request, response, next) => {
	let customErrorMessage
	// console.error(error.message)

	// ######## HANDLING RESPONSES ####### //
	// console.log('got error... -- BOOO YAHHHH')
	switch (err.name) {
		case 'CastError':
			response.status(400).send({error: 'malformatted id'})
			break

		case 'ValidationError':
			response.status(400).json({error: err.message})
			break

		case 'SequelizeValidationError':
			customErrorMessage = err.message // We want to print this to console so assigninig it to customErrorMessage as well.
			response.status(400).json({error: {name: err.name, message: err.message}})
			break

		default:
			if (err.message === 'Some stupid error..') {
				customErrorMessage = err.message
			}

			response.status(400).json({
				error: {
					name: err.name,
					message: err.message,
				},
				funFact: 'Server does not have separate error detecting case for this error in errorHndler middleware yet!! ~ Sahil',
			})
			break
	}
	// ######## HANDLING RESPONSES ENDS HERE ####### //

	next(err)
	// ^^ LEARN: ALERT: When we use `express-async-errors` express doesn't print the error to the console at all so we must print the error to console manually by having:

	// ######## PRINITNG ERRORS ####### //
	let printErrors = () => {
		logger.err('error.name is: ' + err.name + ', error.message is: ' + err.message)

		if (customErrorMessage) {
			logger.err('customErrorMessage', customErrorMessage)
		} else {
			// Since at times we want to read error messages in express server else  errors won't show in the terminal at all.
			logger.err({error: err}) // coz we need enable loggging of error when we are using `express-async-errors`.
		}
	}
	// ######## PRINITNG ERRORS - ENDS HERE ####### //

	/** Short notes for cases for printing errors:
	 * TESTING 		ENABLED	= 	ERROR PRINTED
	 * 1			1 		= 	1
	 * 1			0 		= 	0
	 * 0			1 		= 	1
	 * 0			0 		= 	1
	 */
	let SERVER_ERRORS_IN_TESTING = 0

	if (process.env.NODE_ENV === 'test') {
		logger.info('TEST MODE: SERVER ERROR LOGS ARE ' + (SERVER_ERRORS_IN_TESTING ? '`enabled`' : '`disabled`') + ' ~ `errorHandler` middleware ~ Sahil')
		if (SERVER_ERRORS_IN_TESTING) printErrors()
	} else {
		printErrors()
	}
}

module.exports = {unknownEndpoint, errorHandler}

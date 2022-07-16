// @ts-check
const chalk = require('chalk')
const path = require('path')

let createLogger = (tag) => ({
	success: (...args) => printer([tag, ...args], chalk.bgGreen.yellow.bold),
	info: (...args) => {
		// let l = __line
		// console.log('boom', __line)
		return printer([tag, ...args], chalk.yellowBright.bold.bgCyan)
	},
	err: (...args) => printer([tag, ...args], chalk.yellow.bgRed.bold),
})

let logger = createLogger('SERVER:')
let loggert = createLogger('TESTING:') // logger for testing

module.exports = {logger, loggert}

// :levels => {
//   :debug => :blue,
//   :info  => :cyan,
//   :warn  => :yellow,
//   :error => :red,
//   :fatal => [:white, :on_red]
// }

/*

/ General way to use chalk library (not a good way to use for object and array).
console.log(chalk.bgGreen.yellow.bold(args))

/ Why printer function? Ans. https://github.com/chalk/chalk/issues/427#issuecomment-757442108

/ My advanced way to use chalk which works with strings, objects and arrays.
printer(args, chalk.bgGreen.yellow.bold)

##### Why I am using a printer function ??
 coz without that it I nwould need to fix it on every long using inspect function, source: check in `Good Ways` section below..

/ BAD SYNTAXES
 logger.success({car: 10}) // OUTPUT: [object Object]
 logger.success(['bar', 20]) // OUTPUT: bar,20

 / GODD WAYS? A. Use builtin `inspect` Src: https://github.com/chalk/chalk/issues/427#issuecomment-757442108
 logger.success(inspect({car: 10}))
 logger.success(inspect(['bar', 20]))
*/

// Disable depth limit while printing objects to console (Default value is 2)
// src: https://nodejs.dev/learn/how-to-log-an-object-in-nodejs
// require('util').inspect.defaultOptions.depth = null
// ^^ THIS IS NOT REQUIRED COZ I PASSED `{depth: null}` as second paramter to the inspect call below.

const printer = (args, chalkify) => {
	if (args.length === 0) throw '::::::error::::: no argument supplied to logger'
	args.forEach((element) => {
		if (typeof element === 'object') {
			const {inspect} = require('util') // src: https://stackoverflow.com/a/6157569/10012446
			process.stdout.write(chalkify(inspect(element, {depth: null})))
			// FYI: We can simply colorize the output inspect (see in the end of this page) - https://nodejs.org/en/knowledge/getting-started/how-to-use-util-inspect/
		} else {
			process.stdout.write(chalkify(element))
		}
		process.stdout.write(' ')
	})

	// BOTH OF BELOW ARE NECESSARY TO SUPRESS ts-check and eslint errors.
	// @ts-ignore
	// eslint-disable-next-line no-undef
	process.stdout.write(chalk.underline('' + path.basename(__filenameCustom) + ' #' + __line))
	process.stdout.write('\n') // print new line after printing each element in the log i.e., logger.success(elem1, elem2, elem3, ...)
}

// FYI: A less alternate way to make use of line number is via: https://www.npmjs.com/package/logat
// ^^ Its a ready made try on tool though. ~ Sahil

// Adding `__number` and `__filenameCustom` global variable support
// src https://stackoverflow.com/a/14172822/10012446 (<< this answer has another link of stackoverflow answer i.e., src of this answer: https://stackoverflow.com/questions/11386492/accessing-line-number-in-v8-javascript-chrome-node-js)
// src: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack

Object.defineProperty(global, '__stack', {
	get: function () {
		var orig = Error.prepareStackTrace
		Error.prepareStackTrace = function (_, stack) {
			return stack
		}
		var err = new Error()
		Error.captureStackTrace(err, arguments.callee)
		var stack = err.stack
		Error.prepareStackTrace = orig
		return stack
	},
})

Object.defineProperty(global, '__line', {
	get: function () {
		// return __stack[1]
		// return __stack[2].getLineNumber()
		return __stack[3].getLineNumber()
	},
})

// I made this function simply by altering the stack[indexNumberHere] and that's all I needed to fix this. ~ Sahil
Object.defineProperty(global, '__filenameCustom', {
	get: function () {
		return __stack[3].getFileName()
	},
})

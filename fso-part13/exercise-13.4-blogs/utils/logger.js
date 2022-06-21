// @ts-check
const chalk = require('chalk')

let createLogger = (tag) => ({
	success: (...args) => printer([tag, ...args], chalk.bgGreen.yellow.bold),
	info: (...args) => printer([tag, ...args], chalk.yellowBright.bold.bgCyan),
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

const printer = (args, chalkify) => {
	if (args.length === 0) throw '::::::error::::: no argument supplied to logger'
	args.forEach((element) => {
		if (typeof element === 'object') {
			const {inspect} = require('util') // src: https://stackoverflow.com/a/6157569/10012446
			process.stdout.write(chalkify(inspect(element)))
		} else {
			process.stdout.write(chalkify(element))
		}
		process.stdout.write(' ')
	})
	process.stdout.write('\n') // print new line after printing each element in the log i.e., logger.success(elem1, elem2, elem3, ...)
}

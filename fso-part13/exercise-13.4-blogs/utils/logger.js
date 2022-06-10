const chalk = require('chalk')

// testingLog
let tlog = (...args) => console.log(chalk.white.bgBlue.bold(JSON.stringify(...args, null, 2)))
let tilog = (...args) => console.log(chalk.cyan.bold(JSON.stringify(...args, null, 2)))

// serverLog
let slog = (...args) => console.log(chalk.yellow.bgRed.bold(JSON.stringify(...args, null, 2)))
let silog = (...args) => console.log(chalk.cyan.bold(JSON.stringify(...args, null, 2)))

module.exports = {tlog, tilog, slog, silog}

// :levels => {
//   :debug => :blue,
//   :info  => :cyan,
//   :warn  => :yellow,
//   :error => :red,
//   :fatal => [:white, :on_red]
// }

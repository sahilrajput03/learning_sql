const colors = require('colors')

colors.setTheme({
	info: 'bgGreen',
	help: 'cyan',
	warn: 'yellow',
	success: 'bgBlue',
	error: 'red',
	m: 'magenta', // myString.m.b Fox chaining.: for chaining.
	b: 'bold',
	bm: ['bold', 'magenta'],
	by: ['bold', 'yellow'],
})

// Usage: Simply put below line in your server file:
// require('./colorsConfig')

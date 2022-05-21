require('colors')

const s = (v) => JSON.stringify(v, null, 2)
const log = console.log
const isTesting = process.env.NODE_ENV === 'test'
const logMw = (req, _, next) => {
	if (!isTesting) {
		log(`@@@${req.method.bgGreen} @${req.path} @query: ${s(req.query).magenta} @params: ${s(req.params).magenta} @body:${s(req.body).magenta} `)
	}
	next()
}

module.exports = logMw

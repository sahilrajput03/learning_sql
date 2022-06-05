const express = require('express')
const logMw = require('logmw')
const {l, s, ps, dataValues, _dataValues} = require('./utils')
const router = require('./controllers/notes')

const app = express()

app.use(express.json())
app.use(logMw)

app.use('/api/notes', (req, res, next) => {
	router(req, res, next)
})

module.exports = app

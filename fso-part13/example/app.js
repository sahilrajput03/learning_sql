const express = require('express')
const logMw = require('logmw')
const {l, s, ps, dataValues, _dataValues} = require('./utils')
const router = require('./routes')

const app = express()

app.use(express.json())
app.use(logMw)

app.use('/', (req, res, next) => {
	router(req, res, next)
})

module.exports = app

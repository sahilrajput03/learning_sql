const express = require('express')
// const BlogM = require('./models/Note')
const logMw = require('logmw')
const {l, s, ps, dataValues, _dataValues} = require('./utils')
const {connection} = require('./initPostgreSql')
const router = require('./routes')

connection.then(() => {
	console.log('Connection to postgres established!')
})

// let log = console.log
// log('typeof db', db)

const app = express()
const middleware = require('./utils/middleware')

app.use(express.json())
app.use(logMw)

app.use('/', function (req, res, next) {
	router(req, res, next)
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app // for testing with supertest as kalle said, supertest is actually nice!

const express = require('express')
require('express-async-errors')

// const BlogM = require('./models/Note')
const logMw = require('logmw')
const {l, s, ps, dataValues, _dataValues} = require('./utils')
const connection = require('./initPostgreSql')
const blogsRouter = require('./controllers/blogs')

connection.then(() => {
	console.log('Connection to postgres established!')
})

// let log = console.log
// log('typeof db', db)

const app = express()
const middleware = require('./utils/middleware')

app.use(express.json())

// Disable logMw for a while
// app.use(logMw)

app.use('/', function (req, res, next) {
	blogsRouter(req, res, next)
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app // for testing with supertest as kalle said, supertest is actually nice!

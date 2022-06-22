const express = require('express')
require('express-async-errors')

// const BlogM = require('./models/Note')
const logMw = require('logmw')
const {l, s, ps, dataValues, _dataValues} = require('./utils')
const {connection} = require('./initPostgreSql')
const blogsRouter = require('./controllers/blogsRouter')
const usersRouter = require('./controllers/usersRouter')
const authorsRouter = require('./controllers/authorsRouter')
const loginRouter = require('./controllers/loginRouter')
const buggedRouter = require('./controllers/buggedRouter')

// let log = console.log
// log('typeof db', db)

const app = express()
const middleware = require('./utils/middleware')
const {logger} = require('./utils/logger')

app.use(express.json())

// Disable logMw for a while
// app.use(logMw)

app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/bugged', buggedRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app // for testing with supertest as kalle said, supertest is actually nice!

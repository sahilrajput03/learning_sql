const express = require('express')
const {logger, logMw} = require('sahilrajput03-logger')
require('express-async-errors')

const {blogsRouter, usersRouter, authorsRouter, loginRouter, logoutRouter, buggedRouter, readingListRouter} = require('./controllers')

const app = express()
const middleware = require('./utils/middleware')

app.use(express.json())

// Disable logMw for a while
app.use(logMw)

app.use('/api/blogs', blogsRouter)
app.use('/api/authors', authorsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/logout', logoutRouter)
app.use('/api/bugged', buggedRouter)
app.use('/api/readinglists', readingListRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app // for testing with supertest as kalle said, supertest is actually nice!

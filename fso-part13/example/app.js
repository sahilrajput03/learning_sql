const express = require('express')
const morgan = require('morgan')
const {logMw} = require('sahilrajput03-logger')

const {l, s, ps, dataValues, _dataValues} = require('./utils')
require('express-async-errors')

const {notesRouter, usersRouter, loginRouter} = require('./controllers')

const app = express()

app.use(express.json())
app.use(logMw)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app

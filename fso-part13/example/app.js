const express = require('express')
const logMw = require('logmw')
const {l, s, ps, dataValues, _dataValues} = require('./utils')
const notesRouter = require('./controllers/notesRouter')
const usersRouter = require('./controllers/usersRouter')
const loginRouter = require('./controllers/loginRouter')

const app = express()

app.use(express.json())
app.use(logMw)

app.use('/api/notes', notesRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

module.exports = app

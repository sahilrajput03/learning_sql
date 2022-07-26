const blogsRouter = require('./blogsRouter')
const usersRouter = require('./usersRouter')
const authorsRouter = require('./authorsRouter')
const loginRouter = require('./loginRouter')
const logoutRouter = require('./logoutRouter')
const buggedRouter = require('./buggedRouter')
const readingListRouter = require('./readingListRouter')

module.exports = {
	blogsRouter,
	usersRouter,
	authorsRouter,
	loginRouter,
	logoutRouter,
	buggedRouter,
	readingListRouter,
}

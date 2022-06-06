const NoteM = require('./NoteM')
const UserM = require('./UserM')

// Now let's make every insertion of a new note be associated to a user, i.e., one user has association with multiple notes.
UserM.hasMany(NoteM)
NoteM.belongsTo(UserM)

// For test environment we completely clear the database so we don't need to create table at all ~ IMO.
if (process.env.NODE_ENV !== 'test') {
	NoteM.sync({alter: true})
	UserM.sync({alter: true})
} else {
	console.log('Running in express in test environment.. ~ Sahil')
}

module.exports = {
	NoteM,
	UserM,
}

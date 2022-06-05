const NoteM = require('./NoteM')
const UserM = require('./UserM')

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

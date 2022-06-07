const NoteM = require('./NoteM')
const UserM = require('./UserM')

// Now let's make every insertion of a new note be associated to a user, i.e., one user has association with multiple notes.
UserM.hasMany(NoteM) // LEARN: Sequelize will automatically create an attribute called `userId` on the Note model to which, when referenced gives access to the database column `user_id`.
// Official Docs: The A.hasMany(B) association means that a One-To-Many relationship exists between A and B, with the foreign key being defined in the target model (B). Source: https://sequelize.org/docs/v6/core-concepts/assocs/

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

const {NoteM, initNoteM} = require('./NoteM')
const {UserM, initUserM} = require('./UserM')
const {TeamM, initTeamM} = require('./TeamM')
const {MembershipM, initMembershipM} = require('./MembershipM')
const {UserNotesM, initUserNotesM} = require('./UserNotes')

const setupModels = (sequelize) => {
	// Setup models
	initNoteM(sequelize)
	initUserM(sequelize)
	initTeamM(sequelize)
	initMembershipM(sequelize)
	initUserNotesM(sequelize)
	// Amazing ``one to many philosophy`` (official docs): https://sequelize.org/docs/v6/core-concepts/assocs/#one-to-many-relationships
	// ^^: One-To-Many associations are connecting one source with multiple targets, while all these targets are connected only with this single source.
	// This means that, unlike the One-To-One association, in which we had to choose where the foreign key would be placed, there is only one option in One-To-Many associations. For example, if one Foo has many Bars (and this way each Bar belongs to one Foo), then the only sensible implementation is to have a fooId column in the Bar table. The opposite is impossible, since one Foo has many Bars.

	// SEQUEALIZE Associations are always used in pairs like below ``hasMany+belongsTo``. Src: https://sequelize.org/docs/v6/core-concepts/assocs/#goal-1
	// Now let's make every insertion of a new note be associated to a user, i.e., one user has association with multiple notes.

	// tl;dr: FYI: From docs foreign key will be defined in target model, i.e., in `NoteM` as `userId` property.
	// tl;dr: FSO: The User.hasMany(Note) definition therefore attaches a `notes` property to the user object, which gives access to the notes made by the user.
	UserM.hasMany(NoteM, {
		// LEARN: Below can cause error on database startup if there are some notes which have null property set for userId property i.e., foreign key.
		// By default, the association is considered optional. In other words, in our example, the fooId is allowed to be null, meaning that one Bar can exist without a Foo. Changing this is just a matter of specifying allowNull: false in the foreign key options: src: https://sequelize.org/docs/v6/core-concepts/assocs/#mandatory-versus-optional-associations
		// foreignKey: {
		// 	allowNull: false,
		// },
	}) //? LEARN: Sequelize will automatically create an attribute called `userId`(to reference `user_id` column) on the Note model to which, when referenced gives access to the database column `user_id`.
	// Official Docs: The A.hasMany(B) association means that a One-To-Many relationship exists between A and B, with the foreign key being defined in the target model (B). Source: https://sequelize.org/docs/v6/core-concepts/assocs/

	// tl;dr: This is to complete the above `hasMany` relationship (necessary).
	NoteM.belongsTo(UserM)
	// The A.belongsTo(B) association means that a One-To-One relationship exists between A and B, with the foreign key being defined in the source model (A).

	// Many to many relationship:
	// FSO: The User.hasMany(Note) definition therefore attaches a `notes` property to the user object, which gives access to the notes made by the user.
	// FSO: The User.belongsToMany(Team, { through: Membership })) definition similarly attaches a `teams` property to the user object, which can also be used in the code:
	UserM.belongsToMany(TeamM, {through: MembershipM}) // links `teams` key in `UserM`, TESTED and VERIFIED.
	TeamM.belongsToMany(UserM, {through: MembershipM}) // links `users` key in `TeamM`, TESTED and VERIFIED.
	// Model MembershipM (Table) will have structure like {userId: 2, teamId: 3}

	// https://fullstackopen.com/en/part13/migrations_many_to_many_relationships#revisiting-many-to-many-relationships
	UserM.belongsToMany(NoteM, {through: UserNotesM, as: 'marked_notes'})
	NoteM.belongsToMany(UserM, {through: UserNotesM, as: 'users_marked'})
	// Using alias in through coz default `notes` and `users` key would overlap previously defined keys.
}

module.exports = {
	NoteM,
	UserM,
	TeamM,
	MembershipM,
	UserNotesM,
	setupModels,
}

/* 
? Works good, populates `users` key in teams table and `teams` key in users table.
test('??', async () => {
	const t = await TeamM.findAll({
		include: {model: UserM},
	})
	loggert.info(t.map((t) => t.toJSON()))
})

test('??', async () => {
	const t = await UserM.findAll({
		include: {model: TeamM},
	})
	loggert.info(t.map((t) => t.toJSON()))
})
*/

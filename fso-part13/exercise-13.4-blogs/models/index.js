const {BlogM, initBlogM} = require('./BlogM')
const {UserM, initUserM} = require('./UserM')

const setupAssociations = () => {
	// Amazing ``one to many philosophy`` (official docs): https://sequelize.org/docs/v6/core-concepts/assocs/#one-to-many-relationships
	// ^^: One-To-Many associations are connecting one source with multiple targets, while all these targets are connected only with this single source.
	// This means that, unlike the One-To-One association, in which we had to choose where the foreign key would be placed, there is only one option in One-To-Many associations. For example, if one Foo has many Bars (and this way each Bar belongs to one Foo), then the only sensible implementation is to have a fooId column in the Bar table. The opposite is impossible, since one Foo has many Bars.

	// SEQUEALIZE Associations are always used in pairs like below ``hasMany+belongsTo``. Src: https://sequelize.org/docs/v6/core-concepts/assocs/#goal-1
	// Now let's make every insertion of a new note be associated to a user, i.e., one user has association with multiple notes.
	// FYI: From docs foreign key will be defined in target model, i.e., in `NoteM` as `userId` property.
	UserM.hasMany(BlogM, {
		// LEARN: Below can cause error on database startup if there are some notes which have null property set for userId property i.e., foreign key.
		// By default, the association is considered optional. In other words, in our example, the fooId is allowed to be null, meaning that one Bar can exist without a Foo. Changing this is just a matter of specifying allowNull: false in the foreign key options: src: https://sequelize.org/docs/v6/core-concepts/assocs/#mandatory-versus-optional-associations
		// foreignKey: {
		// 	allowNull: false,
		// },
	}) // LEARN: Sequelize will automatically create an attribute called `userId` on the Note model to which, when referenced gives access to the database column `user_id`.
	// Official Docs: The A.hasMany(B) association means that a One-To-Many relationship exists between A and B, with the foreign key being defined in the target model (B). Source: https://sequelize.org/docs/v6/core-concepts/assocs/
	// The A.hasMany(B) association means that a One-To-Many relationship exists between A and B, with the foreign key being defined in the target model (B).

	BlogM.belongsTo(UserM)
	// The A.belongsTo(B) association means that a One-To-One relationship exists between A and B, with the foreign key being defined in the source model (A).
}

module.exports = {
	BlogM,
	initBlogM,
	UserM,
	initUserM,
	setupAssociations,
}

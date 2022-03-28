const User = require('./models/User')

const js = JSON.stringify

module.exports = async () => {
	await User.sync()

	console.log('Jane was saved to the database!'.bm)
	// ? This creates the User table it already doesn't exist. Read its docs for more.

	const jane = await User.create({
		firstName: 'Joe',
		age: 25,
		gender: 'male',
		india: 'yoyo',
	})
	console.log(js(jane, null, 2).bm)
	// Jane exists in the database now!
}

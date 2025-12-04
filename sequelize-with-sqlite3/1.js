// @ts-nocheck
const { connectDB, disconnectDB } = require('./db.js');
const { UserModel } = require('./models/User.js');

async function main() {
	console.log('🚀 Running main function:');
	try {
		await connectDB();

		// Creates table if it doesn't exist
		await UserModel.sync();

		// Delete all users
		await UserModel.destroy({
			where: {}, // no condition i.e, deletes all rows
			truncate: true  // optional: resets auto-increment IDs
		});

		const jane = await UserModel.create({
			firstName: 'Joe',
			age: 25,
			gender: 'male',
			india: 'yoyo',
		});
		console.log('✅ Jane saved to the database!', jane.toJSON());

		const users = await UserModel.findAll();
		console.log("🚀 ~ users:", users.map(user => user.toJSON()));

		await disconnectDB();
	} catch (error) {
		console.error('❌ Error:', error);
	}
}

main();
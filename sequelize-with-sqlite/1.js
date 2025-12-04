// @ts-nocheck
const { connectDB, disconnectDB } = require('./db.js');
const { UserModel } = require('./models/User');

async function main() {
	console.log('🚀 Running main function:');
	try {
		await connectDB();

		await UserModel.sync();

		console.log('✅ Jane saved to the database!');

		// Learn: It creates the User table if doesn't exist already.
		const jane = await UserModel.create({
			firstName: 'Joe',
			age: 25,
			gender: 'male',
			india: 'yoyo',
		});
		console.log('jane?', JSON.stringify(jane, null, 2));
		// Jane exists in the database now!

		await disconnectDB();
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
}

main();
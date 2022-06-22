// src: https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html

//? Global Variable definitions with .d.ts files
// Way 1
// declare let connectToDb
// declare let connectToDb : () => void
// declare let closeDb
// declare let beforeAll
// declare let test
// declare let sequelize

// Way 2 (export {} is necessary for way2 to work)
// Or we can do
declare global {
	let connectToDb, closeDb, beforeAll, test, sequelize
}
export {}

declare
BlogM = String

// Use test environemnt form .env.test file.
const dotenv = require('dotenv')
const path = require('path')
dotenv.config({path: path.join(__dirname, '..', '.env.test')}) // Joining path using path.join and __dirname allows us to execute files withSupertest using `fr withSupertest` from inside __tests__ folder and from the root folder as well.

// Rollback last migration
const {rollbackMigration} = require('../db')
rollbackMigration()

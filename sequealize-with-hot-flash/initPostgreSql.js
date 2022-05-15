const {Sequelize, Model, DataTypes} = require('sequelize')

const prod = 0
let DATABASE_URL, config
if (prod) {
	DATABASE_URL = process.env.db_connect_string
	config = {
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	}
} else {
	DATABASE_URL = 'postgres://array@localhost:5432/myDb1'
	// config = null; // Its must be null(can't send undefined).
	config = {
		logging: false, // Turn off logging, src: https://stackoverflow.com/a/55874733/10012446
	}
}

console.log('DATABASE_URL'.bgGreen, DATABASE_URL.green)
const sequelize = new Sequelize(DATABASE_URL, config)

module.exports = sequelize.authenticate()
// .then(() => {
// 	console.log('Connection has been established successfully.'.mb)
// })
// .catch((err) => {
// 	console.error('~Sahil: Unable to connect to the database :'.bgRed, err)
// })

// module.exports = sequelize

// NoteModel
class NoteM extends Model {}

NoteM.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		content: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		important: {
			type: DataTypes.BOOLEAN,
		},
		date: {
			type: DataTypes.DATE,
		},
	},
	{
		sequelize,
		underscored: true,
		timestamps: false,
		modelName: 'note',
	}
)

NoteM.sync({alter: true}) // This checks what is the current state of the table in the database (which columns it has, what are their data types, etc), and then performs the necessary changes in the table to make it match the model. // src: https://sequelize.org/docs/v6/core-concepts/model-basics/

// module.exports = NoteM
global.NoteM = NoteM
global.sequelize = sequelize

// global.log = console.log
// global.connection = connection
// global.personModel = personModel
// global.gadgetModel = gadgetModel
// global.GADGET_COLLECTION_NAME = GADGET_COLLECTION
// global.PERSON_COLLECTION_NAME = PERSON_COLLECTION
// global.DB_NAME = DB_NAME

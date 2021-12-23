require("dotenv").config();
require("./setupColors");

const { Sequelize, QueryTypes } = require("sequelize");
const prod = 0;
let DATABASE_URL, config;
if (prod) {
  DATABASE_URL = process.env.db_connect_string;
  config = {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  };
} else {
  DATABASE_URL = "postgres://array@localhost:5432/myDb1";
  config = null; // Its must to supply null(can't send undefined).
}

console.log("DATABASE_URL".bgGreen, DATABASE_URL.green);
const sequelize = new Sequelize(DATABASE_URL, config);

const main = async () => {
  try {
    console.log("Authentication started...".bby);
    await sequelize.authenticate();
    console.log("Connection has been established successfully.".mb);
    const notes = await sequelize.query("SELECT * FROM notes", {
      type: QueryTypes.SELECT,
    });
    console.log("notes", notes);
    await sequelize.close();
  } catch (error) {
    console.error("Unable to connect to the database:".bgRed, error);
  }
};

main();

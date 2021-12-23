require("dotenv").config();
require("./setupColors");

const { Sequelize, QueryTypes } = require("sequelize");
const express = require("express");
const app = express();

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
  config = null; // Its must be null(can't send undefined).
}

console.log("DATABASE_URL".bgGreen, DATABASE_URL.green);
const sequelize = new Sequelize(DATABASE_URL, config);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.".mb);
  })
  .catch((err) => {
    console.error("~Sahil: Unable to connect to the database :".bgRed, err);
  });

app.get("/api/notes", async (req, res) => {
  const notes = await sequelize.query("SELECT * FROM notes", {
    type: QueryTypes.SELECT,
  });
  res.json(notes);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

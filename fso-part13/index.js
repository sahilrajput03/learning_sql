require("dotenv").config();
require("./setupColors");
const logMw = require("logmw");

const { Sequelize, QueryTypes, Model, DataTypes } = require("sequelize");
const express = require("express");
const app = express();
app.use(express.json());

const s = JSON.stringify;
const p = JSON.parse;

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
  // config = null; // Its must be null(can't send undefined).
  config = {
    logging: false, // Turn off logging, src: https://stackoverflow.com/a/55874733/10012446
  };
}

console.log("DATABASE_URL".bgGreen, DATABASE_URL.green);
const sequelize = new Sequelize(DATABASE_URL, config);

class Note extends Model {}
Note.init(
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
    modelName: "note",
  }
);

Note.sync();

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.".mb);
  })
  .catch((err) => {
    console.error("~Sahil: Unable to connect to the database :".bgRed, err);
  });

app.use(logMw);
app.get("/api/notes", async (req, res) => {
  let notes = await Note.findAll();
  console.log("my notes:", p(s(notes, null, 2))); // Parsing the object makes the printed object colored accordingly to the data types.
  res.json(notes);
});

app.get("/api/notes/:id", async (req, res) => {
  const note = await Note.findByPk(req.params.id);
  console.log("my note::", p(s(note))); // However, perhaps a better solution is to turn the collection into JSON for printing by using the method JSON.stringify:
  // console.log("my note::", s(note)); // However, perhaps a better solution is to turn the collection into JSON for printing by using the method JSON.stringify:
  if (note) {
    note.important = req.body.important;
    await note.save();
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.post("/api/notes", async (req, res) => {
  console.log(req.body);
  try {
    const note = await Note.create({ ...req.body, important: true });
    return res.json(note);
  } catch (error) {
    return res.status(400).json({ error });
  }
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const { DataTypes } = require("sequelize");
const sequelize = require("../sz.js");

// model definition
const User = sequelize.define(
  "User",
  {
    // Model attributes are defined here
    firstName: {
      type: DataTypes.STRING,
      // Data types: https://sequelize.org/master/manual/model-basics.html#data-types
      allowNull: false, // default: true
    },
    lastName: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.NUMBER,
    },
    gender: {
      type: DataTypes.STRING,
    },
    india: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true, // You can stop the auto-pluralization performed by Sequelize using the freezeTableName: true option.
    // Other model options go here
  }
);

module.exports = User;

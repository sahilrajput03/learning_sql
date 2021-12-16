require("colors");
const sequelize = require("./sz.js");

async function main() {
  try {
    await sequelize.authenticate();
    console.log("\n:: ---- CONNECTED\n".yellow.bold);

    await require("./1")();

    await sequelize.close(); // close the connection.
    console.log("\n:: ---- DISCONNECTED\n".yellow.bold);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

main();

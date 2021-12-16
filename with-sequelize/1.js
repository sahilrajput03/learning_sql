const User = require("./models/User");
const colors = require("colors");

colors.setTheme({
  info: "bgGreen",
  help: "cyan",
  warn: "yellow",
  success: "bgBlue",
  error: "red",
  m: "magenta", // myString.m.b Fox chaining.: for chaining.
  b: "bold",
  mb: ["magenta", "bold"],
});

const js = JSON.stringify;

module.exports = async () => {
  await User.sync();

  console.log("Jane was saved to the database!".mb);
  // ? This creates the User table it already doesn't exist. Read its docs for more.

  const jane = await User.create({
    firstName: "Joe",
    age: 25,
    gender: "male",
    india: "yoyo",
  });
  console.log(js(jane, null, 2).mb);
  // Jane exists in the database now!
};

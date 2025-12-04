# README

For express+sequelize example, please refer official guide on it - https://github.com/sequelize/express-example

```js
// Creates table if it doesn't exist
await UserModel.sync(); 

// Drops table if exists and recreates it
await UserModel.sync({ force: true });

// Alters table to match model without dropping
await UserModel.sync({ alter: true });
```
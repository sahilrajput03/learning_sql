// Why use `better-sqlite3` instead of `sqlite3`? - Because the later is callback based and the former is synchronous.

// Github: https://github.com/WiseLibs/better-sqlite3
// Inspiration: https://chatgpt.com/c/69319168-08dc-8321-bb0f-2165af79f09c
const Database = require('better-sqlite3');
const db = new Database('./db.sqlite');

// Create table
db.prepare(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  name TEXT
)`).run();

// Insert data
const result = db.prepare(`INSERT INTO users(name) VALUES(?)`).run('Bob');
console.log('Inserted row id:', result.lastInsertRowid);

// Query data
const rows = db.prepare(`SELECT * FROM users`).all();
console.log(rows);

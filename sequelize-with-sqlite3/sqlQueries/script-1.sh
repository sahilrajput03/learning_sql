#!/usr/bin/env bash

dbFile=db2.sqlite

# Learn: Create table
# sqlite3 $dbFile "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT);"

# Learn: Insert user, Get all users
# sqlite3 $dbFile \
# "INSERT INTO users (name) VALUES ('Bob'); \
# SELECT * FROM users;"

# Learn: Get all users
# sqlite3 $dbFile "SELECT * FROM users;"

# Learn: Create Table, Insert, Get all users
rm $dbFile
sqlite3 $dbFile "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT); \
INSERT INTO users (name) VALUES ('Alice'); \
SELECT * FROM users;"

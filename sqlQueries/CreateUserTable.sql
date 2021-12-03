-- SQLite
-- Use hotkey: ctrl+shift+q to execute the query.
-- Use vscode extension: alexcvzz.vscode-sqlite
-- NOT NULL means that now this field can be assigned non-nullable values only.

CREATE TABLE User (
	firstName TEXT,
	-- firstName TEXT PRIMARY KEY,
   	lastName TEXT,
   	id TEXT,
   	createdAt TEXT NOT NULL,
   	updatedAt TEXT NOT NULL
);

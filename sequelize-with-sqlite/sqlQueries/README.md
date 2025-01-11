# Learn SQLite 3

```bash
$ sqlite3
Use below commands to use it:
.open database.sqlite   # opens the database file
.tables                 # shows tables
.schema user            # shows schema of `user` table
.help                   # shows help for all commands
.exit (to exit shell OR use ctrl+d OR cmd+c (twice))
```

**Quick Links:**

- Docs of sqlite3 cli: https://www.sqlite.org/cli.html
- Sqlite features that aren't implemented in sqlite: https://sqlite.org/omitted.html
  - qutoing from above link: `Other kinds of ALTER TABLE operations such as ALTER COLUMN, ADD CONSTRAINT, and so forth are omitted.`
- SQL docs (w3school): https://www.w3schools.com/sql/default.asp

# Using database files and running commands via .sql files

11 Jan 2025

```bash
# Run the setup.sql in your db file (file will be created if not present)
sqlite3 sqlite.db < setup.sql

# Opens the SQLite database file `sqlite.db` in the SQLite command-line interface for querying and managing the database
sqlite3 sqlite.db
```

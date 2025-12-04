# Learn SQLite 3 CLI

```bash
$ sqlite3
Use below commands to use it:
.open db.sqlite   # opens the database file
.tables                 # shows tables
.schema user            # shows schema of `user` table
.help                   # shows help for all commands
.exit (to exit shell OR use ctrl+d OR cmd+c (twice))
```

**Quick Links:**

- Inspiration:
  - Is anyone using SQLite on production? (either side project or business) - Reddit: [Click here](https://www.reddit.com/r/rails/comments/k4vlqo/is_anyone_using_sqlite_on_production_either_side/)
  - How (and why) to run SQLite in production: [HackerNews](https://news.ycombinator.com/item?id=39835496)
- Docs of sqlite3 cli: https://www.sqlite.org/cli.html
- Sqlite features that aren't implemented in sqlite: https://www.sqlite.org/limits.html
  - ~quoting from above link: `Other kinds of ALTER TABLE operations such as ALTER COLUMN, ADD CONSTRAINT, and so forth are omitted.`~
  - Newer version of sqlite allows renaming column names and table names now: [Click here](https://chatgpt.com/c/687aa6ad-0658-8007-b701-e46b6b76db6a)
- SQL docs (w3school): https://www.w3schools.com/sql/default.asp

# Using database files and running commands via .sql files

```sh
# Run a sql file against a db file (Db file will be created if not present)
sqlite3 db.sqlite < 1.createUserTable.sql

# Using a db file via SQLite CLI for querying and managing the database
sqlite3 db.sqlite
```

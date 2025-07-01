# Readme

**Quick Links:**
- My Notes:
  - Setup of PostgreSQL on Archlinux: [Click here](./Notes_setup-postgres.md)
  - Installing pgadmin4 via pip - Archlinux: [Click here](./Notes_pgadmin4_install.md)
  - 🚀 `sequelize-with-flash-runner-cli`: [Click here](https://github.com/sahilrajput03/learning_sql/blob/main/sequelize-with-flash-runner-cli/src/test1.test.js)
- **Course Notes**
  - ❤️ W3school Notes: [Click here](./Notes_sql_w3schools.md)
  - ❤️ Sql bolt Notes: [Click here](./Notes_sql_bolt.md)
  - ❤️ SQLite CLI Notes: [Click here](./sequelize-with-sqlite//sqlQueries/README.md)
- **Sequelize Docs**
  - Sequelize Basics: [Click here](https://sequelize.org/docs/v6/core-concepts/model-querying-basics/)
  - Sequelize Sub Queries: [Click here](https://sequelize.org/docs/v6/other-topics/sub-queries/)
  - Sequelize Cli: [Click here](https://sequelize.org/docs/v6/other-topics/migrations/)
- **Sqlite:**
  - [Docs](https://www.sqlite.org/index.html), [Connect to nodejs](https://www.sqlitetutorial.net/sqlite-nodejs/connect/)
  - Most of sql command of sql are implemented in sql except [few](https://sqlite.org/omitted.html).
  - _Npm packages_: `sequelize` ([docs](https://sequelize.org/master/)) and `sqlite3`.
  - _Tip_: You can install vscode extension: `alexcvzz.vscode-sqlite`
  - _Tip_: Also install linux tool for viewing the sqlite database file as well - [Installation guide](https://github.com/sahilrajput03/sahilrajput03/blob/master/arch-notes.md#insatlled-sqliteman)
  - https://www.sqlitetutorial.net/sqlite-nodejs/, Other: [Google search Sqlite with node](https://www.google.com/search?q=sqllite+with+node&rlz=1C1CHBD_enIN917IN917&oq=sqllite+with+node&aqs=chrome..69i57j0i13i457j0i13j0i10i22i30j0i22i30l4.2738j0j1&sourceid=chrome&ie=UTF-8)
  - Software to manage sqlite db files: https://sqlitebrowser.org/
  (Another alternate for inmemory db would be simply using node's file api to write and read from a .json file and store in object form in it, yikes!!!)

# Pictorial Memories:

- Fixed server requires ssl errror:

![image](https://user-images.githubusercontent.com/31458531/185803197-fc8dda43-9231-4e97-87a2-c15c5fee657d.png)

- **Many to many relationship:**

![image](https://user-images.githubusercontent.com/31458531/175762567-9d0cd2e4-9f92-4d50-a9b1-3843c079feec.png)

![image](https://user-images.githubusercontent.com/31458531/175763138-fe9a7e5e-78d4-44c5-85c3-1068a5caf1fb.png)

![image](https://user-images.githubusercontent.com/31458531/175762818-5d6b9cbf-3325-4128-8e1a-419ed7e9b82b.png)

## Older notes from `learning-postgres-sequelize` repo

**TODO:** Continue reading docs @ https://sequelize.org/master/manual/model-querying-basics.html#shorthand-syntax-for--code-op-in--code-

**Install setup**

```bash
#installs sequelize
yarn add sequelize

#installs postgres drivers
yarn add pg pg-hstore
```

**Learning postgres via sequelize**

1. model is an abstraction that represents a table
2. models have singular names (such as User) while tables have pluralized names (such as Users)
3. Note, from the usage of await in the snippet above, that save is an asynchronous method. In fact, almost every Sequelize method is asynchronous; build is one of the very few exceptions.
4. Data types: https://sequelize.org/master/manual/model-basics.html#data-types
5. Created user and db with name chetan, and assign owner of chetan db as chetan user. Also, set chetan user's password as `66p`.
6. set alias for psql as winpty psql in fishbashrc file. Yikes!
7. Read about operators: https://sequelize.org/master/manual/model-querying-basics.html#operators
8. Configure schemas from pgadmin via - mydb_test > Schemas > public > Tables > myTable > Columns. Yikes!

**Details for postgres (Windows Only - IMO)**

- Directory set for storing data: `C:\Program Files\PostgreSQL\13\data`
- Password for database superuser(user: postgres, pass: postgresp):
- Password for database superuser(user: chetan, pass: 66p):
- Also, assigned all privilidges to user chetan too, i.e., right click user in pgadmin4, and click on Privilidges tab, and gave all rights to it.
- Port in use: 5432
- Locale: English, India

- Apache port for PERM_HTTPD: 8083 (didn't work this shit though.)
- Installed `pgAdmin` for postgres too.
- `Postgres` master password: `postgresp`
- Browse `pgamin`: visit http://127.0.0.1:51022/browser/

**Changing postgres port**

https://dba.stackexchange.com/questions/41458/changing-postgresql-port-using-command-line

**Amazing deno with postgresqp and deno crash course:**

- [Deno & PostgreSQL (Crash Course Part 2)](https://www.youtube.com/watch?v=KuaI6mphFNc)
- [Deno Crash Course](https://www.youtube.com/watch?v=NHHhiqwcfRM&t=1958s)

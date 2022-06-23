# Readme - FSO Part 13

- You can define define foreign key to be UUID instead as well. Src: https://sequelize.org/docs/v6/core-concepts/assocs/#customizing-the-foreign-key

Source: wikipedia

In systems analysis, **one-to-one relationship** is a type of cardinality that refers to the relationship between two entities (see also entity–relationship model) A and B in which one element of A may only be linked to one element of B, and vice versa.

In systems analysis, a **one-to-many relationship** is a type of cardinality that refers to the relationship between two entities (see also entity–relationship model) A and B in which an element of A may be linked to many elements of B, but a member of B is linked to only one element of A.

In systems analysis, a **many-to-many relationship** is a type of cardinality that refers to the relationship between two entities,[1] say, A and B, where A may contain a parent instance for which there are many children in B and vice versa.

**What is foreign key?**

A FOREIGN KEY is a field (or collection of fields) in one table, that refers to the PRIMARY KEY in another table. Src: https://www.w3schools.com/sql/sql_foreignkey.asp

```bash
## CREATING TABLES (not possible with sequelize way IMO~Sahil) ##

# PRO WAY
# Both of below command works good, TESTED: 23 Jun, 2022 ~ Sahil (FYI: Single quotes around `myDb1_test` doesn't work.)
psql -U postgres -c 'DROP DATABASE IF EXISTS "myDb1_test";'
psql -U postgres -c 'DROP DATABASE IF EXISTS "myDb1_test";' -c 'CREATE DATABASE "myDb1_test";'

# Older Manual Way:
psql -U postgres
DROP DATABASE IF EXISTS "myDb1_test";
CREATE DATABASE "myDb1_test";
exit

## FYI: To view database list use below command:
\l
# Connect to db, src: https://stackoverflow.com/a/69962528/10012446
\c db_name_here
# Show relations in connected database
\d
# Exit
\q
```

```js
// Finding terminal sequelize errors made easy:
// 1. Search for `parent:`
// 2. Search for `original:`
```

```js
Note.sync() // create table if not already exist
Note.sync({alter: true}) // create table and fix the table according to the schema we have defined in current code base
Note.sync({force: true}) // delete and recreate the table
// src: https://sequelize.org/docs/v6/core-concepts/model-basics/#model-synchronization
```

**Note: This file in specific to FSO's content only, for sequelize's refer `README-sequelize.md` file.**

## Heroku LEARNINGS

```bash
# App: peaceful-spire-57108
# DB addon: postgresql-regular-28775
# Heroku Cred: sahilrajputb****i@gmail.com:`*h*****@***`
```

- TODO: Add heroku command to heroku gist as well.

## PSQL LEARNINGS

```bash
help        # for overalll help guide
\copyright  # for distribution terms
\h          # for help with SQL commands
\?          # for help with psql commands
\g          # or terminate with semicolon to execute query
\q          # to quit
\d          # Shows all tables (relations) in the database
\d notes;   # Shows the records of `notes` table.
\watch [SEC]# execute query every SEC seconds
show port;  # shows the port number of the database
show listen_addresses; #show the addresses from which the service is accessible. src: https://serverfault.com/a/573327
```

- FYI: The column id has a default value, which is obtained by calling the internal function of Postgres nextval.

```sql
---Creating table:
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    content text NOT NULL,
    important boolean,
    date time
);
---Fetching all records from table notes:
select * from notes;
---The semicolon in the end is important in SQL.
```

- Creating a notes table having notes colmn with array type:
  CREATE TABLE notes (
  notes TEXT [] NOT NULL
  );

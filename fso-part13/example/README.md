# Readme - FSO Part 13

- You can define define foreign key to be UUID instead as well. Src: https://sequelize.org/docs/v6/core-concepts/assocs/#customizing-the-foreign-key

Source: wikipedia

In systems analysis, **one-to-one relationship** is a type of cardinality that refers to the relationship between two entities (see also entity–relationship model) A and B in which one element of A may only be linked to one element of B, and vice versa.

In systems analysis, a **one-to-many relationship** is a type of cardinality that refers to the relationship between two entities (see also entity–relationship model) A and B in which an element of A may be linked to many elements of B, but a member of B is linked to only one element of A.

In systems analysis, a **many-to-many relationship** is a type of cardinality that refers to the relationship between two entities,[1] say, A and B, where A may contain a parent instance for which there are many children in B and vice versa.

**What is foreign key?**

A FOREIGN KEY is a field (or collection of fields) in one table, that refers to the PRIMARY KEY in another table. Src: https://www.w3schools.com/sql/sql_foreignkey.asp

```bash
# Login to psql
psql -U postgres -d myDb1_test

## CREATING TABLES (not possible with sequelize way IMO~Sahil) ##

# PRO WAY
# ~ Sahil (In below commands, using double quotes around case-sensitive database names IS NECESSARY(single quotes does not work) and escaping double quotes around `myDb1_test` is necesssary bcoz we are using double quotes to pass values as a single string to psql's -u option.)
# Drop table
psql -U postgres -c "DROP DATABASE IF EXISTS \"myDb1_test\";"
# Drop table and recreate
psql -U postgres -c "DROP DATABASE IF EXISTS \"myDb1_test\";" -c "CREATE DATABASE \"myDb1_test\";"

# ::NEVER DROP THE MIGRATIONS TABLE AGAIN UNLESS YOU HAVE DELETE ALL THE TABLES AS WELL:: Dropping `migrations` table from myDb1_test table (TESTED), learn: -d option is to select a table
psql -U postgres -d myDb1_test -c "DROP TABLE migrations;"


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
# Show relations in particular table in the connected database
\d table_name
# Exit
\q
```

## Input sample values to teams table

```sql
insert into teams (name) values ('toska');
insert into teams (name) values ('mosa climbers');
insert into memberships (user_id, team_id) values (1, 1);
insert into memberships (user_id, team_id) values (1, 2);
insert into memberships (user_id, team_id) values (2, 1);
insert into memberships (user_id, team_id) values (3, 2);
```

## Delete the `migrations` table and now migrations are not struck?

This could be the case when you accidentally delete the migrations table, and now when the migrations code is run on the server start server throws errors i.e., tables already exists and its bcoz sequelize is tryting to recreate tables from start which is obviously gonna throw error.

So how do you fix that?

Simlly add below rows to the `migrations` tables manually via `psql` via:

```sql
-- comments in sql
-- Drop table (for mimication of accidental deletion of table)
DROP TABLE migrations;
-- MODERN WAY
psql -U postgres -d myDb1_test -c "DROP TABLE migrations;"


-- MODERN WAY
psql -U postgres -d myDb1_test -c "CREATE TABLE migrations (name TEXT NOT NULL)" -c "INSERT INTO migrations (name) VALUES ('20211209_00_initialize_notes_and_users.js');" -c "INSERT INTO migrations (name) VALUES ('20211209_01_admin_and_disabled_to_users.js');" -c "INSERT INTO migrations (name) VALUES ('20211209_02_team_support.js');"
-- Verify:
psql -U postgres -d myDb1_test -c "select * from migrations;"
-- OLD SQL SUBSHELL WAY
psql -U postgres -d myDb1_test
-- Create table
CREATE TABLE migrations (name TEXT NOT NULL);
INSERT INTO migrations (name) VALUES ('20211209_00_initialize_notes_and_users.js');
INSERT INTO migrations (name) VALUES ('20211209_01_admin_and_disabled_to_users.js');
INSERT INTO migrations (name) VALUES ('20211209_02_team_support.js');
-- Learn: using single quotes with value's value is necessary else psql throws error that column doesn't exist.

# Verify
select * from migrations;
```

```txt
myDb1_test=# \d migrations
                    Table "public.migrations"
 Column |          Type          | Collation | Nullable | Default
--------+------------------------+-----------+----------+---------
 name   | character varying(255) |           | not null |
Indexes:
    "migrations_pkey" PRIMARY KEY, btree (name)

myDb1_test=# select * from migrations ;
                    name
--------------------------------------------
 20211209_00_initialize_notes_and_users.js
 20211209_01_admin_and_disabled_to_users.js
 20211209_02_team_support.js
(3 rows)
```

## Sample output of relations of a table

```txt
psql -U postgres

# Select database
\c myDb1_test

# Show relations of users table
\d users
# :: OUTPUT ::
                                     Table "public.users"
  Column  |          Type          | Collation | Nullable |              Default
----------+------------------------+-----------+----------+-----------------------------------
 id       | integer                |           | not null | nextval('users_id_seq'::regclass)
 username | character varying(255) |           | not null |
 name     | character varying(255) |           | not null |
 admin    | boolean                |           |          | false
 disabled | boolean                |           |          | false
Indexes:
    "users_pkey" PRIMARY KEY, btree (id)
    "users_username_key" UNIQUE CONSTRAINT, btree (username)
Referenced by:
    TABLE "notes" CONSTRAINT "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL
```

## Confused on large sized errors from sequelize ?

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

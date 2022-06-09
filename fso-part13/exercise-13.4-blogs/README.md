# Readme - FSO Part 13

**Note: This file in specific to FSO's content only, for sequelize's refer `README-sequelize.md` file.**

```bash
psql -U postgres
DROP DATABASE IF EXISTS "myDb1_blogs_test";
CREATE DATABASE "myDb1_blogs_test";
exit
```

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

# Readme - FSO Part 13

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

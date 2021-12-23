# Readme - FSO Part 13

## Heroku:

```bash
# App: peaceful-spire-57108
# DB addon: postgresql-regular-28775
# Heroku Cred: sahilrajputb****i@gmail.com:`*h*****@***`
```

## Notes

- **Learning SQL**- [Here](https://github.com/sahilrajput03/learning_sql)

- **W3schools Notes** - [Here](https://github.com/sahilrajput03/learning_sql/blob/main/W3schools.md)

- **psql learnings** -

help for overalll help guide

You are using psql, the command-line interface to PostgreSQL.
Type:
\copyright for distribution terms
\h for help with SQL commands
\? for help with psql commands
\g or terminate with semicolon to execute query
\q to quit

\watch [SEC]: execute query every SEC seconds

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

```bash
# Shows all tables (relations) in the database
\d

# Shows the records of `notes` table.
\d notes;

# FYI: The column id has a default value, which is obtained by calling the internal function of Postgres nextval.

```

## Setting postgres - I AM USING ARCHOS

[Docs @ Archlinux](https://wiki.archlinux.org/title/PostgreSQL)

```
# src: https://wiki.archlinux.org/title/PostgreSQL
sudo pacman -S postgresql
# It will also create a system user called postgres. src: https://wiki.archlinux.org/title/PostgreSQL


# To check the version.
postgresql --version

# Enable postgresql to be run on system boot as well.
sudo systemctl enable postgresql

# CHANGE USER TO POSTGRES: THIS WAY WE CAN EXECUTE COMMANDS AS POSTGRES USER
sudo -iu postgres

# Initializing database cluster in /var/lib/postgresql/data directory.
initdb -D /var/lib/postgres/data    # SHOULD BE RUN AS POSTGRES USER.

# Give permission to /run/postgresql directory to the postgres user.
# Src: https://stackoverflow.com/a/23645981/10012446
mkdir /run/postgresql
sudo chown -R postgres:postgres /run/postgresql

pg_ctl -D /var/lib/postgres/data -l logfile start
# If you face any error in starting postgres server with above command then you can look for the contents of logfile via `cat logfile` which is created in your cwd.
# IMPORTANT: ^ That worked for me only after creating directory /run/postgresql and assigning it user postgres and group postgres.

# CREATING USER
createuser --interactive
# Use role as your own username i.e., array for ease of use and that means user array would have access to it.

# CREATING DATABASE
createdb myDb1

# Now you can access this db via psql.
psql -d myDb1                                       # Connect to db with this now.

# You can use below command to play with postgresql service.
systemctl start postgresql
systemctl status postgresql
systemctl enable postgresql
```

### From offical postgres docs:

Starting postgres server using some other data by providing some directory path.
src: https://www.postgresql.org/docs/9.1/server-start.html

## TODO:

- Add heroku command to heroku gist as well.

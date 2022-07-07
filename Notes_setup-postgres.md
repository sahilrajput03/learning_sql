## Common issue i faced so far??

A similar guide by [superjojo140](https://gist.github.com/superjojo140/2a0221d517f356965371b3969f37b29f)

```bash
# An old version of the database format was found.
# ^^^ this error log from `systemctl status postgresql`
## Solution: I needed to reinitialize all the databases using some help from below way like the way I created db in the first place.
## Cause of above issue: I postgres was updated with system updgrade. ~ 15 May, 2022.
## Source of answer: https://webhostinggeeks.com/howto/how-to-fix-an-old-version-of-the-database-format-was-found-while-starting-postgresql/
```

## Setting postgres - I AM USING ARCHOS

[Docs @ Archlinux](https://wiki.archlinux.org/title/PostgreSQL)

```bash
# src: https://wiki.archlinux.org/title/PostgreSQL
sudo pacman -S postgresql
# It will also create a system user called postgres. src: https://wiki.archlinux.org/title/PostgreSQL

# To check the version.
postgresql --version

# Enable postgresql to be run on system boot as well.
sudo systemctl enable postgresql

# SWITCH TO postgres USER: THIS WAY WE CAN EXECUTE COMMANDS AS POSTGRES USER
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
# FYI: When creating a user you must also create a db with the name of user as well. Since using psql with any user try to use the same database name as well so having a database same as the username helps a bit while using psql when you don't specify a database with psql cli.

# CREATING DATABASE
createdb my_db1

# CONNECT TO my_db1 VIA PSQL
psql -d my_db1

# LOGIN WITH POSTGRES USER
psql -U postgres
# or you can use
sudo -u postgres psql


# You can use below command to play with postgresql service.
systemctl start postgresql
systemctl status postgresql
systemctl enable postgresql
```

### From offical postgres docs:

Starting postgres server using some other data by providing some directory path.
src: https://www.postgresql.org/docs/9.1/server-start.html

### psql subshell commands

Source: https://chartio.com/resources/tutorials/how-to-list-databases-and-tables-in-postgresql-using-psql/

```bash
# Show/List tables
\l
# \l is alias for \list ; FYI: This will show you the owner of each table as well.

# Switch/change database
\c
# \c is alias for \change ; FYI: To get suggestions you can use: \c <TAB><TAB>

# show relations
\dt

# Create database
CREATE DATABASE "db_pikachu";
# Quotes helps in createing case-senstive database, yes its for real ~Sahil

# Change owner of a database ; Learn: You must connect as the current table owner, not the user you wish to change the table ownership to. Src: https://stackoverflow.com/a/31869945/10012446
ALTER DATABASE db_pikachu OWNER TO "array";
# LEARN: The quotes around user name is necessary.

# Delete a database
DROP DATABASE IF EXISTS "db_pikachu";
# Learn: Quotes around db name are necessary!
```

## From cli - heaven is here.. ~ Sahil

```bash
# cli
# Create database
psql -U postgres -c "CREATE DATABASE db_pikachu ENCODING='UTF8'"

# Change owner of a database
psql -U postgres -c 'ALTER DATABASE db_pikachu OWNER TO "array"'
# LEARN: The quotes around user name is necessary.

# Drop database
psql -U postgres -c "DROP DATABASE db_pikachu"
```

# Other necessary things to do

1. Set password for `postgres` user

Date: 7 July, 2022.

I set password for postgres user via:

```bash
psql -U postgres
\password

# And set password to `secret`.

# I created this password to be able to connect via hasura.

# Src: Official Docs; https://www.postgresql.org/docs/current/auth-password.html

# LEARN: PostgreSQL database passwords are separate from operating system user passwords. The password for each database user is stored in the pg_authid system catalog. Passwords can be managed with the SQL commands CREATE ROLE and ALTER ROLE, e.g., CREATE ROLE foo WITH LOGIN PASSWORD 'secret', or the psql command \password. If no password has been set up for a user, the stored password is null and password authentication will always fail for that user.
```

2. Enable incoming connection requests in `/var/lib/postgres/data/postgresql.conf`

```bash
psql -h 192.168.18.3 -p 5432 -d myDb1_test -U postgres
# Output: psql: error: connection to server at "192.168.18.3", port 5432 failed: Connection refused
        # Is the server running on that host and accepting TCP/IP connections?

######
# source: https://stackoverflow.com/a/32844024/10012446
# WHAT YOU HAVE TO DO ??? Ans. So to fix that you need set listen_addresses='*' in `/var/lib/postgres/data/postgresql.conf` to allow for incoming connections from any ip / all ip.
######

# FYI(**BE MODERN**): IF YOU DON"T WANT TO LOGIN AS postgres user, you may do like:
sudo nvim /var/lib/postgres/data/postgresql.conf

# OLD WAY:
# Login as postgres user
sudo su postgres
cd /var/lib/postgres/data/
# Edit this file
vim postgresql.conf

# Restart the database (~imo this can be optional ~Sahil)
sudo systemctl restart postgresql.service

##### Trying again now:
psql -h 192.168.18.3 -p 5432 -d myDb1_test -U postgres
# Output: psql: error: connection to server at "192.168.18.3", port 5432 failed: FATAL:  no pg_hba.conf entry for host "192.168.18.3", user "postgres", database "myDb1_test", no encryption
# OBSERVATION: We fixed the initial error but there is this new error now.., so follow point 3 below to know how to fix that -

#? fyi: below works though (coz we have appropriate subnet)
psql -h 127.0.0.1 -p 5432 -d myDb1_test -U postgres

# OBSERVATION: BUT HOW DO WE FIX ACCESS FOR GLOBAL ACCESS? Ans. Follow below guide:
```

3. Fixing **ip subnet mask filter** in `/var/lib/postgres/data/pg_hba.conf`

```bash

######
# AS YOU CAN SEE WE NOW instead of above "connection refused" error, we get error as: `FATAL:  no pg_hba.conf entry for host "192.168.18.3"`.
# source: https://stackoverflow.com/a/34577754/10012446
# How do I fix ^^ this error ??? Ans. You need to change this line (in file: `/var/lib/postgres/data/pg_hba.conf`):
host    all        all         192.168.0.1/32        trust # ~original entry ~Sahil
# to this:
host    all        all         all                   md5
######

sudo nvim /var/lib/postgres/data/pg_hba.conf

# Now:
psql -h 192.168.18.3 -p 5432 -d myDb1_test -U postgres
# FYI: My password is `secret`
# works good! yo!!
### FYI: Now accessing throught pubic ip works as well now, yo!!
psql -h 27.255.179.204 -p 5432 -d myDb1_test -U postgres
```

## Hasura: Connecting db

Make sure you have done: (Below 1, 2 and 3 points referes to points above i.e, in above **Other necessary things to do** seciton, yo!!)

1. Set password for postgres user via psql
2. https://stackoverflow.com/a/32844024/10012446
3. https://stackoverflow.com/a/34577754/10012446

Now you can go to: `http://localhost:8080/console/` > Data > Connect to existing table and use below values to connect your table:

- Database Display Name: `myDb1_test`
- Database URL: `postgresql://postgres:secret@192.168.18.3:5432/myDb1_test`

_Note I have set password for `postgres` user as `secret` and I am connection to db `myDb1_test`_

FYI: Original problem with docker setup with hasura: [Official Github issue](https://github.com/hasura/graphql-engine/issues/4498).

## Other good seeming link:

- [article - click here](https://chartio.com/resources/tutorials/how-to-set-the-default-user-password-in-postgresql/#:~:text=For%20most%20systems%2C%20the%20default,connect%20as%20the%20postgres%20user.&text=If%20you%20successfully%20connected%20and,the%20Changing%20the%20Password%20section.)
- [Stackoverflow answer](https://stackoverflow.com/a/15008311/10012446)

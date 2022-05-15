## Common issue i faced so far??

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
CREATE DATABASE db_pikachu;

# Change owner of a database ; Learn: You must connect as the current table owner, not the user you wish to change the table ownership to. Src: https://stackoverflow.com/a/31869945/10012446
ALTER DATABASE db_pikachu OWNER TO "array";
# LEARN: The quotes around user name is necessary.

# Delete a database
DROP DATABASE IF EXISTS db_pikachu;
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

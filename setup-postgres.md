I'm officiall maintaing all this info in fso's part 13's solution repo.

## Setting postgres - I AM USING ARCHOS

[Docs @ Archlinux](https://wiki.archlinux.org/title/PostgreSQL)

```
# src: https://wiki.archlinux.org/title/PostgreSQL
sudo pacman -S postgresql

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

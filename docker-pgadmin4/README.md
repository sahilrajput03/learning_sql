Source: https://bbs.archlinux.org/viewtopic.php?id=266423

NOTE: I set pgadmin4's password as same as my user password.

NOTE

1. First (for once) you need to add entries to two files:

`Use sudo -iu postgres` commad to edit files

```bash
# file: /var/lib/postgres/data/pg_hba.conf
host all all 0.0.0.0/0 md5

# file: /var/lib/postgres/data/postgresql.conf
listen_addresses='*'
```

Src: https://dba.stackexchange.com/a/105887

Official postgres docs for hba_conf file: https://www.postgresql.org/docs/9.1/auth-pg-hba-conf.html

2. The target user in postgres must have a password so you can do it by connecting to the database via psql and set a password like:

```
\password <user>
```

3. Use below settings with pgadmin4 to connect to your postgresserver:

```
Host: 192.168.18.3
Port: 5432
Maintainance db: postgres
Username: array
Passowrd: <useYourPassword>
Role: array
```

```bash
# Use command to run it in detached mode:
docker-compose up -d
# Now go to `localhost:9201` to access it from browser.

# Execute below command to turn down the docker:
docker-compose down

# To check if pgadmin4 is running:
docker ps -a
```

My personal docker notes: https://gist.github.com/sahilrajput03/1d8116364ac51810b3c54a9a6788be65

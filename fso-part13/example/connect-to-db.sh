#!/bin/bash
# * Also you should run this file via: `. connect-to-db` or `source connect-to-db.sh` coz  we haven't used export to export variables to the child shell.
. .env                                       # Importing variables
heroku run psql $db_connect_string -a $app   # Connecting to the database

# Below works equally good.
# heroku run PGPASSWORD=$db_pass psql -h $db_host -p 5432 -U $db_user $db_name -a $app

# WAYS TO AUTHENTICATED POSTGRES(AMAZING): https://stackoverflow.com/a/6524167/10012446
# install pgadmin to archlinux

Why install `pgadmin4` via `pip`?

Ans. Bcoz [arch package](https://archlinux.org/packages/community/x86_64/pgadmin4/) doesn't work at all.

Source: [Reddit Answer](https://www.reddit.com/r/PostgreSQL/comments/nf9i0y/comment/hidkmco/?utm_source=share&utm_medium=web2x&context=3)

```bash
sudo mkdir /var/lib/pgadmin
sudo mkdir /var/log/pgadmin
sudo chown $USER /var/lib/pgadmin
sudo chown $USER /var/log/pgadmin

# run the above and after that create a virtual environment with python3 and inside that environment just do:
pip install pgadmin4 gevent
# then just type below command and u will get a link to run the pgadmin4 in ur browser
pgadmin4 
# and use some credentials like:
email: sahilrajput03@gmail.com
password: password

# Now you can browse @ `localhost:5050` to browse the `pgadmin4`, yikes!!

# ~Sahil, If you messed up your above login credentials, you can reset the login credentials like that:
rm /var/lib/pgadmin/pgadmin4.db
# src: https://stackoverflow.com/a/58497861/10012446
```

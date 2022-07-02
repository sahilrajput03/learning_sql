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

## IN FUTURE YOU CAN RUN pgadmin4 VIA:
pgadmin4
```

## Configuring pgadmin to connect to local postgresql

![image](https://user-images.githubusercontent.com/31458531/176994040-b59dac6c-3392-4794-b68b-c2f98d85c28f.png)

## View data in a table in pgadmin

![image](https://user-images.githubusercontent.com/31458531/176994861-c2934f9c-9922-4c00-9ce4-5186c1ce7ff4.png)

## Modify and save values to a table

![image](https://user-images.githubusercontent.com/31458531/176998064-0462a313-81ef-494c-829f-276df9a7247c.png)

## Add a columnt to existing table

![image](https://user-images.githubusercontent.com/31458531/176997978-1c3b6154-40ff-4d08-a768-550752b711ab.png)

For making a string column field you can select `Data type` as `text`.

![image](https://user-images.githubusercontent.com/31458531/176998317-79766122-ea0a-4dc2-8696-8ad8aaf32aa1.png)

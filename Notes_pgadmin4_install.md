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

# if pgadmin asks you password for postgres user, you can enter `postgres` as password as well.

# ~Sahil, If you messed up your above login credentials, you can reset the login credentials like that:
rm /var/lib/pgadmin/pgadmin4.db
# src: https://stackoverflow.com/a/58497861/10012446

## IN FUTURE YOU CAN RUN pgadmin4 VIA:
pgadmin4
```

## Queries syntax examples

```sql
SELECT *
FROM BLOGS
WHERE ID = 21

SELECT author
FROM BLOGS
WHERE ID = 21

SELECT ID,
	AUTHOR
FROM BLOGS
WHERE ID = 21


SELECT *
FROM BLOGS
WHERE YEAR = 2342

SELECT *
FROM BLOGS
WHERE AUTHOR LIKE 'rohan'

--- Learn you have to use single quotes only (double quotes throw error like column ee doesn't exist)
SELECT *
FROM BLOGS
WHERE TITLE LIKE 'ee'

INSERT INTO BLOGS (AUTHOR,
														URL,
														TITLE,
														LIKES,
														YEAR,
														USER_ID,
														"className",
														CREATED_AT,
														UPDATED_AT)
VALUES ('varun', 'https://www.buildonscenes.com/', '10 life lessons', 1221, 2021, 1, 'upper-class', '2022-07-01 22:44:50.129+05:30', '2022-07-01 22:44:50.129+05:30');

SELECT *
FROM BLOGS
WHERE ID != 3 --- Notice the != sign in the query.
```

## Configuring pgadmin to connect to local postgresql

![image](https://user-images.githubusercontent.com/31458531/176994040-b59dac6c-3392-4794-b68b-c2f98d85c28f.png)

- View data in a table in pgadmin:

![image](https://user-images.githubusercontent.com/31458531/176994861-c2934f9c-9922-4c00-9ce4-5186c1ce7ff4.png)

- Modify and save values to a table:

![image](https://user-images.githubusercontent.com/31458531/176998064-0462a313-81ef-494c-829f-276df9a7247c.png)

- Add a columnt to existing table:

![image](https://user-images.githubusercontent.com/31458531/176997978-1c3b6154-40ff-4d08-a768-550752b711ab.png)

- For making a string column field you can select `Data type` as `text`:

![image](https://user-images.githubusercontent.com/31458531/176998317-79766122-ea0a-4dc2-8696-8ad8aaf32aa1.png)

- After adding the table you need to refresh the columns table to see your newly created column:

![image](https://user-images.githubusercontent.com/31458531/176999007-284da171-c137-4c66-acf9-883028f7183c.png)

- We can import/export data into/from the table via this:

![image](https://user-images.githubusercontent.com/31458531/176998566-a0d34b38-440c-41ca-8206-af5473d3a347.png)

- Adding a new row to the table:

![image](https://user-images.githubusercontent.com/31458531/176998765-f27985b0-8559-4611-8caa-20642031e23e.png)

- While adding a new row you can skip `id` field as you can see below in grey text `default` is written in the placeholder that means the autoincrement value for the id field will take place:

![image](https://user-images.githubusercontent.com/31458531/176998938-42641863-49f7-489a-9a15-17fca371e540.png)

- On editing or saving a new row you see a message: 

![image](https://user-images.githubusercontent.com/31458531/177031075-52d6d5ba-1a37-443f-84c1-087a3bbb284c.png)

- Opening **Query Tool** executing a query:

![image](https://user-images.githubusercontent.com/31458531/177031196-3087cd4e-2b21-4502-9c41-2db75a8a0f0f.png)

- Prettify your query with `ctrl+shift+k` or by clicking that button:

![image](https://user-images.githubusercontent.com/31458531/177031327-a25a183c-5bee-4338-be77-b676cdb7de7e.png)


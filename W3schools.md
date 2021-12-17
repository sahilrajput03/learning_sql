Call it sequel. Its cool.

https://www.w3schools.com/sql/exercise.asp?filename=exercise_where1

• Where is amazing => https://www.w3schools.com/sql/sql_where.asp

* rows = records in sql

Read about case-insensitivity for postgres in its documentation @ https://www.postgresql.org/docs/current/sql-syntax-lexical.html#SQL-SYNTAX-IDENTIFIERS.

* Sql comments - https://www.w3schools.com/sql/sql_comments.asp
TIP1: 
```
SELECT COUNT(CustomerID), Country
FROM Customers
GROUP BY Country--also-a-valid-comment;
```
TIP2:
```
SELECT COUNT(CustomerID), Country
FROM Customers--also-a-valid-comment
GROUP BY Country;
```
TIP3:
```
SELECT COUNT(CustomerID), Country
FROM Customers
GROUP BY Country;--NOT-a-valid-comment-IDK-WHYYY
```

TIP4(for statements using `groupby`) - https://www.w3schools.com/sql/sql_groupby.asp

```
SQL keywords are NOT case sensitive: select is the same as SELECT

Some of The Most Important SQL Commands
SELECT - extracts data from a database
UPDATE - updates data in a database
DELETE - deletes data from a database
INSERT INTO - inserts new data into a database
CREATE DATABASE - creates a new database
ALTER DATABASE - modifies a database
CREATE TABLE - creates a new table
ALTER TABLE - modifies a table
DROP TABLE - deletes a table
CREATE INDEX - creates an index (search key)
DROP INDEX - deletes an index

- Selects all columns from Cutomers table.
SELECT * FROM Customers

- Select all the different values from the Country column in the Customers table.
SELECT DISTINCT Country FROM Customers;

- Select all records where the City column has the value "Berlin".
SELECT * FROM Customers
WHERE City = 'Berlin';

- Use the NOT keyword to select all records where City is NOT "Berlin".
SELECT * FROM Customers
WHERE NOT City = 'Berlin';

- Select all records where the CustomerID column has the value 32.
SELECT * FROM Customers WHERE CustomerID = 32;

- Select all records where the City column has the value 'Berlin' and the PostalCode column has the value 12209.
SELECT * FROM Customers 
WHERE City = 'Berlin'
AND PostalCode = 12209;

- Select all records where the City column has the value 'Berlin' or 'London'.
SELECT * FROM Customers
 WHERE City = 'Berlin'
 OR City = 'London';

-Select all records from the Customers table, sort the result alphabetically by the column City.
SELECT * FROM Customers
ORDER BY City;

--learn: The ORDER BY keyword sorts the records in ascending order by default. To sort the records in descending order, use the DESC keyword.

- Select all records from the Customers table, sort the result reversed alphabetically by the column City.
SELECT * FROM Customers
ORDER BY City DESC;

- Select all records from the Customers table, sort the result alphabetically, first by the column Country, then, by the column City.
SELECT * FROM Customers
ORDER BY Country, City;
--ORDER BY Several Columns Example--
The following SQL statement selects all customers from the "Customers" table, sorted by the "Country" and the "CustomerName" column. This means that it orders by Country, but if some rows have the same Country, it orders them by CustomerName.
```
src:: https://www.w3schools.com/sql/sql_orderby.asp

```
- The following SQL statement selects all customers from the "Customers" table, sorted ascending by the "Country" and descending by the "CustomerName" column:
SELECT * FROM Customers
ORDER BY Country ASC, CustomerName DESC;

--random-text--**Did you notice that we did not insert any number into the CustomerID field?
The CustomerID column is an auto-increment field and will be generated automatically when a new record is inserted into the table.
- AUTO INCREMENT Field
Auto-increment allows a unique number to be generated automatically when a new record is inserted into a table.

Often this is the primary key field that we would like to be created automatically every time a new record is inserted.
```
src:: https://www.w3schools.com/sql/sql_autoincrement.asp

```
- Insert a new record in the Customers table.
INSERT INTO Customers ( CustomerName, Address, City, PostalCode, Country)
VALUES ('Hekkan Burger', 'Gateveien 15', 'Sandnes', '4306', 'Norway'); 
```
https://www.w3schools.com/sql/sql_insert.asp
```
Select all records from the Customers where the PostalCode column is empty.
SELECT * FROM Customers
WHERE PostalCode IS NULL;

Select all records from the Customers where the PostalCode column is NOT empty.
SELECT * FROM Customers
WHERE PostalCode IS NOT NULL;

- The SQL UPDATE Statement
The UPDATE statement is used to modify the existing records in a table.

UPDATE Syntax
UPDATE table_name
SET column1 = value1, column2 = value2, ...
WHERE condition;
Note: Be careful when updating records in a table! Notice the WHERE clause in the UPDATE statement. The WHERE clause specifies which record(s) that should be updated. If you omit the WHERE clause, all records in the table will be updated!
```
https://www.w3schools.com/sql/sql_update.asp
```
- Update the City column of all records in the Customers table.
UPDATE Customers
SET City = 'Oslo';

- Set the value of the City columns to 'Oslo', but only the ones where the Country column has the value "Norway".
UPDATE Customers
SET City = 'Oslo'
WHERE Country = 'Norway';

- Update the City value and the Country value.
UPDATE Customers
SET City = 'Oslo',
Country = 'Norway'
WHERE CustomerID = 32;

- Delete all the records from the Customers table where the Country value is 'Norway'.
DELETE FROM Customers
WHERE Country = 'Norway';

- Delete all the records from the Customers table.
DELETE FROM Customers;

- The SQL MIN() and MAX() Functions
--The MIN() function returns the smallest value of the selected column.

--The MAX() function returns the largest value of the selected column.

• MIN() Syntax
SELECT MIN(column_name) FROM table_name
WHERE condition;

• MAX() Syntax
SELECT MAX(column_name) FROM table_name
WHERE condition;

>SELECT MIN(Price) FROM Products;
Output: 
MIN(Price)
2.5

>SELECT MIN(Price) AS SmallestPrice FROM Products;
Output:
SmallestPrice
2.5


- Use an SQL function to select the record with the highest value of the Price column.
SELECT MAX(Price) FROM Products;

- Use the correct function to return the number of records that have the Price value set to 18.
--my-info-tags=> `count`, `avg`, `sum`, `total`, `sum`, `all`, `find`.
SELECT  COUNT(*) FROM Products WHERE Price = 18;

- Use an SQL function to calculate the average price of all products.
SELECT AVG(Price) FROM Products;

- Use an SQL function to calculate the sum of all the Price column values in the Products table.
SELECT SUM(Price) FROM Products;

- Select all records where the value of the City column starts with the letter "a".
SELECT * FROM Customers
WHERE City LIKE 'a%';

- Select all records where the value of the City column does NOT start with the letter "a".
SELECT * FROM Customers
WHERE City NOT LIKE 'a%';

- Select all records where the value of the City column ends with the letter "a".
SELECT * FROM Customers
WHERE City LIKE '%a';

- Select all records where the value of the City column contains the letter "a".
SELECT * FROM Customers
WHERE City LIKE '%a%';

- Select all records where the value of the City column starts with letter "a" and ends with the letter "b".
SELECT * FROM Customers
WHERE City LIKE 'a%b';

- Select all records where the value of the City column starts with letter "a" and ends with the letter "b".
SELECT * FROM Customers
WHERE City LIKE 'a%b';


--sql wildcards below
- Select all records where the second letter of the City is "a".
SELECT * FROM Customers
WHERE City LIKE '_a%';

- Select all records where the first letter of the City is "a" or "c" or "s".
SELECT * FROM Customers
WHERE City LIKE '[acs]%';

- Select all records where the first letter of the City starts with anything from "a" to "f".
SELECT * FROM Customers
WHERE City LIKE '[a-f]%';
```
--in regex, caret works exactly same as sql(https://stackoverflow.com/a/16944517/13994126)

```
- Select all records where the first letter of the City is NOT an "a" or a "c" or an "f".
SELECT * FROM Customers
WHERE City LIKE '[^acf]%';


--sql in--
- Use the IN operator to select all the records where Country is either "Norway" or "France".
SELECT * FROM Customers
WHERE Country IN ('Norway', 'France');

- Use the IN operator to select all the records where Country is NOT "Norway" and NOT "France".
SELECT * FROM Customers
WHERE Country NOT IN ('Norway', 'France');

--sql between--
- Use the BETWEEN operator to select all the records where the value of the Price column is between 10 and 20.
SELECT * FROM Products
WHERE Price BETWEEN 10 AND 20;

- Use the BETWEEN operator to select all the records where the value of the Price column is NOT between 10 and 20.
SELECT * FROM Products
WHERE Price NOT BETWEEN 10 AND 20;
WHERE Price BETWEEN NOT 10 AND 20--comments: This would be syntatically wrong(i.e, not semantic);

- Use the BETWEEN operator to select all the records where the value of the ProductName column is alphabetically between 'Geitost' and 'Pavlova'.
SELECT * FROM Products
WHERE ProductName BETWEEN 'Geitost' AND 'Pavlova';

--alias, tags=`rename column name`, `change name of column`, `changing column name`, `renaming column`.
- When displaying the Customers table, make an ALIAS of the PostalCode column, the column should be called Pno instead.
SELECT CustomerName, Address, PostalCode AS Pno
FROM Customers;

- When displaying the Customers table, refer to the table as Consumers instead of Customers.
SELECT * FROM Customers AS Consumers;

--inner join, amazing--
table names=> `Orders` and `Customers`.
SELECT Orders.OrderID, Customers.CustomerName, Orders.OrderDate FROM Orders INNER JOIN Customers
ON Orders.CustomerID=Customers.CustomerID;

Different Types of SQL JOINs
Here are the different types of the JOINs in SQL:

(INNER) JOIN: Returns records that have matching values in both tables
LEFT (OUTER) JOIN: Returns all records from the left table, and the matched records from the right table
RIGHT (OUTER) JOIN: Returns all records from the right table, and the matched records from the left table
FULL (OUTER) JOIN: Returns all records when there is a match in either left or right table
```

sql joings => https://www.w3schools.com/sql/sql_join.asp

```
- Choose the correct JOIN clause to select all records from the two tables where there is a match in both tables.
SELECT * FROM Orders INNER JOIN Customers
ON Orders.CustomerID=Customers.CustomerID;

- Choose the correct JOIN clause to select all the records from the Customers table plus all the matches in the Orders table.
SELECT * FROM Orders RIGHT JOIN Customers
ON Orders.CustomerID=Customers.CustomerID;

--group by--
- List the number of customers in each country.
SELECT COUNT(CustomerID), Country--tip:we use count(CustomerId) to count no. of customers coz other columns could have empty/null values for any customer(my own conscience tell that).
FROM Customers GROUP BY Country;

- List the number of customers in each country, ordered by the country with the most customers first.
SELECT COUNT(CustomerID), Country FROM Customers
GROUP BY Country
ORDER BY COUNT(CustomerID) DESC;

- List the number of customers in each country, ordered by the country with the most customers first.
SELECT COUNT(CustomerID), Country
FROM Customers
GROUP BY Country ORDER BY COUNT(CustomerID) DESC;

HOW THE LAST LINE AFFECTS I.E., GROUP BY Country affects in query result, read below queries to understand it...
- Below query count records corresponding to the total of each country.
SELECT COUNT(CustomerID), Country
FROM Customers
GROUP BY Country;

- Below query shows total records and the first country name found in the table.
SELECT COUNT(CustomerID), Country
FROM Customers

- Write the correct SQL statement to create a new database called testDB.
CREATE DATABASE testDB;

- Write the correct SQL statement to delete a database named testDB.
DROP DATABASE testDB;

- Write the correct SQL statement to create a new table called Persons.
CREATE TABLE Persons
 (
  PersonID int,
  LastName varchar(255),
  FirstName varchar(255),
  Address varchar(255),
  City varchar(255) 
);

- Write the correct SQL statement to delete a table called Persons.
DROP TABLE Persons;

- Use the TRUNCATE statement to delete all data inside a table.
TRUNCATE TABLE Persons;

- Add a column of type DATE called Birthday.
ALTER TABLE Persons
ADD Birthday DATE;

- Delete the column Birthday from the Persons table.
ALTER TABLE Persons
DROP COLUMN Birthday;

- 
```

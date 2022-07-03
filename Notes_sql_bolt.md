# My notes

Add to todo, practise with mailchil's mail api if thats free and also discover the use mandrill integration with mailchimp.

column_name and table name are case in-sensitive so free with sql, its very flexible!

## Lesson 2: Queries with constraints

```txt
SELECT column, another_column, …
FROM mytable
WHERE condition
    AND/OR another_condition
    AND/OR …;


Operator		          Condition						                                    SQL Example
=, !=, < <=, >, >=	  Standard numerical operators				                    col_name != 4
BETWEEN … AND …		    Number is within range of two values (inclusive)	      col_name BETWEEN 1.5 AND 10.5
NOT BETWEEN … AND …	  Number is not within range of two values (inclusive)	  col_name NOT BETWEEN 1 AND 10
IN (…)			          Number exists in a list					                        col_name IN (2, 4, 6)
NOT IN (…)		        Number does not exist in a list				                  col_name NOT IN (1, 3, 5)
```

In addition to making the results more manageable to understand, writing clauses to constrain the set of rows returned also allows the query to run faster due to the reduction in unnecessary data being returned.

- Examples

```sql
SELECT * FROM movies where id=6
SELECT * FROM movies where Year BETWEEN 2000 and 2010;
SELECT * FROM movies where Year not between 2000 and 2010;
SELECT title, year FROM movies where year < 2004;
```

## SQL Lesson 3: Queries with constraints (Pt. 2)

Operato Condition Example
= Case sensitive exact string comparison (notice the single equals) col\*name = "abc"
!= or < Case sensitive exact string inequality comparison col_name != "abcd"
LIKE Case insensitive exact string comparison col_name LIKE "ABC"
NOT LIKE Case insensitive exact string inequality comparison col_name NOT LIKE "ABCD"
% Used anywhere in a string to match a sequence of zero or more characters (only with LIKE or NOT LIKE) col_name LIKE "%AT%" (matches "AT","ATTIC","CAT" or even "BATS")

- Used anywhere in a string to match a single character (only with LIKE or NOT LIKE) col*name LIKE "AN*" (matches "AND", but not "AN")
  IN (…) String exists in a list col_name IN ("A", "B", "C")
  NOT IN (…) String does not exist in a list col_name NOT IN ("D", "E", "F")

* Examples

```sql
SELECT * FROM movies WHERE Title LIKE "toy story%";
SELECT * FROM movies WHERE Director="John Lasseter";
SELECT * FROM movies WHERE Director!="John Lasseter";
SELECT * FROM movies where title LIKE "WALL-%";
```

## SQL Lesson 4: Filtering and sorting Query results

```sql
--- DISTINCT keyword will blindly remove duplicate rows

SELECT DISTINCT column, another_column, …
FROM mytable
WHERE condition(s);




--- ORDER BY clause is specified, each row is sorted alpha-numerically based on the specified column's value. In some databases, you can also specify a collation to better sort data containing international text.

SELECT column, another_column, …
FROM mytable
WHERE condition(s)
ORDER BY column ASC/DESC;




--- Another clause which is commonly used with the ORDER BY clause are the LIMIT and OFFSET clauses, which are a useful optimization to indicate to the database the subset of the results you care about.  The LIMIT will reduce the number of rows to return, and the optional OFFSET will specify where to begin counting the number rows from.

SELECT column, another_column, …
FROM mytable
WHERE condition(s)
ORDER BY column ASC/DESC
LIMIT num_limit OFFSET num_offset;

```

````sql
SELECT DISTINCT director FROM movies order by Director ; 	-- List all directors of Pixar movies (alphabetically), without duplicates
SELECT * FROM movies ORDER BY YEAR DESC LIMIT 4; 		-- List the last four Pixar movies released (ordered from most recent to least)
SELECT * FROM movies ORDER BY title LIMIT 5; 			-- List the first five Pixar movies sorted alphabetically
SELECT * FROM movies ORDER BY title LIMIT 5 OFFSET 5; 		-- List the next five Pixar movies sorted alphabetically
```


## Lesson 5 - SQL Review: Simple SELECT Queries

```sql
SELECT * FROM north_american_cities where country="Canada"; 					--- List all the Canadian cities and their populations
SELECT * FROM north_american_cities WHERE country="United States" ORDER BY latitude DESC;	--- Order all the cities in the United States by their latitude from north to south
LEARN: For learning latitudes and logitudes, refer telegram's group of Geography
SELECT * FROM north_american_cities WHERE longitude<-87.629798 ORDER BY Longitude;				--- List all the cities west of Chicago, ordered from west to east
SELECT * FROM north_american_cities WHERE Country="Mexico" ORDER BY Population DESC LIMIT 2;			--- List the two largest cities in Mexico (by population)
SELECT * FROM north_american_cities WHERE Country="United States" ORDER BY Population DESC LIMIT 2 OFFSET 2;	--- List the third and fourth largest cities (by population) in the United States and their population ✓
````

- Q. What is Normalization ?

Ans. Up to now, we've been working with a single table, but entity data in the real world is often broken down into pieces and stored across multiple orthogonal tables using a process known as normalization[1].

Database normalization is the process of structuring a database, usually a relational database, in accordance with a series of so-called normal forms in order to reduce data redundancy and improve data integrity. It was first proposed by Edgar F. Codd as part of his relational model.

Normalization entails organizing the columns (attributes) and tables (relations) of a database to ensure that their dependencies are properly enforced by database integrity constraints. It is accomplished by applying some formal rules either by a process of synthesis (creating a new database design) or decomposition (improving an existing database design).

- Multi-table queries with JOINs

=> Tables that share information about a single entity need to have a primary key that identifies that entity uniquely across the database. One common primary key type is an auto-incrementing integer (because they are space efficient), but it can also be a string, hashed value, so long as it is unique.

Using the JOIN clause in a query, we can combine row data across two separate tables using this unique key. The first of the joins that we will introduce is the INNER JOIN.

Select query with INNER JOIN on multiple tables

```sql
SELECT column, another_table_column, …
FROM mytable
INNER JOIN another_table
    ON mytable.id = another_table.id
WHERE condition(s)
ORDER BY column, … ASC/DESC
LIMIT num_limit OFFSET num_offset;
```

The INNER JOIN is a process that matches rows from the first table and the second table which have the same key (as defined by the ON constraint) to create a result row with the combined columns from both tables. After the tables are joined, the other clauses we learned previously are then applied.

- Did you know?
  You might see queries where the INNER JOIN is written simply as a JOIN. These two are equivalent, but we will continue to refer to these joins as inner-joins because they make the query easier to read once you start using other types of joins, which will be introduced in the following lesson.

```sql
SELECT Title, domestic_sales, international_sales FROM movies JOIN boxoffice on Movies.id=Boxoffice.movie_id; 	# Find the domestic and international sales for each movie
# ALSO: Movies.id=Boxoffice.movie_id can also be written as: id=movie_id coz the column names are unique (i.e., column is only in either of those two tables).

SELECT * FROM movies JOIN boxoffice on id=movie_id WHERE International_sales>Domestic_sales;			# Show the sales numbers for each movie that did better
														# internationally rather than domestically
SELECT * FROM movies JOIN boxoffice on id=movie_id ORDER BY rating DESC;					# List all the movies by their ratings in descending order
```

## SQL Lesson 7: OUTER JOINs

Depending on how you want to analyze the data, the INNER JOIN we used last lesson might not be sufficient because the resulting table only contains data that belongs in both of the tables. If the two tables have asymmetric data, which can easily happen when data is entered in different stages, then we would have to use a LEFT JOIN, RIGHT JOIN or FULL JOIN instead to ensure that the data you need is not left out of the results.

```sql
SELECT column, another_column, …
FROM mytable
INNER/LEFT/RIGHT/FULL JOIN another_table
    ON mytable.id = another_table.matching_id
WHERE condition(s)
ORDER BY column, … ASC/DESC
LIMIT num_limit OFFSET num_offset;
```

So, its like INNER JOIN (JOIN) vs. LEFT JOIN / RIGHT JOIN / FULL JOIN

Like the INNER JOIN these three new joins have to specify which column to join the data on.
***When joining table A to table B, a LEFT JOIN simply includes rows from A regardless of whether a matching row is found in B. The RIGHT JOIN is the same, but reversed, keeping rows in B regardless of whether a match is found in A. Finally, a FULL JOIN simply means that rows from both tables are kept, regardless of whether a matching row exists in the other table.***

When using any of these new joins, you will likely have to write additional logic to deal with NULLs in the result and constraints (more on this in the next lesson).

**FYI:**
You might see queries with these joins written as LEFT OUTER JOIN, RIGHT OUTER JOIN, or FULL OUTER JOIN, but the OUTER keyword is really kept for SQL-92 compatibility and these queries are simply equivalent to LEFT JOIN, RIGHT JOIN, and FULL JOIN respectively.

```sql
SELECT distinct Building_name FROM Buildings LEFT JOIN Employees ON Building_name=Building WHERE role NOT NULL; # Find the list of all buildings that have employees

SELECT Building_name, Capacity FROM Buildings									# Find the list of all buildings and their capacity

SELECT distinct building_name, role FROM Buildings LEFT JOIN Employees on  building_name=building		# List all buildings and the distinct employee roles in
														# each building (including empty buildings)

```

## SQL Lesson 8: A short note on NULLs

As promised in the last lesson, we are going to quickly talk about NULL values in an SQL database. It's always good to reduce the possibility of NULL values in databases because they require special attention when constructing queries, constraints (certain functions behave differently with null values) and when processing the results.

An alternative to NULL values in your database is to have data-type appropriate default values, like 0 for numerical data, empty strings for text data, etc. But if your database needs to store incomplete data, then NULL values can be appropriate if the default values will skew later analysis (for example, when taking averages of numerical data).

Sometimes, it's also not possible to avoid NULL values, as we saw in the last lesson when outer-joining two tables with asymmetric data. In these cases, you can test a column for NULL values in a WHERE clause by using either the IS NULL or IS NOT NULL constraint.

```sql
Select query with constraints on NULL values
SELECT column, another_column, …
FROM mytable
WHERE column IS/IS NOT NULL
AND/OR another_condition
AND/OR …;
```

```sql
SELECT * FROM Employees left join Buildings ON Building_name=Building WHERE Building_name IS NULL;  # Find the name and role of all employees who have not been assigned to a building

SELECT * FROM Buildings left join Employees ON Building_name=Building WHERE role is null; 	    # Find the names of the buildings that hold no employees ✓
```

## SQL Lesson 9: Queries with expressions

In addition to querying and referencing raw column data with SQL, you can also use expressions to write more complex logic on column values in a query. These expressions can use mathematical and string functions along with basic arithmetic to transform values when the query is executed, as shown in this physics example.

Example query with expressions

```sql
SELECT particle_speed / 2.0 AS half_particle_speed
FROM physics_data
WHERE ABS(particle_position) * 10.0 > 500;
Each database has its own supported set of mathematical, string, and date functions that can be used in a query, which you can find in their own respective docs.
```

The use of expressions can save time and extra post-processing of the result data, but can also make the query harder to read, so we recommend that when expressions are used in the SELECT part of the query, that they are also given a descriptive alias using the AS keyword.

Select query with expression aliases

```sql
SELECT col_expression AS expr_description, …
FROM mytable;
In addition to expressions, regular columns and even tables can also have aliases to make them easier to reference in the output and as a part of simplifying more complex queries.
```

Example query with both column and table name aliases

```sql
SELECT column AS better_column_name, …
FROM a_long_widgets_table_name AS mywidgets
INNER JOIN widget_sales
  ON mywidgets.id = widget_sales.widget_id;
```

```sql
SELECT Title, (domestic_sales+International_sales)/1000000 as Sales FROM movies LEFT JOIN Boxoffice on id=movie_id;	# List all movies and their combined sales in millions of dollars
SELECT Title, rating*10 as Rating FROM Movies LEFT JOIN Boxoffice ON id=movie_id;					    --- List all movies and their ratings in percent
															--- (fyi: rating was out of 10)
SELECT Title, year FROM Movies LEFT JOIN Boxoffice ON id=movie_id WHERE Year % 2 = 0;					--- List all movies that were released on even number years
```

## SQL Lesson 10: Queries with aggregates (Pt. 1)

In addition to the simple expressions that we introduced last lesson, SQL also supports the use of aggregate expressions (or functions) that allow you to summarize information about a group of rows of data. With the Pixar database that you've been using, aggregate functions can be used to answer questions like, "How many movies has Pixar produced?", or "What is the highest grossing Pixar film each year?".

```sql
Select query with aggregate functions over all rows
SELECT AGG_FUNC(column_or_expression) AS aggregate_description, …
FROM mytable
WHERE constraint_expression;
--- Without a specified grouping, each aggregate function is going to run on the whole set of result rows and return a single value. And like normal expressions, giving your aggregate functions an alias ensures that the results will be easier to read and process.
```

Common aggregate functions
Here are some common aggregate functions that we are going to use in our examples:

**Function Description**

```sql
COUNT(*), COUNT(column) --- A common function used to counts the number of rows in the group if no column name is specified. Otherwise, count the number of rows in the group with non-NULL values in the specified column.
MIN(column) --- Finds the smallest numerical value in the specified column for all rows in the group.
MAX(column) --- Finds the largest numerical value in the specified column for all rows in the group.
AVG(column) --- Finds the average numerical value in the specified column for all rows in the group.
SUM(column) --- Finds the sum of all numerical values in the specified column for the rows in the group.
--- In addition to aggregating across all the rows, you can instead apply the aggregate functions to individual groups of data within that group (ie. box office sales for Comedies vs Action movies).
--- This would then create as many results as there are unique groups defined as by the GROUP BY clause.
```

Docs: [SQLite Aggregate functions](https://www.sqlite.org/lang_aggfunc.html), [Postgres Aggregate Functions](https://www.postgresql.org/docs/9.4/functions-aggregate.html), [MySQL Aggregate Functions](https://docs.microsoft.com/en-us/sql/t-sql/functions/aggregate-functions-transact-sql?redirectedfrom=MSDN&view=sql-server-ver15).

```sql
Select query with aggregate functions over groups
SELECT AGG_FUNC(column_or_expression) AS aggregate_description, …
FROM mytable
WHERE constraint_expression
GROUP BY column;
--- The GROUP BY clause works by grouping rows that have the same value in the column specified.
```

```sql
SELECT MAX(years_employed) FROM employees;                                           --- Find the longest time that an employee has been at the studio
SELECT role, AVG(years_employed) as AVG_YEARS FROM employees GROUP BY role;          --- For each role, find the average number of years employed by employees in that role
SELECT building, SUM(years_employed) as AVG_YEARS FROM employees GROUP BY building;  --- Find the total number of employee years worked in each building
```

## SQL Lesson 11: Queries with aggregates (Pt. 2)

[HAVING@w3schools](https://www.w3schools.com/sql/sql_having.asp)

Our queries are getting fairly complex, but we have nearly introduced all the important parts of a SELECT query. One thing that you might have noticed is that if the GROUP BY clause is executed after the WHERE clause (which filters the rows which are to be grouped), then how exactly do we filter the grouped rows?

Luckily, SQL allows us to do this by adding an additional HAVING clause which is used specifically with the GROUP BY clause to allow us to filter grouped rows from the result set.

```sql
Select query with HAVING constraint
SELECT group_by_column, AGG_FUNC(column_expression) AS aggregate_result_alias, …
FROM mytable
WHERE condition
GROUP BY column
HAVING group_condition;
--- The HAVING clause constraints are written the same way as the WHERE clause constraints, and are applied to the grouped rows. With our examples, this might not seem like a particularly useful construct, but if you imagine data with millions of rows with different properties, being able to apply additional constraints is often necessary to quickly make sense of the data.
```

Did you know?
If you aren't using the `GROUP BY` clause, a simple `WHERE` clause will suffice.

```sql
SELECT COUNT() FROM employees WHERE role="Artist"; --- Find the number of Artists in the studio (without a HAVING clause)
SELECT Role, COUNT(ROLE) as employeed_count FROM employees GROUP BY Role; --- Find the number of Employees of each role in the studio
SELECT sum(years_employed) FROM employees WHERE role="Engineer"; --- Find the total number of years employed by all Engineers
```

## SQL Lesson 12: Order of execution of a Query

Now that we have an idea of all the parts of a query, we can now talk about how they all fit together in the context of a complete query.

Complete SELECT query

```sql
SELECT DISTINCT column, AGG_FUNC(column_or_expression), …
FROM mytable
    JOIN another_table
      ON mytable.column = another_table.column
    WHERE constraint_expression
    GROUP BY column
    HAVING constraint_expression
    ORDER BY column ASC/DESC
    LIMIT count OFFSET COUNT;
---Each query begins with finding the data that we need in a database, and then filtering that data down into something that can be processed and understood as quickly as possible. Because each part of the query is executed sequentially, it's important to understand the order of execution so that you know what results are accessible where.
```

Query order of execution

1. FROM and JOINs
   The FROM clause, and subsequent JOINs are first executed to determine the total working set of data that is being queried. This includes subqueries in this clause, and can cause temporary tables to be created under the hood containing all the columns and rows of the tables being joined.

2. WHERE
   Once we have the total working set of data, the first-pass WHERE constraints are applied to the individual rows, and rows that do not satisfy the constraint are discarded. Each of the constraints can only access columns directly from the tables requested in the FROM clause. Aliases in the SELECT part of the query are not accessible in most databases since they may include expressions dependent on parts of the query that have not yet executed.

3. GROUP BY
   The remaining rows after the WHERE constraints are applied are then grouped based on common values in the column specified in the GROUP BY clause. As a result of the grouping, there will only be as many rows as there are unique values in that column. Implicitly, this means that you should only need to use this when you have aggregate functions in your query.

4. HAVING
   If the query has a GROUP BY clause, then the constraints in the HAVING clause are then applied to the grouped rows, discard the grouped rows that don't satisfy the constraint. Like the WHERE clause, aliases are also not accessible from this step in most databases.

5. SELECT
   Any expressions in the SELECT part of the query are finally computed.

6. DISTINCT
   Of the remaining rows, rows with duplicate values in the column marked as DISTINCT will be discarded.

7. ORDER BY
   If an order is specified by the ORDER BY clause, the rows are then sorted by the specified data in either ascending or descending order. Since all the expressions in the SELECT part of the query have been computed, you can reference aliases in this clause.

8. LIMIT / OFFSET
   Finally, the rows that fall outside the range specified by the LIMIT and OFFSET are discarded, leaving the final set of rows to be returned from the query.

Conclusion
Not every query needs to have all the parts we listed above, but a part of why SQL is so flexible is that it allows developers and data analysts to quickly manipulate data without having to write additional code, all just by using the above clauses.

```sql
SELECT Director, Count(Title) FROM movies GROUP BY Director               --- Find the number of movies each director has directed

SELECT Director, Sum(Domestic_sales+International_sales) FROM movies INNER JOIN Boxoffice on id=Movie_id GROUP BY Director ---Find the total domestic and international sales that can be attributed to each director ✓
```

## SQL Lesson 13: Inserting rows

We've spent quite a few lessons on how to query for data in a database, so it's time to start learning a bit about SQL schemas and how to add new data.

What is a Schema?
We previously described a table in a database as a two-dimensional set of rows and columns, with the columns being the properties and the rows being instances of the entity in the table. In SQL, the database schema is what describes the structure of each table, and the datatypes that each column of the table can contain.

Example: Correlated subquery
For example, in our Movies table, the values in the Year column must be an Integer, and the values in the Title column must be a String.

This fixed structure is what allows a database to be efficient, and consistent despite storing millions or even billions of rows.

Inserting new data
When inserting data into a database, we need to use an INSERT statement, which declares which table to write into, the columns of data that we are filling, and one or more rows of data to insert. In general, each row of data you insert should contain values for every corresponding column in the table. You can insert multiple rows at a time by just listing them sequentially.

```sql
Insert statement with values for all columns
INSERT INTO mytable
VALUES (value_or_expr, another_value_or_expr, …),
       (value_or_expr_2, another_value_or_expr_2, …),
       …;
--- In some cases, if you have incomplete data and the table contains columns that support default values, you can insert rows with only the columns of data you have by specifying them explicitly.
```

```sql
Insert statement with specific columns
INSERT INTO mytable
(column, another_column, …)
VALUES (value_or_expr, another_value_or_expr, …),
      (value_or_expr_2, another_value_or_expr_2, …),
      …;
--- In these cases, the number of values need to match the number of columns specified. Despite this being a more verbose statement to write, inserting values this way has the benefit of being forward compatible. For example, if you add a new column to the table with a default value, no hardcoded INSERT statements will have to change as a result to accommodate that change.
```

In addition, you can use mathematical and string expressions with the values that you are inserting.
This can be useful to ensure that all data inserted is formatted a certain way.

```sql
Example Insert statement with expressions
INSERT INTO boxoffice
(movie_id, rating, sales_in_millions)
VALUES (1, 9.9, 283742034 / 1000000);
```

```sql
INSERT INTO Movies (Title, Director, Year, Length_minutes) VALUES ("Toy Story 4", "John Lasseter", 2001, 190) --- Add the studio's new production, Toy Story 4 to the list of movies (you can use any director)

INSERT INTO Boxoffice (Movie_id, Rating, Domestic_sales, International_sales) VALUES (15, 8.7, 340000000, 270000000) --- Toy Story 4 has been released to critical acclaim! It had a rating of 8.7, and made 340 million domestically and 270 million internationally. Add the record to the BoxOffice table.
```

## SQL Lesson 14: Updating rows

In addition to adding new data, a common task is to update existing data, which can be done using an UPDATE statement. Similar to the INSERT statement, you have to specify exactly which table, columns, and rows to update. In addition, the data you are updating has to match the data type of the columns in the table schema.

Update statement with values

```sql
UPDATE mytable
SET column = value_or_expr,
    other_column = another_value_or_expr,
    …
WHERE condition;
--- The statement works by taking multiple column/value pairs, and applying those changes to each and every row that satisfies the constraint in the WHERE clause.
```

Taking care

Most people working with SQL will make mistakes updating data at one point or another. Whether it's updating the wrong set of rows in a production database, or accidentally leaving out the WHERE clause (which causes the update to apply to all rows), you need to be extra careful when constructing UPDATE statements.

One helpful tip is to always write the constraint first and test it in a SELECT query to make sure you are updating the right rows, and only then writing the column/value pairs to update.

```sql
UPDATE Movies SET Director="John Lasseter" WHERE id=2                     --- The director for A Bug's Life is incorrect, it was actually directed by John Lasseter
UPDATE Movies SET Year=1999 WHERE id=3                                    --- The year that Toy Story 2 was released is incorrect, it was actually released in 1999
UPDATE Movies SET title="Toy Story 3", director="Lee Unkrich" WHERE id=11 --- Both the title and director for Toy Story 8 is incorrect! The title should be "Toy Story 3" and it was directed by Lee Unkrich
```

## SQL Lesson 15: Deleting rows

When you need to delete data from a table in the database, you can use a DELETE statement, which describes the table to act on, and the rows of the table to delete through the WHERE clause.

```sql
Delete statement with condition
DELETE FROM mytable
WHERE condition;
--- If you decide to leave out the WHERE constraint, then all rows are removed, which is a quick and easy way to clear out a table completely (if intentional).
```

Taking extra care
Like the UPDATE statement from last lesson, it's recommended that you run the constraint in a SELECT query first to ensure that you are removing the right rows. Without a proper backup or test database, it is downright easy to irrevocably remove data, so always read your DELETE statements twice and execute once.

```sql
DELETE FROM Movies WHERE Year<2005                  --- This database is getting too big, lets remove all movies that were released before 2005.
DELETE FROM Movies WHERE Director="Andrew Stanton"  --- Andrew Stanton has also left the studio, so please remove all movies directed by him.
```

## SQL Lesson 16: Creating tables

When you have new entities and relationships to store in your database, you can create a new database table using the CREATE TABLE statement.

Create table statement w/ optional table constraint and default value

```sql
CREATE TABLE IF NOT EXISTS mytable (
    column DataType TableConstraint DEFAULT default_value,
    another_column DataType TableConstraint DEFAULT default_value,
    …
);
```

The structure of the new table is defined by its table schema, which defines a series of columns. Each column has a name, the type of data allowed in that column, an optional table constraint on values being inserted, and an optional default value.

If there already exists a table with the same name, the SQL implementation will usually throw an error, so to suppress the error and skip creating a table if one exists, you can use the IF NOT EXISTS clause.

SQL Data Types: https://sqlbolt.com/lesson/creating_tables (Data too comple to be put here but really useful data types explained here).

```sql
CREATE TABLE Database (
    Name STRING PRIMARY KEY,
    Version FLOAT,
    Download_count INTEGER
);
--- Create a new table named Database with the following columns:
--- – Name A string (text) describing the name of the database
--- – Version A number (floating point) of the latest version of this database
--- – Download_count An integer count of the number of times this database was downloaded
--- This table has no constraints.
```

## SQL Lesson 17: Altering tables

As your data changes over time, SQL provides a way for you to update your corresponding tables and database schemas by using the ALTER TABLE statement to add, remove, or modify columns and table constraints.

Adding columns
The syntax for adding a new column is similar to the syntax when creating new rows in the CREATE TABLE statement. You need to specify the data type of the column along with any potential table constraints and default values to be applied to both existing and new rows. In some databases like MySQL, you can even specify where to insert the new column using the FIRST or AFTER clauses, though this is not a standard feature.

Altering table to add new column(s)

```sql
ALTER TABLE mytable
ADD column DataType OptionalTableConstraint
    DEFAULT default_value;
Removing columns
-- Dropping columns is as easy as specifying the column to drop, however, some databases (including SQLite) don't support this feature. Instead you may have to create a new table and migrate the data over.
```

Altering table to remove column(s)

```sql
ALTER TABLE mytable
DROP column_to_be_deleted;
Renaming the table
--- If you need to rename the table itself, you can also do that using the RENAME TO clause of the statement.
```

Altering table name

```sql
ALTER TABLE mytable
RENAME TO new_table_name;
Other changes
--- Each database implementation supports different methods of altering their tables, so it's always best to consult your database docs before proceeding: MySQL, Postgres, SQLite, Microsoft SQL Server.
```

```sql
ALTER TABLE Movies ADD Aspect_ratio FLOAT;              --- Add a column named Aspect_ratio with a FLOAT data type to store the aspect-ratio each movie was released in.
ALTER TABLE Movies ADD Language TEXT DEFAULT "English"; --- Add another column named Language with a TEXT data type to store the language that the movie was released in. Ensure that the default for this language is English.
```

## SQL Lesson 18: Dropping tables

In some rare cases, you may want to remove an entire table including all of its data and metadata, and to do so, you can use the DROP TABLE statement, which differs from the DELETE statement in that it also removes the table schema from the database entirely.

```
Drop table statement
DROP TABLE IF EXISTS mytable;
Like the CREATE TABLE statement, the database may throw an error if the specified table does not exist, and to suppress that error, you can use the IF EXISTS clause.
```

In addition, if you have another table that is dependent on columns in table you are removing (for example, with a FOREIGN KEY dependency) then you will have to either update all dependent tables first to remove the dependent rows or to remove those tables entirely.

```sql
DROP TABLE Movies; --- We've sadly reached the end of our lessons, lets clean up by removing the Movies table
DROP TABLE BoxOffice --- And drop the BoxOffice table as well
```

## ADDITIONAL: SQL Topic: Subqueries

src: https://sqlbolt.com/topics

src: https://sqlbolt.com/topic/subqueries

You might have noticed that even with a complete query, there are many questions that we can't answer about our data without additional post, or pre, processing. In these cases, you can either make multiple queries and process the data yourself, or you can build a more complex query using SQL subqueries.

Example: General subquery
Lets say your company has a list of all Sales Associates, with data on the revenue that each Associate brings in, and their individual salary. Times are tight, and you now want to find out which of your Associates are costing the company more than the average revenue brought per Associate.

First, you would need to calculate the average revenue all the Associates are generating:

```sql
SELECT AVG(revenue_generated)
FROM sales_associates;
And then using that result, we can then compare the costs of each of the Associates against that value. To use it as a subquery, we can just write it straight into the WHERE clause of the query:

SELECT *
FROM sales_associates
WHERE salary >
   (SELECT AVG(revenue_generated)
    FROM sales_associates);
--- As the constraint is executed, each Associate's salary will be tested against the value queried from the inner subquery.
```

A subquery can be referenced anywhere a normal table can be referenced. Inside a FROM clause, you can JOIN subqueries with other tables, inside a WHERE or HAVING constraint, you can test expressions against the results of the subquery, and even in expressions in the SELECT clause, which allow you to return data directly from the subquery. They are generally executed in the same logical order as the part of the query that they appear in, as described in the last lesson.

Because subqueries can be nested, each subquery must be fully enclosed in parentheses in order to establish proper hierarchy. Subqueries can otherwise reference any tables in the database, and make use of the constructs of a normal query (though some implementations don't allow subqueries to use LIMIT or OFFSET).

Correlated subqueries
A more powerful type of subquery is the correlated subquery in which the inner query references, and is dependent on, a column or alias from the outer query. Unlike the subqueries above, each of these inner queries need to be run for each of the rows in the outer query, since the inner query is dependent on the current outer query row.

Example: Correlated subquery
Instead of the list of just Sales Associates above, imagine if you have a general list of Employees, their departments (engineering, sales, etc.), revenue, and salary. This time, you are now looking across the company to find the employees who perform worse than average in their department.

For each employee, you would need to calculate their cost relative to the average revenue generated by all people in their department. To take the average for the department, the subquery will need to know what department each employee is in:

```sql
SELECT *
FROM employees
WHERE salary >
   (SELECT AVG(revenue_generated)
    FROM employees AS dept_employees
    WHERE dept_employees.department = employees.department);
```

These kinds of complex queries can be powerful, but also difficult to read and understand, so you should take care using them. If possible, try and give meaningful aliases to the temporary values and tables. In addition, correlated subqueries can be difficult to optimize, so performance characteristics may vary across different databases.

Existence tests
When we introduced WHERE constraints in Lesson 2: Queries with constraints, the IN operator was used to test whether the column value in the current row existed in a fixed list of values. In complex queries, this can be extended using subqueries to test whether a column value exists in a dynamic list of values.

```sql
Select query with subquery constraint
SELECT *, …
FROM mytable
WHERE column
    IN/NOT IN (SELECT another_column
               FROM another_table);
```

When doing this, notice that the inner subquery must select for a column value or expression to produce a list that the outer column value can be tested against. This type of constraint is powerful when the constraints are based on current data.

## ADDITIONAL: SQL Topic: Unions, Intersections & Exceptions

src: https://sqlbolt.com/topic/set_operations

When working with multiple tables, the UNION and UNION ALL operator allows you to append the results of one query to another assuming that they have the same column count, order and data type. If you use the UNION without the ALL, duplicate rows between the tables will be removed from the result.

```sql
Select query with set operators
SELECT column, another_column
   FROM mytable
UNION / UNION ALL / INTERSECT / EXCEPT
SELECT other_column, yet_another_column
   FROM another_table
ORDER BY column DESC
LIMIT n;
```

In the order of operations as defined in Lesson 12: Order of execution, the UNION happens before the ORDER BY and LIMIT. It's not common to use UNIONs, but if you have data in different tables that can't be joined and processed, it can be an alternative to making multiple queries on the database.

Similar to the UNION, the INTERSECT operator will ensure that only rows that are identical in both result sets are returned, and the EXCEPT operator will ensure that only rows in the first result set that aren't in the second are returned. This means that the EXCEPT operator is query order-sensitive, like the LEFT JOIN and RIGHT JOIN.

Both INTERSECT and EXCEPT also discard duplicate rows after their respective operations, though some databases also support INTERSECT ALL and EXCEPT ALL to allow duplicates to be retained and returned.

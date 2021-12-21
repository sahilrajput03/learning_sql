## Lesson 2: Queries with constraints
=====================================

```txt
SELECT column, another_column, …
FROM mytable
WHERE condition
    AND/OR another_condition
    AND/OR …;

Operator		Condition						SQL Example
=, !=, < <=, >, >=	Standard numerical operators				col_name != 4
BETWEEN … AND …		Number is within range of two values (inclusive)	col_name BETWEEN 1.5 AND 10.5
NOT BETWEEN … AND …	Number is not within range of two values (inclusive)	col_name NOT BETWEEN 1 AND 10
IN (…)			Number exists in a list					col_name IN (2, 4, 6)
NOT IN (…)		Number does not exist in a list				col_name NOT IN (1, 3, 5)
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
=================================================

Operato		Condition												Example
=		Case sensitive exact string comparison (notice the single equals)					col_name = "abc"
!= or <		Case sensitive exact string inequality comparison							col_name != "abcd"
LIKE		Case insensitive exact string comparison								col_name LIKE "ABC"
NOT LIKE	Case insensitive exact string inequality comparison							col_name NOT LIKE "ABCD"
%		Used anywhere in a string to match a sequence of zero or more characters (only with LIKE or NOT LIKE)	col_name LIKE "%AT%" (matches "AT","ATTIC","CAT" or even "BATS")
_		Used anywhere in a string to match a single character (only with LIKE or NOT LIKE)			col_name LIKE "AN_" (matches "AND", but not "AN")
IN (…)		String exists in a list											col_name IN ("A", "B", "C")
NOT IN (…)	String does not exist in a list										col_name NOT IN ("D", "E", "F")

- Examples

```sql
SELECT * FROM movies WHERE Title LIKE "toy story%";
SELECT * FROM movies WHERE Director="John Lasseter";
SELECT * FROM movies WHERE Director!="John Lasseter";
SELECT * FROM movies where title LIKE "WALL-%";
```

SQL Lesson 4: Filtering and sorting Query results
=================================================

```syntax
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

```sql
SELECT DISTINCT director FROM movies order by Director ; 	-- List all directors of Pixar movies (alphabetically), without duplicates 
SELECT * FROM movies ORDER BY YEAR DESC LIMIT 4; 		-- List the last four Pixar movies released (ordered from most recent to least)
SELECT * FROM movies ORDER BY title LIMIT 5; 			-- List the first five Pixar movies sorted alphabetically
SELECT * FROM movies ORDER BY title LIMIT 5 OFFSET 5; 		-- List the next five Pixar movies sorted alphabetically



Lesson 5 - SQL Review: Simple SELECT Queries
============================================

```sql
SELECT * FROM north_american_cities where country="Canada"; 					--- List all the Canadian cities and their populations
SELECT * FROM north_american_cities WHERE country="United States" ORDER BY latitude DESC;	--- Order all the cities in the United States by their latitude from north to south
LEARN: For learning latitudes and logitudes, refer telegram's group of Geography
SELECT * FROM north_american_cities WHERE longitude<-87.629798 ORDER BY Longitude;				--- List all the cities west of Chicago, ordered from west to east
SELECT * FROM north_american_cities WHERE Country="Mexico" ORDER BY Population DESC LIMIT 2;			--- List the two largest cities in Mexico (by population) 
SELECT * FROM north_american_cities WHERE Country="United States" ORDER BY Population DESC LIMIT 2 OFFSET 2;	--- List the third and fourth largest cities (by population) in the United States and their population ✓
```


- Q. What is Normalization ?

Ans. Up to now, we've been working with a single table, but entity data in the real world is often broken down into pieces and stored across multiple orthogonal tables using a process known as normalization[1].

Database normalization is the process of structuring a database, usually a relational database, in accordance with a series of so-called normal forms in order to reduce data redundancy and improve data integrity. It was first proposed by Edgar F. Codd as part of his relational model.

Normalization entails organizing the columns (attributes) and tables (relations) of a database to ensure that their dependencies are properly enforced by database integrity constraints. It is accomplished by applying some formal rules either by a process of synthesis (creating a new database design) or decomposition (improving an existing database design).

- Multi-table queries with JOINs

=> Tables that share information about a single entity need to have a primary key that identifies that entity uniquely across the database. One common primary key type is an auto-incrementing integer (because they are space efficient), but it can also be a string, hashed value, so long as it is unique.

Using the JOIN clause in a query, we can combine row data across two separate tables using this unique key. The first of the joins that we will introduce is the INNER JOIN.

Select query with INNER JOIN on multiple tables
```syntax
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

SQL Lesson 7: OUTER JOINs
=========================

Depending on how you want to analyze the data, the INNER JOIN we used last lesson might not be sufficient because the resulting table only contains data that belongs in both of the tables. If the two tables have asymmetric data, which can easily happen when data is entered in different stages, then we would have to use a LEFT JOIN, RIGHT JOIN or FULL JOIN instead to ensure that the data you need is not left out of the results.


```syntax
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
When joining table A to table B, a LEFT JOIN simply includes rows from A regardless of whether a matching row is found in B. The RIGHT JOIN is the same, but reversed, keeping rows in B regardless of whether a match is found in A. Finally, a FULL JOIN simply means that rows from both tables are kept, regardless of whether a matching row exists in the other table.

When using any of these new joins, you will likely have to write additional logic to deal with NULLs in the result and constraints (more on this in the next lesson).

**FYI:**
You might see queries with these joins written as LEFT OUTER JOIN, RIGHT OUTER JOIN, or FULL OUTER JOIN, but the OUTER keyword is really kept for SQL-92 compatibility and these queries are simply equivalent to LEFT JOIN, RIGHT JOIN, and FULL JOIN respectively.

```sql
SELECT distinct Building_name FROM Buildings LEFT JOIN Employees ON Building_name=Building WHERE role NOT NULL; # Find the list of all buildings that have employees

SELECT Building_name, Capacity FROM Buildings									# Find the list of all buildings and their capacity

SELECT distinct building_name, role FROM Buildings LEFT JOIN Employees on  building_name=building		# List all buildings and the distinct employee roles in 
														# each building (including empty buildings)

```

SQL Lesson 8: A short note on NULLs
===================================

As promised in the last lesson, we are going to quickly talk about NULL values in an SQL database. It's always good to reduce the possibility of NULL values in databases because they require special attention when constructing queries, constraints (certain functions behave differently with null values) and when processing the results.

An alternative to NULL values in your database is to have data-type appropriate default values, like 0 for numerical data, empty strings for text data, etc. But if your database needs to store incomplete data, then NULL values can be appropriate if the default values will skew later analysis (for example, when taking averages of numerical data).

Sometimes, it's also not possible to avoid NULL values, as we saw in the last lesson when outer-joining two tables with asymmetric data. In these cases, you can test a column for NULL values in a WHERE clause by using either the IS NULL or IS NOT NULL constraint.

```syntax
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


SQL Lesson 9: Queries with expressions
======================================

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
SELECT Title, rating*10 as Rating FROM Movies LEFT JOIN Boxoffice ON id=movie_id;					# List all movies and their ratings in percent
															# (fyi: rating was out of 10)
SELECT Title, year FROM Movies LEFT JOIN Boxoffice ON id=movie_id WHERE Year % 2 = 0;					# List all movies that were released on even number years ✓
```



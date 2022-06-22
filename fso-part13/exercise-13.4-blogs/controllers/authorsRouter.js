// @ts-nocheck
const express = require('express')
const {Op} = require('sequelize')
const {sequelize} = require('../initPostgreSql')
const {UserM, BlogM} = require('../models')
const authorsRouter = express.Router()

// ex: 13.16
authorsRouter.get('/', async (req, res) => {
	/**
	 * 	* Exact case (@below w3school tut-link) of count, group and but order by the counted entity (in our case we order by resulting `sum` entity.) ~ Sahil
		LEARN HOW THIS QUERY WORKS - Browse: https://www.w3schools.com/sql/trysql.asp?filename=trysql_select_groupby_orderby
		And try adding `CustomerID` in select part and also see what happens if you remove `GROUP BY Country` from the query.

		Learn using aggregate functions @ https://sebhastian.com/sequelize-group-by/
		BUT SEQUELIZE DOCUMENTATION IS PRETTY NEAT AS WELL!.
	 */

	// ~ Didzis Zvaigzne's Solution from github. (WORKS GOOD), https://github.com/didzis1/full-stack-open-sql/blob/main/controllers/authors.js
	// const blogs = await BlogM.findAll({
	// 	attributes: ['author', [sequelize.fn('sum', sequelize.col('likes')), 'likes'], [sequelize.fn('count', sequelize.col('id')), 'blogs']],
	// 	group: 'author',
	// 	order: sequelize.literal('likes DESC'),
	// })

	// my way.. (same as above but different column names and column selector ) ~Sahil (WORKS GOOD)
	// let blogs = await BlogM.findAll({
	// 	attributes: ['author', [sequelize.fn('COUNT', sequelize.col('author')), 'articles'], [sequelize.fn('SUM', sequelize.col('likes')), 'total_likes']],
	// 	group: ['author'],
	// 	order: sequelize.literal('total_likes DESC'),
	// })

	/*
	 * Revise how group by works? Visit: https://www.w3schools.com/sql/sql_groupby.asp
	 */

	// Kalle Ives Solution (WORKS GOOD)!
	const rows = await sequelize.query(
		`
	select author, sum(likes) as like_count, count(author) as blog_count from blogs
	group by author
	order by like_count desc
	`,
		{type: sequelize.QueryTypes.SELECT}
	)

	const blogs = rows.map((row) => ({
		author: row.author,
		total_likes: row.like_count,
		articles: row.blog_count,
	}))
	return res.json(blogs)
})

module.exports = authorsRouter

const readingListRouter = require('express').Router()
const tokenExtractor = require('../utils/tokenExtractor')

const {UserM, BlogM, ReadingListM} = require('../models')
const {logger, loggert} = require('../utils/logger')

// ex 13.22
readingListRouter.put('/:id', tokenExtractor, async (req, res) => {
	// logger.info(req.decodedToken)
	// logger.info(req.params.id)

	/** @type any */
	const readingListItem = await ReadingListM.findByPk(req.params.id)

	if (readingListItem) {
		logger.info('readingListItem:', readingListItem.toJSON())

		// @ts-ignore
		// If readinList relation doesn't belong to uesr then return error message:
		if (readingListItem.id !== req.decodedToken.id) return res.status(401).json({error: 'blog does not belong to user'})

		readingListItem.isRead = req.body.read
		await readingListItem.save()
		res.json(readingListItem)
	} else {
		res.status(404).end()
	}
})

module.exports = readingListRouter

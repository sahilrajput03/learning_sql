const router = require('express').Router()

const {UserM} = require('../models')

router.get('/', async (req, res) => {
	const users = await UserM.findAll()
	res.json(users)
})

router.post('/', async (req, res) => {
	try {
		const user = await UserM.create(req.body)
		res.json(user)
	} catch (error) {
		return res.status(400).json({error})
	}
})

router.get('/:id', async (req, res) => {
	const user = await UserM.findByPk(req.params.id)
	if (user) {
		res.json(user)
	} else {
		res.status(404).end()
	}
})

module.exports = router

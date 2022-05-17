let l = console.log
let s = JSON.stringify
let ps = (...args) => JSON.parse(JSON.stringify(...args))

// FOLLOWING FSO's and Sequelize way of getting raw object is the real solution i.e., calling .toJSON() method on objects.
// WAY1: Data type syntax highlight is present. (indentation is not possible when we do parsing json to js object)
let dataValues = (data) => data.map((n) => n.dataValues)

// WAY2: Prints with indentation but syntax highlight (of data type is not possible)
let _dataValues = (data) => {
	return JSON.stringify(
		data.map((n) => n.dataValues),
		null,
		2
	)
}

module.exports = {l, s, ps, dataValues, _dataValues}

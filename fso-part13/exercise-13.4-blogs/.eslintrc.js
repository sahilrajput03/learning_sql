module.exports = {
	env: {
		commonjs: true,
		es2021: true,
		node: true,
	},
	extends: 'eslint:recommended',
	parserOptions: {
		ecmaVersion: 13,
	},
	rules: {
		'no-unused-vars': [0],
		'no-mixed-spaces-and-tabs': [0],
	},
}

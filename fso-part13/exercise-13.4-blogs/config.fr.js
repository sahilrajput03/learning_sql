module.exports = {
	//LEARN: Hot reloading of config file works really aweome as well, i.e, with debug flag and also with `refresh` files as well (100% GENUINE WAY OF WORKING! ~ Sahil).
	refresh: ['initPostgreSql.js', 'models'],
	// refresh: [],
	// debug:: You can have values like '', '--inspect', '--inspect-brk'.
	debug: '--inspect',
}

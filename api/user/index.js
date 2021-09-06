const userApiHandler = require('./userApiHandler');

module.exports = {
	routes: [
		...userApiHandler.routes
	]
};
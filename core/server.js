const {
	Logger,
	LOGGER_CONSTANTS
} = require('../common');
const swaggerConfig = require('../swagger');

const logger = Logger(LOGGER_CONSTANTS.SERVER);
const express = require('express');

const rootApp = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const routeServiceProvider = require('./service/routeServiceProvider');
const path = require('path');
const fs = require('fs');

// const options = {
// 	key: fs.readFileSync('certificate/key.pem'),
// 	cert: fs.readFileSync('certificate/cert.pem')
// };

// const options = {
// 	key: fs.readFileSync('certificate/2020TWCA_star_ieiworld_com.key'),
// 	cert: fs.readFileSync('certificate/bundle2020.crt'),
// 	ca: fs.readFileSync('certificate/server-chain.crt')
// };

const http = require('http').createServer(rootApp);

rootApp.use(bodyParser.json()); // to support JSON-encoded bodies
rootApp.use(bodyParser.urlencoded({ // to support URL-encoded bodies
	extended: true
}));
// To serve swagger documention
rootApp.use(swaggerConfig.url, swaggerConfig.swaggerUi.serve, swaggerConfig.swaggerUi.setup(swaggerConfig.swaggerDocument));
rootApp.use(cors({
	allowedHeaders: ['sessionId', 'Content-Type'],
	exposedHeaders: ['sessionId'],
	origin: '*',
	methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	preflightContinue: false
}));
rootApp.use(express.static(path.join(__basedir, 'build')));
rootApp.get('/api', (req, res) => {
	res.sendFile(path.join(__basedir, 'build', 'index.html'));
});

module.exports = (eventEmittor, handlers, controllers, config) => (function expressServer() {
	routeServiceProvider(express.Router, eventEmittor).registerRoutes(rootApp, handlers, controllers);
	this.listen = function listenMain(port, callback = () => {}) {
		http.listen(port, (err) => {
			console.log(err || 'app running in ', http.address())
			logger.info(err || 'app running in ', http.address());
			callback(rootApp, http); // for testcases
		});
	};
	return this;
}());

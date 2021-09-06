/**
 * @file Bootstraps the Trading web api application.
 */
/* eslint global-require:0 */
/** @desc load environment configuration into process */
async function configure() {
	const environmentizer = require('./common/environmentizer');

	const obj = environmentizer.config({
		path: process.argv[2]
	});
	// const db = require('./db');
	//* * @desc Retries connection to DB , if not it will fail to load the config in next step */

	// await db.connectDB(process.env.DB_IP, process.env.DB_PORT, process.env.DB_NAME);

	// return 'Configurations loaded!';
	return obj.parsed || {};
}

/**
 * @desc LoadModules loads all require modules for the Trading application
 * Modules:
 * EventEmitter: loosely coupled communcication arch between modules
 * Server.js: ExpressJS wrapper servers REST API
 * Net: Communication layer used to transfer data accross server physincal node servers
 * Scheduler: Helps to run jobs configures in background
 */
function loadModules(config) {
	const eventEmittor = require('./common/eventEmitter');
	const api = require('./api');
	const controllers = require('./controllers');
	const server = require('./core/server')(eventEmittor, api, controllers, config);
	/**
     *This function starts up the server,
     *starts all required modules for routing
     */
	const run = () => {
		/** @desc application bootstrap */
		server.listen(process.env.API_PORT, /* connectionListener */);
	};
	return {
		run
	};
}

async function bootstrap() {
	try {
		const config = await configure();
		await loadModules(config).run();
	} catch (e) {
		console.log(e);
	}
}

// eslint-disable-next-line no-underscore-dangle
global.__basedir = __dirname;
bootstrap();
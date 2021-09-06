const winston = require('winston');

const myLogTransports = [];

if (process.env.DISABLE_LOGGING !== 'true') {
	if (process.env.NODE_ENV === 'production') {
		myLogTransports.push(new (winston.transports.File)({
			level: process.env.LOG_LEVEL || 'silly',
			filename: process.env.PROD_LOG
		}));
	} else {
		myLogTransports.push(new (winston.transports.Console)({
			level: process.env.LOG_LEVEL || 'silly',
			colorize: true
		}));
	}
}

const logger = winston.createLogger({
	transports: myLogTransports
});

const defaultLoggerMethods = {};
Object.keys(logger.levels).forEach((key) => {
	defaultLoggerMethods[key] = logger[key];
});

// This wrapping is to group the logs layerwise
const Logger = function namespaceLogger(namespace, transactionID) {
	const wrapper = {};
	Object.keys(logger.levels).forEach((key) => {
		wrapper[key] = function decoratedLoggerMethod(...args) {
			if (process.env.DISABLE_LOGGING === 'true') {
				return;
			}
			for (let a = 0; a < args.length; a += 1) {
				if (args[a] instanceof Error) {
					/* eslint no-param-reassign:0 */
					args[a].stack = args[a].stack ? args[a].stack.split('\n').join() : '';
				}
			}
			if (typeof namespace !== 'undefined') {
				args.unshift(namespace);
			}
			if (typeof transactionID !== 'undefined') {
				args.unshift(`transactionId: ${transactionID}`);
			}
			args.unshift(new Date().toISOString());

			/* eslint no-console:0 */
			if (process.argv[1].includes('main.js') === false) {
				if (key === 'error') {
					console.error(...args);
				} else {
					console.log(...args);
				}
			} else {
				defaultLoggerMethods[key].call(logger, args);
			}
		};
	});
	return wrapper;
};

// Techincal grouping of Logs
const LOGGER_CONSTANTS = {
	CONTROLLER: 'CONTROLLER_LAYER:',
	API: 'API_LAYER:',
	DB: 'DB_LAYER:',
	SERVER: 'SERVER_LAYER',
	WORKER: 'WORKER',
	SSH: 'SSH',
	JOB: 'JOB'
};

module.exports = {
	Logger,
	LOGGER_CONSTANTS
};
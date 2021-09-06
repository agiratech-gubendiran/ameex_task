const winston = require('winston');
require('winston-daily-rotate-file');

const logPath = process.env.NOTIFICATION_LOG || './log/notification';
const transport = new (winston.transports.DailyRotateFile)({
	filename: `${logPath}-%DATE%.log`,
	datePattern: 'YYYY-MM-DD-HH',
	zippedArchive: true
	// maxSize: '20m',
	// maxFiles: '14d'
});

transport.on('rotate', (oldFilename, newFilename) => {
	// do something fun
	console.log('oldFilename: newFilename: ', oldFilename, newFilename);
});

const logger = winston.createLogger({
	transports: [
		transport
	]
});

module.exports = logger;

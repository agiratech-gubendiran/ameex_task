//* *********************************************/
//* ******* Handle Exceptions of Process first */
//* ********************************************/


const logger = console;
module.exports = (() => {
	// Begin reading from stdin so the process does not exit.
	process.stdin.resume();

	// Using a single function to handle multiple signals
	function exitHandler(options, err) {
		if (options.cleanup) logger.log('clean');
		if (err) logger.log(err.stack);
	}

	// do something when app is closing
	process.on('exit', exitHandler.bind(null, {
		cleanup: true
	}));

	// catches ctrl+c event
	process.on('SIGINT', exitHandler.bind(null, {
		exit: true
	}));
	process.on('SIGTERM', exitHandler.bind(null, {
		exit: true
	}));

	// catches "kill pid" (for example: nodemon restart)
	process.on('SIGUSR1', exitHandler.bind(null, {
		exit: true
	}));
	process.on('SIGUSR2', exitHandler.bind(null, {
		exit: true
	}));

	// catches uncaught exceptions
	process.on('uncaughtException', exitHandler.bind(null, {
		exit: true
	}));

	process.on('unhandledRejection', (reason, p) => {
		logger.info(`ERROR: ${reason} Unhandled Rejection at Promise ${p}`);
	});
});
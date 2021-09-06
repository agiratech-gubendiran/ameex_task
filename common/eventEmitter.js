const EventEmitter = require('events');
// const { logEvent } = require('./../controllers/event');

class Emitter extends EventEmitter {
	emit(eventName, data) {
		// eslint-disable-next-line global-require
		require('./../controllers/event').logEvent(data);
		super.emit(eventName, data);
	}
}

module.exports = new Emitter();
const SUCCESS_MESSAGES = {
	LOGIN_SUCCESSFULL: 'Login successfull'
};

const MESSAGE_CODES = {
	ADD_CLUSTER_NODE_INPROGRESS: 'ADD_CLUSTER_NODE_INPROGRESS'
};
const ERROR_MESSAGES = {
	INVALID_INPUT: 'Invalid payload',
	INVALID_CRON_EXP: 'Invalid scheduling',
	ERROR_IN_ADDING_USER: 'ERROR_IN_ADDING_USER',
	NETWORK_CREATION_FAILED: 'Nework creation failed'
};

const ERROR_CODES = {
	AUTHORIZATION_FAILED: 'AUTHORIZATION_FAILED',
	DB_EXCEPTION_OCCURED: 'DB_EXCEPTION_OCCURED'

};

const CONSTANTS = {
	EMPTY: '',
	UP: 'OK',
	DOWN: 'DOWN',
	MONGO: 'Mongo'
};

const HTTP_RESPONSES = {
	SUCCESS: {
		code: 200,
		message: 'Success'
	},
	CREATED: {
		code: 201,
		message: 'Success'
	},
	ACCEPTED: {
		code: 202,
		message: 'Success'
	},
	AUTHENTICATION_FAILED: {
		code: 401,
		message: 'Authentication failed'
	},
	AUTHORIZATION_FAILED: {
		code: 403,
		message: 'Authorization failed'
	},
	REQUEST_VALIDATION_FAILED: {
		code: 422,
		message: 'Validation failed'
	},
	BAD_REQUEST: {
		code: 400,
		message: 'Validation failed'
	},
	BUSINESS_SERVICES_DOWN: {
		code: 503, // conside 502 bad gateway
		message: 'Service unavailable'
	},
	INTERNAL_SERVER_ERROR: {
		code: 500, // conside 502 bad gateway
		message: 'Internal server error'
	},
	NOT_FOUND: {
		code: 404,
		message: 'Resource not found'
	},
	REQUEST_TIMEDOUT: {
		code: 408,
		message: 'Request timedout'
	}
};
module.exports = {
	ERROR_CODES,
	CONSTANTS,
	SUCCESS_MESSAGES,
	ERROR_MESSAGES,
	HTTP_RESPONSES,
	API_TIMEOUT: 60000 * 2,
	MESSAGE_CODES
};
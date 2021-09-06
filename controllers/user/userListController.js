const {
	SuccessResult,
	FailureResult,
	Logger,
	LOGGER_CONSTANTS: {
		CONTROLLER
	}
} = require('../../common');
const { MODULES: { USER } } = require('./../../constants').DEBUG_CONST;

const UserModel = require('../../models/model');
const deployerServiceProvider = require('../../core/service/externalServiceProvider');
const AuthService = require('./../../core/service/authServiceProvider');


const {
	getCurrentUTCTime,
	getLoggerMessage,
	uuidv4
} = require('./../../common/utils');

module.exports = function getUserListController(context = {}) {
	const logger = Logger(CONTROLLER, context.transactionID);

	const getUserList = async () => {
		logger.info('getUserList calling');
		const userList = await new UserModel('USER').getUserList()
		return new Promise(resolve => resolve(new SuccessResult(userList)));
	};

	const authedicateUser = async (payload) => {
		logger.info('getUserList calling');
		const { username, passowrd } = payload;
		let result = {};
		let status = 'failure';
		let token = '';
		try {
			const user = await new UserModel('USER').getUserByUsername(username);
			if(user) {
				token = AuthService().generateToken(user);
				status = true;
			} else {
				throw new Error('User not found');
			}
		} catch (e) {
			logger.info(`${getLoggerMessage(USER, CONTROLLER, 'authenticateUser', 'error')}`, e);
		}
		result = { token, status};
		return new Promise(resolve => resolve(new SuccessResult(result)));
	};

	const postUserData = (req) => {
		logger.info('postUserData calling');
		const externalServiceUrl = `${process.env.EXTERNAL_SERVICE_API_BASE_URL || 'https://api.nasa.gov/planetary/apod'}?api_key=${process.env.EXTERNAL_SERVICE_API_KEY}`;
		const remoteServiceUrl = `${process.env.REMOTE_SERVICE_API_BASE_URL || 'http://localhost:4000'}/data`;
		const headers = { authorization: req.headers.authorization };
		return deployerServiceProvider().sendRequest(externalServiceUrl, 'get', headers)
			.then(data => {
				return deployerServiceProvider().sendRequest(remoteServiceUrl, 'post', headers, data.result)
			})
			.then(data => new SuccessResult(data))
			.catch(e => new FailureResult(e));
	};

	return {
		getUserList,
		authedicateUser,
		postUserData,
	};
};
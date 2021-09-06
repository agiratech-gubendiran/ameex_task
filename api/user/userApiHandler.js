/*  eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["result"] }] */
const apiConstants = require('../../constants/apiConstants');
const {
	Logger,
	LOGGER_CONSTANTS
} = require('../../common/logger');

const logger = Logger(LOGGER_CONSTANTS.API);
const {
	HTTP_RESPONSES
} = require('../../constants/apiConstants');
const {
	USER_SCHEMA
} = require('./../../schemas');

const {
	AUTHENDICATE_USER,
} = USER_SCHEMA;
/**
 * get list of users record
 * @param {*} userListHandler
 */
const userListHandler = userController => function apiHandler(req, callback) {
	logger.info('get all user');
	userController.getUserList().then((result) => {
		if (result.isSuccess()) {
			callback(apiConstants.CONSTANTS.EMPTY, result, {}, HTTP_RESPONSES.SUCCESS.code);
		} else {
			callback(result.error);
		}
	});
};

const authendicationHandler = userController => function apiHandler(req, callback) {
	const { body } = req;
	logger.info('authendicate user', body);
	userController.authedicateUser(body).then((result) => {
		if (result.isSuccess()) {
			callback(apiConstants.CONSTANTS.EMPTY, result, {}, HTTP_RESPONSES.SUCCESS.code);
		} else {
			callback(result.error);
		}
	});
};

/**
 *  post data
 * @param {*} userListHandler
 */
 const userPostDataHandler = userController => function apiHandler(req, callback) {
	logger.info('post data');
	const { params } = req;
	userController.postUserData(req).then((result) => {
		if (result.isSuccess()) {
			callback(apiConstants.CONSTANTS.EMPTY, result, {}, HTTP_RESPONSES.SUCCESS.code);
		} else {
			callback(result.error);
		}
	});
};

module.exports = {
	routes: [{
		method: 'get',
		apiHandler: userListHandler,
		description: 'Get the list of user',
		path: '/user',
		controller: 'controllers.user.userListController',
		inputs: {}
	},
	{
		method: 'post',
		apiHandler: authendicationHandler,
		description: 'authedicate the user',
		path: '/auth',
		controller: 'controllers.user.userListController',
		inputs: AUTHENDICATE_USER
	},
	{
		method: 'get',
		apiHandler: userPostDataHandler,
		description: 'userPostDataHandler',
		path: '/postData',
		controller: 'controllers.user.userListController',
		inputs: {}
	}]
};
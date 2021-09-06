const jwt = require('jsonwebtoken');
const UserModel = require('./../../models/model');

module.exports = function authServiceProvider() {

	async function getUserByToken(token) {
		const verifyOptions = {
			algorithms: ['HS256'],
		};
		const user = await jwt.verify(token, process.env.JWT_SECRET || "$ecret", verifyOptions, (err, decoded) => {
			if (err) throw new Error('Invalid token!');
			return decoded;
		});
		return user;
	}

	async function authorize(context = {}) {
		const { authToken } = context;
		const token = authToken.split(' ')[1];
		// const token = Buffer.from((authToken.split(' ')[1] || ''), 'base64').toString();
		// const user = await userController(context).getUserByToken(token);

		const user = await getUserByToken(token);

		// console.log('Authorization token: ', authToken);
		return !!user;
	}

	function generateToken(payload) {
		return jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 30 * 24 * 60 * 60 * 1000});
	}

	async function validateUserToken(req, res, next) {
		const verifyOptions = {
			algorithms: ['HS256'],
		};
		const user = await jwt.verify(req.headers?.authorization.split(' ')[1], process.env.JWT_SECRET || "$ecret", verifyOptions, (err, decoded) => {
			if (err) throw new Error('Invalid token!');
			return decoded;
		});
		next();
		// return user;
	}

	return {
		authorize,
		generateToken,
		getUserByToken,
		validateUserToken,
	};
};
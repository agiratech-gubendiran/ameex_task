const axios = require('axios');
const { Logger } = require('../../common');
const { getCurrentUTCTime } = require('../../common/utils');

const ExternalServiceProvider = () => {
	const logger = Logger('ExternalServiceProvider', 'deploy-api-call');
	const sendRequest = async (url, method = 'get', headers = {}, bodyData = {}) => {
		const request = {
			method,
			headers,
			url,
			data: bodyData,
		};
		let response = {
			startTime: getCurrentUTCTime(),
			request
		};
		logger.info('ExternalServiceProvider before api call :: ', request);
		const send = async () => {
			try {
				const { status, data } = await axios(request);
				logger.info('ExternalServiceProvider api result :: ', { status, data });
				response = {
					...response,
					result: data,
					status: !!(status === 200)
				};
				// return result;
			} catch (err) {
				logger.info('ExternalServiceProvider api err :: ', err);
				response = {
					...response,
					error: err,
					status: false
				};
			}
		}
		await send();
		const maxRetry = process.env.API_RETRY && +process.env.API_RETRY > 1 ? +process.env.API_RETRY : 0;
		if(!response.status && maxRetry) {
			for(i=1; i < +maxRetry; i++) {
				await send();
				if(response.status) i = maxRetry;
			}
		}

		response = {
			...response,
			endTime: getCurrentUTCTime()
		};
		return response;
	};

	return {
		sendRequest
	};
};

module.exports = ExternalServiceProvider;

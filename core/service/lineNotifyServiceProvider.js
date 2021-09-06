const LineAPI = require('line-api');

let notify = new LineAPI.Notify({
	token: process.env.LINE_ACCESS_TOKEN
});

module.exports = {
	send: (payload) => {
		const {
			message,
			sticker,
			image
		} = payload || {};
		if (!message && !sticker && !image) {
			console.log('Inavlid payload for LINE app notify');
			return;
		}
		try {
			notify.send(payload);
		// eslint-disable-next-line no-empty
		} catch (e) {}
	},

	resetToken: (token) => {
		process.env.LINE_ACCESS_TOKEN = token;
		notify = new LineAPI.Notify({
			token
		});
	}
};
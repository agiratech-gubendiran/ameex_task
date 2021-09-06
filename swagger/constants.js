const headings = {
	stock: 'Client Management APIs',
	user: 'User Management APIs'
};

const httpResponses = {
	200: {
		description: 'Success'
	},
	400: {
		description: 'Bad Request'
	},
	401: {
		description: 'Un-Authorized'
	},
	403: {
		description: 'Forbidden'
	},
	404: {
		description: 'Not Found'
	},
	500: {
		description: 'Internal server error'
	},
	502: {
		description: 'Bad Gateway'
	},
	504: {
		description: 'Gateway Timeout'
	}
};

module.exports = {
	headings,
	httpResponses
};
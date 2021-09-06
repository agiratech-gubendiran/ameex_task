
const AUTHENDICATE_USER = {
	'in-body': {
		name: 'Body Params',
		schema: {
			required: true,
			type: 'object',
			properties: {
				username: {
					required: true,
					type: 'string',
					maxLength: 50
				},
			}
		}
	}
};


module.exports = {
	AUTHENDICATE_USER,
};
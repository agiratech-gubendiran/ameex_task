const SUCCESS = 'success';
const FAILURE = 'failure';
class Result {
	constructor(status, data, error, meta, code) {
		this.status = status;
		this.data = data;
		this.error = error;
		this.meta = meta;
		this.code = code;

		if (typeof data === 'object') {
			if (typeof data.message !== 'undefined') {
				this.message = data.message;
			}
		}

		if (typeof error === 'object') {
			if (typeof error.message !== 'undefined') {
				this.message = error.message;
				this.error = this.error || {};
				this.error.message = this.error.message || error.message;
			}
		}
	}
	isSuccess() {
		return this.status === SUCCESS;
	}
}
class SuccessResult extends Result {
	constructor(data, meta, code) {
		super(SUCCESS, data, '', meta, code);
	}
}

class FailureResult extends Result {
	constructor(error, meta, code) {
		super(FAILURE, '', error, meta, code);
	}
}
module.exports = {
	SuccessResult,
	FailureResult
};

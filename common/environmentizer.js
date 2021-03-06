const fs = require('fs');

/*
 * Parses a string or buffer into an object
 * @param {(string|Buffer)} src - source to be parsed
 * @returns {Object} keys and values from src
 */
function parse(src) {
	const obj = {};

	// convert Buffers before splitting into lines and processing
	src.toString().split('\n').forEach((line) => {
		// matching "KEY' and 'VAL' in 'KEY=VAL'
		/* eslint no-useless-escape: 0 */
		const keyValueArr = line.match(/^\s*([\w\.\-]+)\s*=\s*(.*)?\s*$/);
		// matched?
		if (keyValueArr !== null) {
			const key = keyValueArr[1];

			// default undefined or missing values to empty string
			let value = keyValueArr[2] || '';

			// expand newlines in quoted values
			const len = value ? value.length : 0;
			if (len > 0 && value.charAt(0) === '"' && value.charAt(len - 1) === '"') {
				value = value.replace(/\\n/gm, '\n');
			}

			// remove any surrounding quotes and extra spaces
			value = value.replace(/(^['"]|['"]$)/g, '').trim();

			obj[key] = value;
		}
	});

	return obj;
}

/*
 * Main entry point into dotenv. Allows configuration before loading .env
 * @param {Object} options - options for parsing .env file
 * @param {string} [options.path=.env] - path to .env file
 * @param {string} [options.encoding=utf8] - encoding of .env file
 * @returns {Object} parsed object or error
 */
function config(options) {
	let path = '.env';
	let encoding = 'utf8';

	if (typeof options !== 'undefined') {
		if (typeof options.path !== 'undefined') {
			path = options.path;
		}
		if (typeof options.encoding !== 'undefined') {
			encoding = options.encoding;
		}
	}

	try {
		// specifying an encoding returns a string instead of a buffer
		const parsedObj = parse(fs.readFileSync(path, {
			encoding
		}));

		Object.keys(parsedObj).forEach((key) => {
			if (typeof process.env[key] === 'undefined') {
				process.env[key] = parsedObj[key];
			}
		});

		return {
			parsed: parsedObj
		};
	} catch (e) {
		return {
			error: e
		};
	}
}

module.exports.config = config;
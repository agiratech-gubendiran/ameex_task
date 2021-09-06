const uuidV4 = require('uuid/v4');
const moment = require('moment-timezone');
const _ = require('lodash');

// helpers is a library of generic helper functions non-specific to axios

const toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
	return toString.call(val) === '[object Array]';
}

/**
 * datetime conversion
 *
 * @param {*} dateTimeStr - datetime value
 * @param {*} timezone
 * @returns
 */
function convertDateTimeByTimeZone(dateTimeStr, timezone) {
	return new Date(moment.tz(dateTimeStr, timezone).toISOString());
}
/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
	return toString.call(val) === '[object ArrayBuffer]';
}
/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
	return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
	return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
	return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
	return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
	return toString.call(val) === '[object Date]';
}

function getCurrentDateString(D) {
	D = isDate(D) ? D : new Date();
	const pad = (num) => {
		const s = `0${num}`;
		return s.substr(s.length - 2);
	};
	return `${D.getFullYear()}/${pad((D.getMonth() + 1))}/${pad(D.getDate())}`;
}


/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
	return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
	return isObject(val) && isFunction(val.pipe);
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
	return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index.js, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
	// Don't bother if no value provided
	if (obj === null || typeof obj === 'undefined') {
		return;
	}

	// Force an array if not already something iterable
	if (typeof obj !== 'object') {
		/* eslint no-param-reassign:0 */
		obj = [obj];
	}

	if (isArray(obj)) {
		// Iterate over array values
		for (let i = 0, l = obj.length; i < l; i += 1) {
			fn.call(null, obj[i], i, obj);
		}
	} else {
		// Iterate over object keys
		/* eslint no-restricted-syntax: ["error", "WithStatement", "BinaryExpression[operator='in']"] */
		for (const key in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, key)) {
				fn.call(null, obj[key], key, obj);
			}
		}
	}
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */ ...args) {
	const result = {};

	function assignValue(val, key) {
		if (typeof result[key] === 'object' && typeof val === 'object') {
			result[key] = merge(result[key], val);
		} else {
			result[key] = val;
		}
	}

	for (let i = 0, l = arguments.length; i < l; i += 1) {
		forEach(args[i], assignValue);
	}
	return result;
}

const getItemIndex = (items, item) => {
	if (items instanceof Array) {
		let i = -1;
		items.forEach((val, index) => {
			i = val === item ? index : i;
		});
		return i;
	}
	return -1;
};

const handleDatabaseResponse = (response, model = 'record', operation = 'updated') => {
	const { result: { ok, n } } = response;
	let report = 'operation failed';
	const status = response.result.ok ? 'successfully' : 'failed';
	if (ok && n) report = `${model} ${operation} ${status}`;
	return report;
};

const getCurrentUTCTime = () => {
	const date = new Date();
	return date.getTime() - (date.getTimezoneOffset() * 60000);
};

const getLoggerMessage = (...arr) => `${arr.join(' ::')} :: `;

const formatMessage = (s, a, b, data) => {
	if (!s || !a || !b || !data) return s;
	let loop = true;
	while (loop) {
		const p = s.indexOf(a) + a.length;
		const midStr = s.substring(p, s.indexOf(b, p));
		if (midStr) {
			const repStr = `${a}${midStr}${b}`;
			s = s.split(repStr).join(_.get(data, midStr, midStr));
			console.log(s);
		} else loop = false;
	}
	return s;
};

module.exports = {
	isArray,
	isArrayBuffer,
	isString,
	isNumber,
	isObject,
	isUndefined,
	isDate,
	getCurrentDateString,
	isFunction,
	isStream,
	forEach,
	merge,
	trim,
	uuidv4: uuidV4,
	/* eslint no-restricted-globals: 0 */
	isNaN,
	getItemIndex,
	convertDateTimeByTimeZone,
	handleDatabaseResponse,
	getCurrentUTCTime,
	getLoggerMessage,
	formatMessage
};
const validator = require('is-my-json-valid');

const noopValidator = () => true;
const noopFilter = data => data;

/**
 *
 * @function validateRequest calls validators populated in routeConfig and returns boolean as validity
 * @param {any} routeConfig
 * @param {any} requestBody
 * @param {any} queryParam
 * @param {any} pathParam
 * @returns
 */
function validateRequest(routeConfig, requestBody, queryParam, pathParam) {
	return routeConfig.validators.validateRequestBody(requestBody) &&
    routeConfig.validators.validatePathParam(pathParam) &&
    routeConfig.validators.validateQueryParam(queryParam);
}

/**
 *
 *
 * @param {any} routeConfig
 * @param {any} requestBody
 * @param {any} queryParam
 * @param {any} pathParam
 * @returns
 */
function filterRequest(routeConfig, request) {
	request.body = routeConfig.filters.filterRequestBody(request.body);
	request.params = routeConfig.filters.filterPathParam(request.params);
	request.query = routeConfig.filters.filterQueryParam(request.query);
}

function loadValidators(routeConfig) {
	/* eslint no-param-reassign: 0 */
	routeConfig.validators = {
		validateRequestBody: routeConfig.inputs && routeConfig.inputs['in-body'] ? validator(routeConfig.inputs['in-body'].schema) : noopValidator,
		validateQueryParam: routeConfig.inputs && routeConfig.inputs['in-query'] ? validator(routeConfig.inputs['in-query'].schema) : noopValidator,
		validatePathParam: routeConfig.inputs && routeConfig.inputs['in-path'] ? validator(routeConfig.inputs['in-path'].schema) : noopValidator
	};
}

function setAdditionalPropertiesFlag(properties) {
	if (!properties) return;
	// properties.additionalProperties = false;
	Object.keys(properties).forEach((key) => {
		if (typeof properties[key] === 'object') {
			if (properties[key].type && ['object', 'array'].indexOf(properties[key].type) > -1) {
				properties[key].additionalProperties = false;
				setAdditionalPropertiesFlag(properties[key]);
			}
		}
	});
}

/**
 *
 *
 * @param {any} routeConfig
 */
function loadFilters(routeConfig) {
	routeConfig.filters = {
		filterRequestBody: noopValidator,
		filterQueryParam: noopValidator,
		filterPathParam: noopValidator
	};
	if (routeConfig.inputs) {
		if (routeConfig.inputs['in-body']) {
			routeConfig.inputs['in-body'].schema.additionalProperties = false;
			setAdditionalPropertiesFlag(routeConfig.inputs['in-body'].schema.properties);
		}
		if (routeConfig.inputs['in-query']) {
			routeConfig.inputs['in-query'].schema.additionalProperties = false;
			setAdditionalPropertiesFlag(routeConfig.inputs['in-query'].schema.properties);
		}
		if (routeConfig.inputs['in-path']) {
			routeConfig.inputs['in-path'].schema.additionalProperties = false;
			setAdditionalPropertiesFlag(routeConfig.inputs['in-path'].schema.properties);
		}

		routeConfig.filters = {
			filterRequestBody: routeConfig.inputs['in-body'] ? validator.filter(routeConfig.inputs['in-body'].schema) : noopFilter,
			filterQueryParam: routeConfig.inputs['in-query'] ? validator.filter(routeConfig.inputs['in-query'].schema) : noopFilter,
			filterPathParam: routeConfig.inputs['in-path'] ? validator.filter(routeConfig.inputs['in-path'].schema) : noopFilter
		};
	}
}

module.exports = {
	validateRequest,
	loadValidators,
	loadFilters,
	filterRequest
};
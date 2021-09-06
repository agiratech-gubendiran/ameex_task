const apiConfig = require('../api');
const fs = require('fs');

const newDir = `${__dirname}/server-api-docs`;
const {
	httpResponses,
	headings
} = require('./constants');
const fileHelper = require('./fileHelper');

//* eslint no-param-reassign:0, one-var:0 */
function JSONstringify(orginalJSON) {
	let json = orginalJSON;
	if (typeof json !== 'string') {
		json = JSON.stringify(json, undefined, '\t');
	}
	const arr = [];
	json = json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
		arr.push('');
		return `${match}`;
	});
	arr.unshift(json);
	return arr.join('\n').trim();
}

function createDocs() {
	console.log('*****************************');
	fs.mkdirSync(newDir);

	const getSwaggerParameters = (routeConfig) => {
		const parameters = [];
		if (typeof routeConfig.inputs['in-body'] !== 'undefined') {
			const config = {
				...{
					in: 'body'
				},
				...routeConfig.inputs['in-body']
			};
			parameters.push(config);
		}
		if (typeof routeConfig.inputs['in-path'] !== 'undefined') {
			Object.keys(routeConfig.inputs['in-path'].schema.properties)
				.forEach((key) => {
					const pathParam = routeConfig.inputs['in-path'].schema.properties[key];
					pathParam.name = pathParam.name || key;
					const config = {
						...{
							in: 'path'
						},
						...pathParam
					};
					parameters.push(config);
				});
		}
		if (typeof routeConfig.inputs['in-query'] !== 'undefined') {
			Object.keys(routeConfig.inputs['in-query'].schema.properties)
				.forEach((key) => {
					const queryParam = routeConfig.inputs['in-query'].schema.properties[key];
					queryParam.name = queryParam.name || key;
					const config = {
						...{
							in: 'query'
						},
						...queryParam
					};
					parameters.push(config);
				});
		}
		return parameters;
	};
	let indexjsImport = '';
	let indexjsImport1 = '';
	let indexjsExport = '\n\nmodule.exports = {';
	Object.keys(apiConfig).forEach((key) => {
		fs.mkdirSync(`${newDir}/${key}`);
		const apidocConfig = {};
		const apidocConfigInComplete = {};
		if (apiConfig[key] && apiConfig[key].routes) {
			apiConfig[key].routes.forEach((route) => {
				const fin = route.path.split('/').map((val) => {
					if (val.includes(':')) {
						return val.replace(':', '{').concat('}');
					}
					return val;
				});
				/* eslint-disable no-param-reassign */
				route.path = `${fin.join('/')}`;
				console.log(key, route.path, route.swaggerStatus);
				apidocConfig[`/${key}${route.path}`] = apidocConfig[`/${key}${route.path}`] || {};
				apidocConfig[`/${key}${route.path}`][route.method] = {
					// tags: [
					//   route.swaggerStatus + headings[key] || key
					// ],
					tags: [
						headings[key] || key
					],
					security: [{
						authentication: []
					}],
					summary: route.description,
					description: route.description,
					parameters: typeof route.inputs !== 'undefined' ? getSwaggerParameters(route) : [],
					responses: httpResponses
				};
			});
		}
		const keyname = key.split('-').join('');
		// fs.writeFileSync(`${newDir}/${key}/${key}_api_doc.js`, `module.exports=${JSONstringify(apidocConfig)}`);
		fs.writeFileSync(`${newDir}/${key}/${key}_api_doc.json`, `${JSONstringify(apidocConfig)}`);
		fs.writeFileSync(`${newDir}/${key}/${key}_api_doc1.json`, `${JSONstringify(apidocConfigInComplete)}`);
		indexjsImport = `${indexjsImport} \nconst ${keyname} = require('./${key}/${key}_api_doc.json');`;
		indexjsImport1 = `${indexjsImport1} \nconst incomplete${keyname} = require('./${key}/${key}_api_doc1.json');`;
		indexjsExport += `\n ...${keyname},`;
		// indexjsExport += `\n ...incomplete${keyname},`;
	});
	indexjsExport += '\n };';
	fs.writeFileSync(`${newDir}/index.js`, `${indexjsImport}\n${indexjsImport1}\n${indexjsExport}`);
}

fileHelper.deleteDirectory(newDir).then(createDocs, createDocs);
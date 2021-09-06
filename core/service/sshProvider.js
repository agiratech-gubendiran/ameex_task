
/* eslint-disable no-return-await */
// const path = require('path');
const SSH = require('node-ssh');

const {
	Logger,
	LOGGER_CONSTANTS
} = require('../../common');

const logger = Logger(LOGGER_CONSTANTS.SSH);

async function executeCmds(opts, cmds = []) {
	let result;
	if (!opts || !Array.isArray(cmds) || cmds.length === 0) return result;
	const ssh = new SSH();
	async function runCmd(cmd) {
		return await ssh.execCommand(cmd);
	}
	result = await ssh.connect(opts)
		.then(async () => {
			const res = {};
			// eslint-disable-next-line no-restricted-syntax
			for (const cmd of cmds) {
				// eslint-disable-next-line no-await-in-loop
				res[cmd] = await runCmd(cmd);
			}
			ssh.dispose();
			return res;
		})
		.catch((err) => { logger.info(`ERROR: ${err}`); throw err; });
	return result;
}

async function exeecuteCommand(opts, cmds = [], params = {}) {
	let result;
	if (!opts || !Array.isArray(cmds) || cmds.length === 0) return result;
	const ssh = new SSH();
	async function runCmd(cmd) {
		return await ssh.execCommand(cmd, params);
	}
	result = await ssh.connect(opts)
		.then(async () => {
			const res = {};
			// eslint-disable-next-line no-restricted-syntax
			for (const cmd of cmds) {
				// eslint-disable-next-line no-await-in-loop
				res[cmd] = await runCmd(cmd);
			}
			ssh.dispose();
			return res;
		})
		.catch((err) => {
			logger.info(`ERROR: ${err}`);
			throw err;
		});
	return result;
}


async function uploadFile(opts, localPath, remotePath) {
	let result;
	if (!opts || !localPath || !remotePath) return result;
	const ssh = new SSH();
	async function upload(source, destination) {
		return await ssh.putFile(source, destination).then(() => true, (error) => {
			logger.info(`ERROR: ${error}`);
			throw error;
		});
	}
	result = await ssh.connect(opts)
		.then(async () => {
			const res = await upload(localPath, remotePath);
			ssh.dispose();
			return res;
		})
		.catch((er) => {
			ssh.dispose();
			throw er;
		});
	return result;
}

async function downloadFile(opts, localPath, remotePath) {
	let result;
	if (!opts || !localPath || !remotePath) return result;
	const ssh = new SSH();
	async function download(source, destination) {
		return await ssh.getFile(source, destination).then(() => true, (err) => {
			logger.info(`ERROR: ${err}`);
			throw err;
		});
	}
	result = await ssh.connect(opts)
		.then(async () => {
			const res = await download(localPath, remotePath);
			ssh.dispose();
			return res;
		})
		.catch((er) => {
			ssh.dispose();
			throw er;
		});
	return result;
}


// [{ local: localpath, remote: remotePath }]
function uploadMultipleFiles(opts, filesPathObj) {
	let result;
	if (!opts || !filesPathObj) return result;
	const ssh = new SSH();
	async function upload(obj) {
		return await ssh.putFiles(obj).then(() => true, (error) => {
			throw error;
		});
	}
	ssh.connect(opts)
		.then(async () => {
			const res = await upload(filesPathObj);
			ssh.dispose();
			return res;
		})
		.catch((e) => {
			ssh.dispose();
			console.log('e: ', e);
		});
	return result;
}

// const options = {
//   host: '10.10.80.76',
//   username: 'test',
//   password: '8888',
//   port: 22
// };
// executeCmds(options, ['pwd', 'ls']).then(res => console.log('executeCmds: ', res));
// uploadFile(options, path.join(__dirname, './package.json'), '/home/test/ssh_upload1/package.json')
// 	.then(res => console.log('uploadFile: ', res))
// 	.catch((e) => {
// 		console.log('catch: ', e);
// 	});

// downloadFile(options, path.join(__dirname, './package1.json'), 'home/test/ssh_upload1/package.json')
// 	.then(res => console.log('uploadFile: ', res))
// 	.catch((e) => {
// 		console.log('catch: ', e);
// 	});

module.exports = {
	executeCmds,
	uploadFile,
	downloadFile,
	uploadMultipleFiles
};
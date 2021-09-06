const fs = require('fs');
const path = require('path');

/* eslint no-use-before-define:0 */
function deleteDirectory(dir) {
	return new Promise(((resolve, reject) => {
		fs.access(dir, (error) => {
			if (error) {
				return reject(error);
			}
			fs.readdir(dir, (err, files) => {
				if (err) {
					return reject(err);
				}
				Promise.all(files.map(file => deleteFile(dir, file))).then(() => {
					fs.rmdir(dir, (err1) => {
						if (err1) {
							return reject(err1);
						}
						resolve();
					});
				}).catch(reject);
			});
		});
	}));
}

/* eslint consistent-return:0 */
function deleteFile(dir, file) {
	return new Promise(((resolve, reject) => {
		const filePath = path.join(dir, file);
		fs.lstat(filePath, (err, stats) => {
			if (err) {
				return reject(err);
			}
			if (stats.isDirectory()) {
				resolve(deleteDirectory(filePath));
			} else {
				fs.unlink(filePath, (err2) => {
					if (err2) {
						return reject(err2);
					}
					resolve();
				});
			}
		});
	}));
}

module.exports = {
	deleteDirectory,
	deleteFile
};
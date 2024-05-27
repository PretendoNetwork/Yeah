const fs = require('fs');
const path = require('path');
const glob = require('glob');
const package = require('./package.json');

const distDir = path.resolve(__dirname, 'dist');

function createExport(file) {
	const relativePath = path.relative(distDir, file);
	const importPath = `./dist/${relativePath.replace(/\\/g, '/')}`;
	let exportKey = `./${relativePath.replace(/\\/g, '/').replace(/\.js$/, '')}`;

	if (exportKey.endsWith('/index')) {
		exportKey = exportKey.split('/').slice(0, -1).join('/');
	}

	return {
		[exportKey]: {
			'import': importPath,
			'require': importPath,
			'types': importPath.replace(/\.js$/, '.d.ts')
		}
	};
};

const jsFiles = glob.sync(`${distDir}/**/*.js`);
const exportsField = jsFiles.reduce((acc, file) => {
	return {
		...acc,
		...createExport(file)
	};
}, {});

package.exports = exportsField;

fs.writeFileSync('./package.json', JSON.stringify(package, null, '\t'));
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

let config = {
	mode: 'production',
	devtool: false,
	entry: {
		options:    './src/options.js',
		popup:      './src/popup.js',
		background: './src/background.js',
		content:    './src/content.js',
		
	},
	optimization: {
		minimize: true,
	},
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'app/scripts'),
	},
	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: 'node_modules/webextension-polyfill/dist/browser-polyfill.js',
					to: path.resolve(__dirname, 'app/lib'),
				},
			],
		})
	]
};

module.exports = (env, argv) => {
	if (argv.mode === 'development') {
		config.optimization.minimize = false;
		config.mode = 'production';
	}

	if (argv.mode === 'production') {
		config.optimization.minimize = true;
		config.mode = 'production';
	}

	return config;
};
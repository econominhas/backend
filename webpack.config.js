/* eslint-disable @typescript-eslint/no-var-requires */

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { join } = require('path');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	entry: './src/main.ts',
	optimization: {
		minimize: false,
	},
	target: 'node',
	mode: isProduction ? 'production' : 'development',
	devtool: isProduction ? false : 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				options: {
					transpileOnly: true,
				},
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.ts'],
		plugins: [new TsconfigPathsPlugin()],
	},
	output: {
		path: join(__dirname, 'dist'),
		filename: 'main.js',
	},
};

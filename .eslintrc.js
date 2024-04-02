/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */

module.exports = {
	root: true,
	extends: [
		"@econominhas",
		"@econominhas/eslint-config/typescript",
		"@econominhas/eslint-config/jest",
	],
	parserOptions: {
		project: "tsconfig.lint.json",
	},
	settings: {
		jest: {
			version: require("jest/package.json").version,
		},
	},
};

module.exports = {
	root: true,
	extends: [
		"../../OpenSource/eslint/dist/index.js",
		"../../OpenSource/eslint/dist/typescript.js",
	],
	parserOptions: { tsconfigRootDir: __dirname },
};

module.exports = {
	clean: [
		`rm -rf lib`
	],
	compile: [
		`tsc -d --outDir lib`
	],
	prepack: [
		'@clean',
		'@compile'
	]
};
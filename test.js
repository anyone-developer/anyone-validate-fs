const avfs = require('./src/avfs.js');

avfs.setRenderLayout('vertical').diff(
	'./sample_folder',
	'{a,b/{ba1,ba2,bb1,bb2},c,d}/{a.qa.config,b.prd.config}',
	'README.md',
	'.git'
).then(resolve => {
	console.info(resolve.diff);
}, error => {
	if (error && error.diff) {
		console.error(`${error.diff}`);
	}
});


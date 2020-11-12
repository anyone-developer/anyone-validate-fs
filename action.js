const core = require('@actions/core');
const avfs = require('./src/avfs.js');

avfs.setRenderLayout(core.getInput('render-layout')).diff(
	core.getInput('read-path'),
	core.getInput('brace-expansion'),
	core.getInput('ignore-files'),
	core.getInput('ignore-directories')
).then(resolve => {
	this.exitCode = core.ExitCode.Success;
	core.info(resolve.diff);
	core.setOutput('output', resolve.diff);
}, error => {
	this.exitCode = core.ExitCode.Failure;
	if (error && error.diff) {
		core.setFailed(`${error.diff}`);
	}
});

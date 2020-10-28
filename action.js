const core = require('@actions/core');
const github = require('@actions/github');
const { avfs } = require("./src/avfs.js");

global.logger = core;
avfs.setRenderLayout(core.getInput('render-layout')).diff(
  core.getInput('read-path'),
  core.getInput('brace-expansion'),
  core.getInput('ignore-files'),
  core.getInput('ignore-directories')
).then((resolve) => {
  this.exitCode = core.ExitCode.Success;
  global.logger.info(resolve.diff);
  return resolve.diff;
}, (reject) => {
  this.exitCode = core.ExitCode.Failure;
  if (reject.type && reject.message) {
    global.logger.setFailed(`type: ${reject.type} error message: ${reject.message}`);
  }
  global.logger.error(reject.diff);
  return reject.diff;
}).then((output) => {
  global.logger.setOutput(output);
});

return this.exitCode;
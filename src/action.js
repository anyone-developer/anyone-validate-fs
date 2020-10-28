const core = require('@actions/core');
const github = require('@actions/github');
const { avfs } = require("./avfs.js");

global.logger = core;
avfs.setRenderLayout("vertical").diff(
  core.getInput('read-path'),
  core.getInput('brace-expansion'),
  core.getInput('ignore-files'),
  core.getInput('ignore-directories')
).then((resolve) => {
  global.logger.info(resolve.diff);
  return resolve.diff;
}, (reject) => {
  if (reject.type && reject.message) {
    global.logger.setFailed(`type: ${reject.type} error message: ${reject.message}`);
  }
  global.logger.error(reject.diff);
  return reject.diff;
}).then((output) => {
  global.logger.setOutput(output);
});

module.exports = avfs;
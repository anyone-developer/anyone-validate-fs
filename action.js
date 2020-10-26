const core = require('@actions/core');
const github = require('@actions/github');
const avfs = require("./src/avfs.js");
const chalk = require('chalk');

global.logger = core;
let output = "";
avfs().then((resolve) => {
  output = `expect: ${resolve.expectCount} match/unmatch: ${resolve.matchCount}/${resolve.unmatchCount}`;
  core.info(chalk.green.bgYellow.bold(output));
}, (reject) => {
  output = `expect: ${resolve.expectCount} match/unmatch: ${resolve.matchCount}/${resolve.unmatchCount}`;
  core.error(chalk.red.bgYellow.bold(output));
  core.setFailed(`error message: ${reject.message}`);
}).then(() => {
  core.setOutput(output);
});

module.exports = avfs;
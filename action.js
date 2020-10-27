const core = require('@actions/core');
const github = require('@actions/github');
const avfs = require("./src/avfs.js");
const chalk = require('chalk');

global.logger = core;
let output = "";
avfs().then((resolve) => {
  output = `expect/match/unmatch: ${resolve.expectCount}/${resolve.matchCount}/${resolve.unmatchCount}`;
  core.info(chalk.green.bgYellow.bold(output));
}, (reject) => {
  if (reject.type) {
    core.error(chalk.red.bgYellow.bold(output));
    core.setFailed(`error message: ${reject.message}`);
  }
  else {
    output = `expect/match/unmatch: ${reject.expectCount}/${reject.matchCount}/${reject.unmatchCount}`;
    console.info(chalk.red.bgYellow.bold(output));
  }
}).then(() => {
  core.setOutput(output);
});

module.exports = avfs;
const avfs = require("./avfs.js");
const chalk = require('chalk');

let output = "";
avfs().then((resolve) => {
  output = `expect/match/unmatch: ${resolve.expectCount}/${resolve.matchCount}/${resolve.unmatchCount}`;
  console.info(chalk.green.bgYellow.bold(output));
}, (reject) => {
  if (reject.type) {
    console.error(chalk.red.bgYellow.bold(output));
    console.error(`error message: ${reject.message}`);
  }
  else {
    output = `expect/match/unmatch: ${reject.expectCount}/${reject.matchCount}/${reject.unmatchCount}`;
    console.info(chalk.red.bgYellow.bold(output));
  }
});

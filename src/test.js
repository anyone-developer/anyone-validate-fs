const avfs = require("./avfs.js");
const chalk = require('chalk');

let output = "";
avfs().then((resolve) => {
  output = `expect: ${resolve.expectCount} match/unmatch: ${resolve.matchCount}/${resolve.unmatchCount}`;
  console.info(chalk.green.bgYellow.bold(output));
}, (reject) => {
  if (reject.type) {
    console.error(chalk.red.bgYellow.bold(output));
    console.error(`error message: ${reject.message}`);
  }
  else {
    output = `expect: ${reject.expectCount} match/unmatch: ${reject.matchCount}/${reject.unmatchCount}`;
    console.info(chalk.red.bgYellow.bold(output));
  }
});

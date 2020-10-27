import arg from 'args';
import avfs from "./avfs";
import chalk from 'chalk';

function parseArgumentsIntoOptions(rawArgs) {
  arg
    .option('brace-expansion', '[Required] brace-expansion of expected directory structure.')
    .option('ignore-files', 'the files you want to ignore. split with comma.')
    .option('ignore-directories', 'the directories you want to ignore. split with comma.')
    .option('read-path', 'the path that you assign to read.');

  return arg.parse(rawArgs);
}

export function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  if (options.braceExpansion) {
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
  }
  else {
    arg.showHelp();
  }
}
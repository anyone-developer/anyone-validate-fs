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
      output = `expect: ${resolve.expectCount} match/unmatch: ${resolve.matchCount}/${resolve.unmatchCount}`;
      console.info(chalk.green.bgYellow.bold(output));
    }, (reject) => {
      output = `expect: ${resolve.expectCount} match/unmatch: ${resolve.matchCount}/${resolve.unmatchCount}`;
      console.error(chalk.red.bgYellow.bold(output));
      console.error(`error message: ${reject.message}`);
    });
  }
  else {
    arg.showHelp();
  }
}
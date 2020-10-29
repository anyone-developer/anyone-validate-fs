import arg from 'args';
import {avfs} from './avfs';

function parseArgumentsIntoOptions(rawArgs) {
  arg
    .option('brace-expansion', '[Required] brace-expansion of expected directory structure.')
    .option('ignore-files', 'the files you want to ignore. split with comma.')
    .option('ignore-directories', 'the directories you want to ignore. split with comma.')
    .option('read-path', 'the path that you assign to read.')
    .option('render-layout', 'render diff result with \'vertical\' or \'horizontal\'');

  return arg.parse(rawArgs);
}

export function cli(args) {
  const options = parseArgumentsIntoOptions(args);
  if (options.braceExpansion) {
    avfs.setRenderLayout(options.renderLayout).diff(
      options.readPath,
      options.braceExpansion,
      options.ignoreFiles,
      options.ignoreDirectories
    ).then(resolve => {
      console.info(resolve.diff);
    }, error => {
      if (error.name && error.message) {
        console.setFailed(`name: ${error.name} error message: ${error.message}`);
      }
    });
  } else {
    arg.showHelp();
  }
}

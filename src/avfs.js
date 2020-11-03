const braces = require('braces');
const fs = require('fs');
const path = require('path');
const rrdir = require('rrdir');
const chalk = require('chalk');
const treeify = require('treeify');
const Table = require('tty-table');
const rdiff = require('recursive-diff');

this.logger = global.logger ? global.logger : console;

function * diffRows(object) {
  for (const prop of Object.keys(object)) {
    switch (prop) {
      case 'op':
        yield object[prop];
        break;
      case 'path':
        yield object[prop].join('->');
        break;
      case 'val':
        yield chalk.magentaBright(treeify.asTree(object[prop]));
        break;
      default:
        break;
    }
  }
}

function getNextPath(p) {
  return p.split(path.sep).slice(1).join(path.sep);
}

function getNextLevelPath(p) {
  const paths = p.split(path.sep);
  if (paths.length > 1) {
    return paths.slice(1).join(path.sep);
  }

  return null;
}

function getTopLevelPath(p) {
  return p.split(path.sep)[0];
}

function getTreeNode(array) {
  const object = {};
  for (const a of array) {
    const top = getTopLevelPath(a);
    const next = getNextLevelPath(a);
    if (!next) {
      object[top] = 'file';
      continue;
    }

    const subArray = array.filter(i => i.startsWith(top)).map(i => getNextLevelPath(i));
    if (!Object.prototype.hasOwnProperty.call(object, top)) {
      object[top] = {...getTreeNode(subArray)};
    }
  }

  return object;
}

module.exports.diff = function (readPath, expansion, ignoreFiles, ignoreDirectories) {
  return new Promise((resolve, reject) => {
    try {
      if (!expansion) {
        this.logger.error(chalk.red('param \'brace-expansion\' is required'));
        reject(new Error('param \'brace-expansion\' is required'));
        return;
      }

      readPath = path.normalize(readPath);
      const ignoreFilesArray = ignoreFiles ? ignoreFiles.split(',').map(i => path.normalize(readPath + path.sep + i)) : [];
      const ignoreDirectoriesArray = ignoreDirectories ? ignoreDirectories.split(',').map(i => path.normalize(readPath + path.sep + i)) : [];

      const expectStructure = braces(expansion, {expand: true}).map(i => {
        return path.normalize(i);
      });

      const expectTree = getTreeNode(expectStructure);

      const expectTreeHeader = chalk.blueBright.bgYellowBright.bold('[Expect]');
      const expectTreeSubHeader = chalk.blueBright.bold('brace-expansion');
      const expectTreeContent = chalk.blue(treeify.asTree(expectTree));

      if (!fs.existsSync(readPath)) {
        this.logger.error(chalk.red('the path: ' + readPath + ' was not existed'));
        reject(new Error('the path: ' + readPath + ' was not existed'));
        return;
      }

      let actualPath = rrdir.sync(readPath, {
        exclude: [...ignoreDirectoriesArray, ...ignoreFilesArray],
        strict: true
      });
      actualPath = actualPath.map(i => {
        const p = path.normalize(i.path).slice(readPath.length);

        return {
          path: getNextPath(path.normalize(p)),
          directory: i.directory,
          symlink: i.symlink
        };
      }).filter(i => !i.directory);
      actualPath = [...actualPath.map(i => i.path)];
      const actualTree = getTreeNode(actualPath);
      const actualTreeHeader = chalk.greenBright.bgYellowBright.bold('[Actual]');
      const actualTreeSubHeader = chalk.greenBright.bold('under: ' + readPath);
      const actualTreeContent = chalk.green(treeify.asTree(actualTree));

      this.delta = rdiff.getDiff(actualTree, expectTree);

      const tableDelta = this.delta.map(i => {
        const keys = Object.keys(i);
        if (!keys.includes('val')) {
          i.val = '';
        }

        return Array.from(diffRows(i));
      });

      const diffTreeHeader = chalk.redBright.bgYellowBright.bold('[Diff]');
      const diffTreeSubHeader = chalk.redBright.bold('[Expect] diff with [Actual]');
      const diffTreeContent = new Table([
        {
          value: '[Action]'
        },
        {
          value: '[Path]'
        },
        {
          value: '[Structure]'
        }
      ],
      tableDelta,
      {
        borderStyle: 'dashed',
        borderColor: 'gray',
        headerAlign: 'center',
        align: 'left',
        color: 'red'
      }).render();

      if (this.layout === 'vertical') {
        let out = new Table([
          {value: actualTreeHeader}
        ],
        [
          [actualTreeSubHeader],
          [actualTreeContent]
        ],
        {
          borderStyle: 'solid',
          borderColor: 'gray',
          headerAlign: 'center',
          align: 'left',
          color: 'white',
          width: '100%'
        }).render();
        this.logger.log(out);

        out = new Table([
          {value: expectTreeHeader}
        ],
        [
          [expectTreeSubHeader],
          [expectTreeContent]
        ],
        {
          borderStyle: 'solid',
          borderColor: 'gray',
          headerAlign: 'center',
          align: 'left',
          color: 'white',
          width: '100%'
        }).render();
        this.logger.log(out);

        out = new Table([
          {value: diffTreeHeader}
        ],
        [
          [diffTreeSubHeader],
          [diffTreeContent]
        ],
        {
          borderStyle: 'solid',
          borderColor: 'gray',
          headerAlign: 'center',
          align: 'left',
          color: 'white',
          width: '100%'
        }).render();
        this.logger.log(out);
      } else {
        const out = new Table([
          {value: actualTreeHeader},
          {value: expectTreeHeader},
          {value: diffTreeHeader}
        ],
        [
          [actualTreeSubHeader, expectTreeSubHeader, diffTreeSubHeader],
          [actualTreeContent, expectTreeContent, diffTreeContent]
        ],
        {
          borderStyle: 'solid',
          borderColor: 'gray',
          headerAlign: 'center',
          align: 'left',
          color: 'white',
          width: '100%'
        }).render();

        this.logger.log(out);
      }
    } catch (error) {
      this.logger.error(chalk.red(error.message));
      reject(error);
    } finally {
      if (this.delta && this.delta.length > 0) {
        reject(new Error(JSON.stringify(this.delta)));
      } else {
        resolve({
          diff: chalk.greenBright.bgYellowBright('[success] file structures are all matched!')
        });
      }
    }
  });
};

module.exports.setRenderLayout = function (layout) {
  this.layout = layout;
  return module.exports;
};

module.exports.avfs = module.exports;

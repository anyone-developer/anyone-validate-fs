const braces = require('braces');
const fs = require('fs');
const path = require('path');
const rrdir = require('rrdir');
const chalk = require('chalk');
const treeify = require('treeify');
const Table = require('tty-table');
const rdiff = require('recursive-diff');
const hash = require('object-hash');

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
  return p ? p.split(path.sep).slice(1).join(path.sep) : '';
}

function getNextLevelPath(p) {
  const paths = p ? p.split(path.sep) : '';
  if (paths && paths.length > 1) {
    return paths.slice(1).join(path.sep);
  }

  return null;
}

function getTopLevelPath(p) {
  const paths = p.split(path.sep);
  return paths.length > 1 ? paths[0] : '';
}

function getTreeNode(array) {
  const object = {};
  let da = array.map(i => {
    const top = getTopLevelPath(i);
    return {
      path: top ? top : i,
      directory: Boolean(top)
    };
  });
  da = distinct(da);
  for (const a of da) {
    if (!a.directory) {
      object[a.path] = 'file';
      continue;
    }

    const subArray = array.filter(i => i && getNextLevelPath(i) && i.split(path.sep)[0] === a.path).map(i => getNextLevelPath(i));
    if (a.directory && !Object.prototype.hasOwnProperty.call(object, a.path)) {
      object[a.path] = {...getTreeNode(subArray)};
    }
  }

  return object;
}

function distinct(a) {
  const array = a.concat(a);
  const result = [];
  const object = {};

  for (const i of array) {
    const index = hash(i);
    if (!object[index]) {
      result.push(i);
      object[index] = 1;
    }
  }

  return result;
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
        strict: true,
        match: {
          dot: false
        }
      });
      actualPath = actualPath.map(i => {
        let p = '';
        if (readPath === '.' || readPath === './' || readPath === '.\\') {
          p = path.normalize(i.path);
        } else {
          p = path.normalize(i.path).slice(readPath.length);
          p = getNextPath(p);
        }

        return {
          path: p,
          directory: i.directory,
          symlink: i.symlink
        };
      }).filter(i => !i.directory);
      actualPath = [...actualPath.map(i => i.path).filter(i => i)];
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
      this.logger.error(chalk.red(error.stack));
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

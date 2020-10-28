const braces = require('braces');
const fs = require('fs');
const path = require('path');
const rrdir = require('rrdir');
const chalk = require('chalk');
const treeify = require('treeify');
const Table = require('tty-table');
const rdiff = require('recursive-diff');

this.logger = global.logger ? global.logger : console;

function getNextPath(p) {
  return p.split(path.sep).slice(1).join(path.sep);
}

function getNextLevelPath(path) {
  let paths = path.split(path.sep);
  if (paths.length > 1) {
    return paths.slice(1).join(path.sep);
  }
  return null;
}

function getTopLevelPath(path) {
  return path.split(path.sep)[0];
}

function getTreeNode(array) {
  let object = {};
  for (const a of array) {
    const top = getTopLevelPath(a);
    const next = getNextLevelPath(a);
    if (!next) {
      object[top] = "file";
      continue;
    }
    const subArray = array.filter(i => i.startsWith(top)).map(i => getNextLevelPath(i));
    if (!object.hasOwnProperty(top)) {
      object[top] = { ...getTreeNode(subArray) };
    }
  }
  return object;
}

module.exports.diff = function (readPath, expansion, ignoreFiles, ignoreDirectories) {
  return new Promise((resolve, reject) => {
    try {
      if (!expansion) {
        this.logger.error(chalk.red("param 'brace-expansion' is required"));
        reject({
          type: "insufficient param",
          message: "param 'brace-expansion' is required"
        });
        return;
      }

      readPath = path.normalize(readPath);
      const ignoreFilesArray = ignoreFiles.split(',').map(i => path.normalize(readPath + path.sep + i));
      const ignoreDirectoriesArray = ignoreDirectories.split(',').map(i => path.normalize(readPath + path.sep + i));

      const expectStructure = braces(expansion, { expand: true }).map(i => {
        return path.normalize(i);
      });

      const expectTree = getTreeNode(expectStructure);

      const expectTreeHeader = chalk.blueBright.bgYellowBright.bold("[Expect]");
      const expectTreeSubHeader = chalk.blueBright.bold("brace-expansion");
      const expectTreeContent = chalk.blue(treeify.asTree(expectTree));

      if (!fs.existsSync(readPath)) {
        this.logger.error(chalk.red("the path: " + readPath + " was not existed"));
        reject({
          type: "insufficient param",
          message: "the path: " + readPath + " was not existed"
        });
        return;
      }

      let actualPath = rrdir.sync(readPath, {
        exclude: [...ignoreDirectoriesArray, ...ignoreFilesArray],
        strict: true
      });
      actualPath = actualPath.map(i => {
        return {
          path: getNextPath(path.normalize(i.path)),
          directory: i.directory,
          symlink: i.symlink
        }
      });
      actualPath = actualPath.filter(i => !i.directory);
      actualPath = [...actualPath.map(i => i.path)];
      const actualTree = getTreeNode(actualPath);
      const actualTreeHeader = chalk.greenBright.bgYellowBright.bold("[Actual]");
      const actualTreeSubHeader = chalk.greenBright.bold("under: " + readPath);
      const actualTreeContent = chalk.green(treeify.asTree(actualTree));

      this.delta = rdiff.getDiff(actualTree, expectTree);
      function* diffRows(obj) {
        for (let prop of Object.keys(obj)) {
          switch (prop) {
            case "op":
              yield obj[prop];
              break;
            case "path":
              yield obj[prop].join("->");
              break;
            case "val":
              yield chalk.magentaBright(treeify.asTree(obj[prop]));
              break;
          }
        }
      }

      const tableDelta = this.delta.map(i => {
        const keys = Object.keys(i);
        if (!keys.includes("val"))
          i.val = "";
        return Array.from(diffRows(i));
      });

      const diffTreeHeader = chalk.redBright.bgYellowBright.bold("[Diff]");
      const diffTreeSubHeader = chalk.redBright.bold("[Expect] diff with [Actual]");
      const diffTreeContent = Table([
        {
          value: "[Action]"
        },
        {
          value: "[Path]"
        },
        {
          value: "[Structure]"
        }
      ],
        tableDelta,
        {
          borderStyle: "dashed",
          borderColor: "gray",
          headerAlign: "center",
          align: "left",
          color: "red"
        }).render();

      if (this.layout == "vertical") {
        let out = Table([
          { value: actualTreeHeader }
        ],
          [
            [actualTreeSubHeader],
            [actualTreeContent]
          ],
          {
            borderStyle: "solid",
            borderColor: "gray",
            headerAlign: "center",
            align: "left",
            color: "white",
            width: "100%"
          }).render();
        this.logger.log(out);

        out = Table([
          { value: expectTreeHeader }
        ],
          [
            [expectTreeSubHeader],
            [expectTreeContent]
          ],
          {
            borderStyle: "solid",
            borderColor: "gray",
            headerAlign: "center",
            align: "left",
            color: "white",
            width: "100%"
          }).render();
        this.logger.log(out);

        out = Table([
          { value: diffTreeHeader }
        ],
          [
            [diffTreeSubHeader],
            [diffTreeContent]
          ],
          {
            borderStyle: "solid",
            borderColor: "gray",
            headerAlign: "center",
            align: "left",
            color: "white",
            width: "100%"
          }).render();
        this.logger.log(out);
      }
      else {
        const out = Table([
          { value: actualTreeHeader },
          { value: expectTreeHeader },
          { value: diffTreeHeader }],
          [
            [actualTreeSubHeader, expectTreeSubHeader, diffTreeSubHeader],
            [actualTreeContent, expectTreeContent, diffTreeContent],
          ],
          {
            borderStyle: "solid",
            borderColor: "gray",
            headerAlign: "center",
            align: "left",
            color: "white",
            width: "100%"
          }).render();

        this.logger.log(out);
      }
    } catch (error) {
      this.logger.error(chalk.red(error.message));
      reject({
        type: error,
        message: error.message
      });
    } finally {
      if (this.delta) {
        reject({
          diff: JSON.stringify(this.delta)
        });
      }
      else {
        resolve({
          diff: this.data
        });
      }
    }
  });
}

module.exports.setRenderLayout = function (layout) {
  this.layout = layout;
  return module.exports;
}

module.exports.avfs = module.exports;
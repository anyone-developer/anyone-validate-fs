const braces = require('braces');
const fs = require('fs');
const path = require('path');
const rrdir = require('rrdir');
const chalk = require('chalk');
let directoryPath = [];
let actualPath = [];
let expectCount = 0;
let matchCount = 0;
let unmatchCount = 0;
let logger = global.logger ? global.logger : console;

function belongToIgnoreDirectory(entry) {
  for (const dp of directoryPath) {
    if (entry.path.startsWith(dp)) {
      logger.info(chalk.gray("the " + (entry.directory ? "directory" : "file") + ": " + path.basename(entry.path) + " belong to ignored directory: " + path.dirname(entry.path)));
      return true;
    }
  }
  return false;
}

function oneOfItemEndsWithPath(path, array) {
  for (const e of array) {
    if (e == path || path.endsWith(e)) {
      logger.info(chalk.green("matching FROM: " + path + " TO: " + e));
      array.push(path);
      return true;
    }
  }
  return false;
}

function getAllExpectedPathRecursively(array) {
  const next = [...new Set(array.map(i => path.dirname(i)))].filter(i => i != ".");
  if (next.length <= 0)
    return [...array];
  return [...array, ...getAllExpectedPathRecursively(next)];
}

const avfs = function (
  readPath = './sample_folder',
  expansion = '{a,b/{ba1,ba2,bb1,bb2},c,d}/{a.qa.config,b.prd.config}',
  ignoreFiles = ["README.md"],
  ignoreDirectories = [".git"]) {
  return new Promise((resolve, reject) => {
    try {
      if (!expansion) {
        logger.error(chalk.red("param 'brace-expansion' is required"));
        reject({
          type: "insufficient param",
          message: "param 'brace-expansion' is required"
        });
        return;
      }
      let expectStructure = braces(expansion, { expand: true });

      expectStructure = getAllExpectedPathRecursively(expectStructure);

      for (const p of expectStructure) {
        expectCount++;
        logger.info(chalk.blue("expected path: " + p));
      }

      const validatePath = readPath;
      if (!fs.existsSync(validatePath)) {
        logger.error(chalk.red("the path: " + validatePath + " was not existed"));
        reject({
          type: "insufficient param",
          message: "the path: " + validatePath + " was not existed"
        });
        return;
      }

      actualPath = rrdir.sync(validatePath);

      actualPath.forEach((v, i) => actualPath[i].path = v.path.replace(/\\/g, "/"));

      for (const entry of actualPath) {
        if (entry.directory) {
          if (ignoreDirectories.includes(path.basename(entry.path))) {
            logger.info(chalk.gray("find ignored directory: " + path.basename(entry.path)));
            directoryPath.push(entry.path);
            continue;
          }
          if (belongToIgnoreDirectory(entry))
            continue;
        }
        else {
          if (ignoreFiles.includes(path.basename(entry.path))) {
            logger.info(chalk.gray("find ignored file: " + entry.path));
            continue;
          }
          if (belongToIgnoreDirectory(entry))
            continue;
        }

        if (!oneOfItemEndsWithPath(entry.path, expectStructure)) {
          logger.error(chalk.red("unexpected path: " + entry.path));
          unmatchCount++;
          continue;
        }
        matchCount++;
      }
    } catch (error) {
      logger.error(chalk.red(error.message));
      reject({
        type: error,
        message: error.message
      });
    } finally {
      if (unmatchCount > expectCount || unmatchCount > 0) {
        reject({
          expectCount: expectCount,
          matchCount: matchCount,
          unmatchCount: unmatchCount
        });
      }
      else {
        resolve({
          expectCount: expectCount,
          matchCount: matchCount,
          unmatchCount: unmatchCount
        });
      }
    }
  });
}

module.exports = avfs;
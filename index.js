const core = require('@actions/core');
const github = require('@actions/github');
const braces = require('braces');
const fs = require('fs');
const path = require('path');
const rrdir = require("rrdir");
let directoryPath = [];
let actualPath = [];

function belongToIgnoreDirectory(entry)
{
  for (const dp of directoryPath)
  {
    if(entry.path.startsWith(dp))
    {
      core.info("the " + (entry.directory ? "directory" : "file") + ": " + path.basename(entry.path) + " belong to ignored directory: " + path.dirname(entry.path));
      return true;
    }
  }
  return false;
}

function oneOfItemEndsWithPath(path, array)
{
  for(const e of array)
  {
    if(e == path || path.endsWith(e))
    {
      core.info("matching FROM: " + path + " TO: " + e);
      array.push(path);
      return true;
    }
  }
  return false;
}

function getAllExpectedPathRecursively(array)
{
  const next = [...new Set(array.map(i=>path.dirname(i)))].filter(i=>i!=".");
  if(next.length <= 0)
    return [...array];
  return [...array, ...getAllExpectedPathRecursively(next)];
}

try {
  const readPath = core.getInput('read-path');
  // const readPath = './sample_folder';
  const expansion = core.getInput('brace-expansion');
  // const expansion = '{a,b/{ba1,ba2,bb1,bb2},c,d}/{a.qa.config,b.prd.config}';
  const ignoreFiles = core.getInput('ignore-files').split(',');
  // const ignoreFiles = "README.md".split(",");
  const ignoreDirectories = core.getInput('ignore-directories').split(',');
  // const ignoreDirectories = ".git".split(",");

  if(!expansion)
  {
    core.setFailed("param 'brace-expansion' is required");
    return core.ExitCode.Failure;
  }
  let expectStructure = braces(expansion, { expand: true });

  expectStructure = getAllExpectedPathRecursively(expectStructure);

  for(const p of expectStructure)
  {
    core.info("expected path: " + p);
  }

  const validatePath = readPath;
  if(!fs.existsSync(validatePath))
  {
    core.setFailed("the path: " + validatePath + " was not existed");
    return core.ExitCode.Failure;
  }

  actualPath = rrdir.sync(validatePath);

  actualPath.forEach((v,i)=> actualPath[i].path = v.path.replace(/\\/g, "/"));

  for (const entry of actualPath) {
    if(entry.directory)
    {
      if(ignoreDirectories.includes(path.basename(entry.path)))
      {
        core.info("find ignored directory: " + path.basename(entry.path));
        directoryPath.push(entry.path);
        continue;
      }
      if(belongToIgnoreDirectory(entry))
        continue;
    }
    else
    {
      if(ignoreFiles.includes(path.basename(entry.path)))
      {
        core.info("find ignored file: " + entry.path);
        continue;
      }
      if(belongToIgnoreDirectory(entry))
        continue;
    }

    if(!oneOfItemEndsWithPath(entry.path, expectStructure))
    {
      core.setFailed("unexpected path: " + entry.path);
    }

  }
} catch (error) {
  core.setFailed(error.message);
}
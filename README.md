# anyone-validate-fs

![nightly-build](https://github.com/anyone-developer/anyone-validate-fs/workflows/nightly-build/badge.svg)
![release-build](https://github.com/anyone-developer/anyone-validate-fs/workflows/release-build/badge.svg)
[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B21065%2Fgit%40github.com%3Aanyone-developer%2Fanyone-validate-fs.git.svg?type=small)](https://app.fossa.com/projects/custom%2B21065%2Fgit%40github.com%3Aanyone-developer%2Fanyone-validate-fs.git?ref=badge_small)
[![DependaBot](https://badgen.net/github/dependabot/anyone-developer/anyone-validate-fs)](https://github.com/anyone-developer/anyone-validate-fs/network/updates)
![version](https://badgen.net/npm/v/@anyone-developer/anyone-validate-fs)
![license](https://badgen.net/github/license/anyone-developer/anyone-validate-fs)
[![Build Status](https://travis-ci.org/anyone-developer/anyone-validate-fs.svg?branch=main)](https://travis-ci.org/anyone-developer/anyone-validate-fs)
[![XO code style](https://badgen.net/xo/status/chalk)](https://github.com/xojs/xo)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/anyone-developer/anyone-validate-fs.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/anyone-developer/anyone-validate-fs/alerts/)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/anyone-developer/anyone-validate-fs.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/anyone-developer/anyone-validate-fs/context:javascript)
[![DeepScan grade](https://deepscan.io/api/teams/11532/projects/14440/branches/269275/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=11532&pid=14440&bid=269275)

This github action help you to validate file structure as you expected. The validate rule will follow the brace-expansion. For more official definition, please reference to: https://www.gnu.org/software/bash/manual/bash.html#Brace-Expansion

*If you like my module, please buy me a coffee.*

*More and more tiny and useful github actions modules are on the way. Please donate to me. I accept part time job contract. if you need, please contact me: zhang_nan_163@163.com*

## Inputs

### `brace-expansion`

**Required** brace-expansion of expected directory structure.

### `ignore-files`

the files you want to ignore. split with comma.

### `ignore-directories`

the directories you want to ignore. split with comma.

### `read-path`

the path that you assign to read.

### `render-layout`

render diff result with \'vertical\' or \'horizontal\'

## Outputs

### `output`

output of execution.

## Other way usage

### `From NPM for programmatic use`

- create a 'demo' folder
- **npm init** to create your nodejs package
- copy 'sample_folder' to demo
- **npm install anyone-validate-fs** to install module
- create 'index.js' and copy code below:

```javascript

const {avfs} = require('anyone-validate-fs');

avfs.setRenderLayout('horizontal').diff(
  './sample_folder',
  '{x/p,y/f,{a,b/{ba1,ba2,bb1,bb2},c,d}/{a.qa.config,b.prd.config}}',
  'README.md',
  '.git'
).then(resolve => {
  console.info(resolve.diff);
  return resolve.diff;
}, error => {
  if (error.name && error.message) {
    console.error(`error message: ${error.message}`);
  }

  return error.message;
});

```

here is repl.it online editor: https://repl.it/@EdwardRoshan/anyone-validate-fs-demo

- **node index.js** to run it

<img src="https://raw.githubusercontent.com/anyone-developer/anyone-validate-fs/main/misc/module.png" width="500">


### `From NPM for using as a command line app`

- **npm install -g anyone-validate-fs** to install gobally
- **anyone-validate-fs -r './sample_folder' -b '{a,b/{ba1,ba2,bb1,bb2},c,d}/{a.qa.config,b.prd.config}' -I ".git" -i "README.md"** to use your bash to execute it.
- you would get same result with above screenshot

## Example usage

```yml
uses: anyone-developer/anyone-validate-fs@v1.0
with:
  brace-expansion: '{a,b/{ba1,ba2,bb1,bb2},c,d}/{a.qa.config,b.prd.config}'
  ignore-files: 'README.md'
  ignore-directories: '.git'
  read-path: 'sample_folder'
  render-layout: 'horizontal'
```

## Fossa Report

[![FOSSA Status](https://app.fossa.com/api/projects/custom%2B21065%2Fgit%40github.com%3Aanyone-developer%2Fanyone-validate-fs.git.svg?type=large)](https://app.fossa.com/projects/custom%2B21065%2Fgit%40github.com%3Aanyone-developer%2Fanyone-validate-fs.git?ref=badge_large)

## Donation

PalPal: https://paypal.me/nzhang4

<img src="https://raw.githubusercontent.com/anyone-developer/anyone-validate-fs/main/misc/alipay.JPG" width="500">

<img src="https://raw.githubusercontent.com/anyone-developer/anyone-validate-fs/main/misc/webchat_pay.JPG" width="500">



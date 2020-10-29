# anyone-validate-fs

[![dependencies Status](https://david-dm.org/anyone-developer/anyone-validate-fs/status.svg)](https://david-dm.org/anyone-developer/anyone-validate-fs)
![nightly-build](https://github.com/anyone-developer/anyone-validate-fs/workflows/nightly-build/badge.svg)
![Node.js Package](https://github.com/anyone-developer/anyone-validate-fs/workflows/Node.js%20Package/badge.svg)
[![XO code style](https://badgen.net/xo/status/chalk)](https://github.com/xojs/xo)

This action help you to validate file structure as you expected. The validate rule will follow the brace-expansion. For more official definition, please reference to: https://www.gnu.org/software/bash/manual/bash.html#Brace-Expansion

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

## Other Way to use

### `npm package`

- create a 'demo' folder
- **npm init** to create your nodejs package
- copy 'sample_folder' to demo
- **npm install anyone-validate-fs** to install module
- create 'index.js' and copy code below:

```javascript

const { avfs } = require('anyone-validate-fs');

avfs.setRenderLayout("horizontal").diff(
    './sample_folder',
    '{x/p,y/f,{a,b/{ba1,ba2,bb1,bb2},c,d}/{a.qa.config,b.prd.config}}',
    "README.md",
    ".git"
).then((resolve) => {
    console.info(resolve.diff);
    return resolve.diff;
}, (reject) => {
    if (reject.type && reject.message) {
        console.error(`type: ${reject.type} error message: ${reject.message}`);
    }
    console.error(reject.diff);
    return reject.diff;
});

```

- **node index.js** to run it

<img src="https://raw.githubusercontent.com/anyone-developer/anyone-validate-fs/main/misc/module.png" width="500">

### `Terminal`

- **npm install -g anyone-validate-fs** to install gobally
- **anyone-validate-fs -r './sample_folder' -b '{a,b/{ba1,ba2,bb1,bb2},c,d}/{a.qa.config,b.prd.config}' -I ".git" -i "README.md"** to use your bash to execute it.
- you would get same result with above screenshot

## Example usage

```yml
uses: nzhang4-sh/anyone-validate-fs@v1.0
with:
  brace-expansion: '{a,b/{ba1,ba2,bb1,bb2},c,d}/{a.qa.config,b.prd.config}'
  ignore-files: 'README.md'
  ignore-directories: '.git'
  read-path: 'sample_folder'
  render-layout: 'horizontal'
```

## Donation

PalPal: https://paypal.me/nzhang4

<img src="https://raw.githubusercontent.com/anyone-developer/anyone-validate-fs/main/misc/alipay.JPG" width="500">

<img src="https://raw.githubusercontent.com/anyone-developer/anyone-validate-fs/main/misc/webchat_pay.JPG" width="500">



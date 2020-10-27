# anyone-validate-fs

![nightly build status](https://github.com/anyone-developer/anyone-validate-fs/workflows/nightly-build/badge.svg)

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

## Outputs

### `output`

output of execution.

## Example usage

```
uses: nzhang4-sh/anyone-validate-fs@v1.0
with:
  brace-expansion: '{a,b/{ba1,ba2,bb1,bb2},c,d}/{a.qa.config,b.prd.config}'
  ignore-files: 'README.md'
  ignore-directories: '.git'
  read-path: 'sample_folder'
```

## Donation

PalPal: https://paypal.me/nzhang4

<img src="./misc/alipay.JPG" width="500">

<img src="./misc/webchat_pay.JPG" width="500">



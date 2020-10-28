const { avfs } = require("./avfs.js");

avfs.setRenderLayout("vertical").diff(
  './sample_folder',
  '{{a,b/{ba1,ba2,bb1,bb2},c,d}/{a.qa.config,b.prd.config},{x,y}/p/a/b/c/{a.qa.config,a.prd.config}}',
  "README.md",
  ".git"
).then((resolve) => {
  this.exitCode = 0;
  console.info(resolve.diff);
  return resolve.diff;
}, (reject) => {
  this.exitCode = 1;
  if (reject.type && reject.message) {
    console.error(`type: ${reject.type} error message: ${reject.message}`);
  }
  console.error(reject.diff);
  return reject.diff;
});

return this.exitCode;

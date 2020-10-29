const {avfs} = require('./avfs.js');

avfs.setRenderLayout('vertical').diff(
  './sample_folder',
  '{a,b/{ba1,ba2,bb1,bb2},c,d}/{a.qa.config,b.prd.config}',
  'README.md',
  '.git'
).then(resolve => {
  console.info(resolve.diff);
  return resolve.diff;
}, error => {
  if (error.name && error.message) {
    console.error(`name: ${error.name} error message: ${error.message}`);
  }

  return error.message;
});


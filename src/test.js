const { avfs } = require("./avfs.js");

avfs.setRenderLayout("vertical").diff().then((resolve) => {
  console.info(resolve.diff);
}, (reject) => {
  if (reject.type && reject.message) {
    console.setFailed(`type: ${reject.type} error message: ${reject.message}`);
  }
  console.error(reject.diff);
});

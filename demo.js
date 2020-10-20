// const braces = require('braces');

// const expectStructure = braces('{a,b/{ba1,ba2,bb1,bb2},c,d}/{a.qa.config,b.prd.config}', { expand: true });
// console.log(expectStructure);

// const rrdir = require("rrdir");

// for (const entry of rrdir.sync("./")) {
//     console.log(entry);
// }

const path = require('path');

console.log(path.dirname("./sample_folder/a/a.qa.config"));
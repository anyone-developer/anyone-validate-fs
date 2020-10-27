const braces = require('braces');
const path = require('path');
let expectStructure = braces('{a,b/{ba1,ba2,bb1,bb2},c,d}/{a.qa.config,b.prd.config}', { expand: true });
console.log(expectStructure);
expectStructure = expectStructure.map(i => {
    return {
        path: path.normalize(i)
    };
});

console.log(expectStructure);

// const rrdir = require("rrdir");

// for (const entry of rrdir.sync(`sample_folder\\b`)) {
//     console.log(path.normalize(entry.path));
// }

// const path = require('path');

// console.log(path.dirname("./sample_folder/a/a.qa.config"));

// const SymbolTree = require('symbol-tree');
// const tree = new SymbolTree();

// let a = {foo: 'bar'}; // or `new Whatever()`
// let b = {foo: 'baz'};
// let c = {foo: 'qux'};

// tree.insertBefore(b, a); // insert a before b
// tree.insertAfter(b, c); // insert c after b

// console.log(tree.nextSibling(a) === b);
// console.log(tree.nextSibling(b) === c);
// console.log(tree.previousSibling(c) === b);

// tree.remove(b);
// console.log(tree.nextSibling(a) === c);


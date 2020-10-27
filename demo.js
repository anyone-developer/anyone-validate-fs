// const braces = require('braces');
const path = require('path');
// let expectStructure = braces('{q,{a,b/{ba1,ba2,bb1,bb2},c,d}/{x,y/z}}', { expand: true });
// expectStructure = expectStructure.map(i => {
//     return path.normalize(i);
// });
// console.log(expectStructure);

// function getNextLevelPath(path) {
//     let paths = path.split('\\');
//     if (paths.length > 1) {
//         return paths.slice(1).join('\\');
//     }
//     return null;
// }

// function getTopLevelPath(path) {
//     return path.split('\\')[0];
// }

// function getTreeNode(array) {
//     let object = {};
//     for (const a of array) {
//         const top = getTopLevelPath(a);
//         const next = getNextLevelPath(a);
//         if(!next)
//         {
//             object[top] = null;
//             continue;
//         }
//         const subArray = array.filter(i => i.startsWith(top)).map(i => getNextLevelPath(i));
//         if (!object.hasOwnProperty(top)) {
//             object[top] = { ...getTreeNode(subArray) };
//         }
//     }
//     return object;
// }
// const obj = getTreeNode(expectStructure);
// console.log("break");
const rrdir = require("rrdir");

for (const entry of rrdir.sync(`sample_folder\\b`)) {
    console.log(entry);
}

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


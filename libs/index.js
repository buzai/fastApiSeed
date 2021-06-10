const path = require('path');

exports.install = async function (libs = []) {
    G.libs = {};
    for (let i = 0; i < libs.length; i++) {
        let name = libs[i];
        let pt = path.join(__dirname, './', name);
        let lib = require(pt);
        G.libs[name] = lib;
    }
};

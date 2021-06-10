const fs = require('fs');
const path = require('path');
const { Model, DataTypes } = require('sequelize');

async function install(connectSeq, key) {
    let all = {};
    let pp = path.join(__dirname, `../models/${key}`);
    let files = await fs.readdirSync(pp);
    for (let i = 0; i < files.length; i++) {
        let name = files[i];
        if (name == 'index.js') continue
        if (name == '.DS_Store') continue
        let modelsName = name.split('.')[0];
        let p = path.join(__dirname, `../models/${key}`, modelsName);
        let md = require(p);
        all[modelsName] = md(connectSeq, DataTypes);
    }
    return all;
}

exports.install = install;

const Router = require('koa-router');
const fs = require('fs');
const path = require('path');

exports.install = async function install(middles = []) {
    let all = {};
    let ctrPath = path.join(__dirname, '../middlewares');
    let files = await fs.readdirSync(ctrPath);
    for (let i = 0; i < files.length; i++) {
        let name = files[i];
        let middleName = name.split('.')[0];
        let cp = path.join(__dirname, '../middlewares/', middleName);
        let md = require(cp);
        all[middleName] = md;
    }
    return all;
}

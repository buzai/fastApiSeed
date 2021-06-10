const fs = require('fs');
const path = require('path');

async function install() {
    let allConfigs = [];
    let pp = path.join(__dirname, '../apis/v1');
    let files = await fs.readdirSync(pp);
    for (let i = 0; i < files.length; i++) {
        let name = files[i];
        if (name == 'index.js' || name == '.DS_Store') continue
        let all = {};
        let ctrfilename = name.split('.')[0];
        let p = path.join(__dirname, '../apis/v1', ctrfilename);
        let apis = require(p);

        // 遍历每个文件的所有方法导出为接口
        let keys = Object.keys(apis);
        for (let i = 0; i < keys.length; i++) {
            // get api ops
            let apiOps = apis[keys[i]]
            // get midd
            let middlewares = apiOps.middlewares;
            let mids = [];
            middlewares.map(value => {
                if (G.middlewares[value]) {
                    mids.push(G.middlewares[value]())
                }
            })
            // 参数校验
            if (Object.keys(apiOps.validateRuler).length > 0) {
                let paramsValidate = G.middlewares.paramsValidate(apiOps.validateRuler)
                mids.unshift(paramsValidate);
            }
            // add a api
            G.router[apiOps.method.toLowerCase()](apiOps.url, ...mids, apiOps.controller);
            // save all api config
            all[apiOps.url] = apiOps;
        }
        all.tags = ctrfilename;
        allConfigs.push(all)

    }
    G.allConfigs = allConfigs;
    return allConfigs;
}

function logApiInfo(allConfigs) {
    console.log('api list:')

    allConfigs.map(all => {
        console.log(all.tags)
        for (key in all) {
            if (key == 'tags') continue;
            let apiOps = all[key]
            let method = apiOps.method;
            method = method.toLowerCase();
            if (method == 'get') {
                method += ' '
            }
            console.log('method:', method , ' ', apiOps.url,)
        }
        // console.log()
    })

}

exports.install = install;

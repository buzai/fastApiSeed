const fs = require('fs');
const path = require('path');
let servicesClass = {}
const filePath = path.join(__dirname, '.')
const files = fs.readdirSync(filePath)

// 初始化此目录下的 service
exports.install = (context) => {
    for (let file of files) {
        if (file == 'index.js' || file == "redisCatch.js" || file == "baseService.js") continue
        file = file.replace('.js', '')
        let doc = require(`./${file}`)
        servicesClass[file] = doc
    }
    const servicesInstances = {};
    Object.keys(servicesClass).forEach(key => {
        servicesInstances[key] = new servicesClass[key](context)
    })
    return servicesInstances
}

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const json = require('koa-json');
const install = require('./install');
const schedules = require("./schedules")
const cors = require('@koa/cors');

// 全局变量 G
G = {};

async function serverStart() {
    let app = new Koa();
    app.use(cors());
    app.use(bodyParser()).use(json());

    // load
    await install.installAll(app);

    let port = G.config.server.port
    app.listen(port);

    // assign services
    let context = { models: G.models.main, othersDbModels: G.models.othersDbModels };
    context.services = G.services

    // start task
    schedules.installAndRun(context);

    return port
}

serverStart().then((port) => {
    console.log('start success: ', 'http://127.0.0.1:' + port)
    console.log('swagger: ', 'http://127.0.0.1:' + port + '/swagger')
}).catch((err) => {
    console.log('启动错误', err);
})

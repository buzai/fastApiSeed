const libs = require('./libs')
const modelss = require('./models')
const services = require('./services')
const config = require('./configs')
const middlewares = require('./middlewares')
const koaSwagger = require('koa2-swagger-ui');
const apis = require('./apis')
const Router = require('koa-router');
const multer = require('@koa/multer');
const path = require('path');


// libs
async function libsIntall(list) {
    libs.install(list);
}

// config
async function configInstall() {
    // console.log('process.env ', process.env);
    let env = process.env.NODE_ENV;
    let SERVER_TYPE = process.env.SERVER_TYPE;

    G.env = env;
    G.SERVER_TYPE = SERVER_TYPE
    G.config = await config.install(env);
}

// router
async function installRouter() {
    let router = new Router();
    G.router = router;
    G.app.use(G.router.routes());
}

// load db
async function installDb() {
    G.db = {};
    G.models = { main: {} , othersDbModels: {} }

    // mysql 
    let configlist = Object.keys(G.config.mysqlConfig);
    for (let i = 0; i < configlist.length; i++) {
        let cfgKey = configlist[i]
        let cfg = G.config.mysqlConfig[cfgKey]
        let mysqlTool = await G.libs.dbTool.SequelizeIntall(cfg, cfgKey);
        let models = await modelss.install(mysqlTool.getDB(), cfgKey);
        if (cfgKey == 'main') {
            G.models.main = models
        } else {
            G.models.othersDbModels[cfgKey] = models
        }
        await mysqlTool.assignModels(models);
    }
    // redis
    await G.libs.dbTool.RedisIntall(G.config.redisConfig);

}

// load middle
async function installMiddles(middles = []) {
    G.middlewares = {};
    G.middlewares = await middlewares.install();
    for (let i = 0; i < middles.length; i++) {
        if (middles[i]) {
            G.router.use(G.middlewares[middles[i]]());
        } else {
            throw new Error(middles[i] + ' middle not exist');
        }
    }
}

// services load
async function installServices(app) {
    let context = { models: G.models.main, othersDbModels: G.models.othersDbModels };
    let all = services.install(context);
    context.services = all;
    G.services = all;
    return all;
}

// upload file
async function fileUpload(app) {
    let uploadTool = multer({ dest: path.join(__dirname, './upload/') });
    G.uploadTool = uploadTool;
}

// load swagger
async function swagger(app) {
    G.router.get('/swagger', koaSwagger({ routePrefix: false, swaggerOptions: { spec: G.libs.swagger.getJson() } }));
}

module.exports.installAll = async function installAll(app) {
    G.app = app;

    await configInstall();
    await libsIntall(['dbTool', 'token', 'validator', 'argfilter',  'swagger']);
    await installRouter();

    G.router.use(async function (ctx, next) {
        ctx.models = G.models;
        ctx.services = G.services;
        ctx.success = function(data, msg = "ok") {
            return ctx.body = {
                code: "200",
                msg: msg,
                data: data
            }
        }
        ctx.fail = function(msg = "error", code = "400", data = {}) {
            return ctx.body = {
                code: code,
                msg: msg,
                data: data
            }
        }
        await next();
    });

    await installDb();
    await installMiddles(['params']);
    await fileUpload(app);
    await apis.install();
    await installServices(app);
    await swagger(app)

    console.log('installAll end');
};

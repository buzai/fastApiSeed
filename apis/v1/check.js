// 健康检测
exports.checkServer = {
    name: 'checkServer',
    desc: '健康检测',
    method: 'get',
    url: '/api/check/server',
    validateRuler: {},
    middlewares: [],
    controller: async function (ctx) {
        ctx.success({
            server: 'xxxx api',
            time: new Date()
        })
    }
}

// for swagger json 数据
exports.swaggerJson = {
    name: 'swaggerJson',
    desc: 'swagger json 数据',
    method: 'get',
    disableInSwagger: true,
    url: '/api/doc/swaggerJson',
    validateRuler: {},
    middlewares: [],
    controller: async function (ctx) {
        let data = G.libs.swagger.getJson();
        return ctx.body = G.libs.swagger.getJson();
    }
}

exports.testApi = {
    name: 'testApi',
    desc: 'swagger json 数据',
    method: 'get',
    url: '/api/testApi',
    validateRuler: {},
    middlewares: [],
    controller: async function (ctx) {
        try {
            let result = await ctx.services.testService.foo();
            ctx.success(result);
        } catch(e) {
            ctx.fail(e.messag);
        }
    }
}
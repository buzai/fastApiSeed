module.exports = function(ruler) {
    return async function(ctx, next) {
        let result = G.libs.validator(ctx.params, ruler);
        if (result.error) {
            ctx.body = {
                msg: result.error,
                code: 201,
                status: '参数错误',
                params: ctx.params
            }
            return;
        }
        Object.keys(result.data).map(v=>{
            if (result.data[v] == undefined) {
                delete result.data[v]
            }
        })
        ctx.params = result.data
        await next()
    }
}

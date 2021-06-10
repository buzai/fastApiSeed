module.exports = function(options) {
    return async function(ctx, next) {
        let params = Object.assign({}, ctx.request.body, ctx.request.query);
        ctx.params = params;
        await next()
    }
}

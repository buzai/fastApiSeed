module.exports = function(options) {
    return async function(ctx, next) {
        let token = ctx.headers.token;
        if (token) {
            ctx.user = user;
        }
        await next()
    }
}

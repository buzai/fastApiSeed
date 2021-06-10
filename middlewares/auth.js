module.exports = function(options) {
    return async function(ctx, next) {
        let token = ctx.headers.token;
        if (!token) {
            return ctx.body = {
                msg: 'need token',
                code: 504
            }
        } else {
            // get user
            // ctx.user = user;
        }
        await next()
    }
}

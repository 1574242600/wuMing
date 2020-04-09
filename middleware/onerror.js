const log = require('../utils/logger');

module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        switch (e[2]) {
            case 'info':
                log.info('info: ' + (e instanceof Error ? e.stack : e[1]));
                break;
            case 'error':
                log.error('error: ' + (e instanceof Error ? e.stack : e[1]));
                break;
            default:
                log.error('error: ' + (e instanceof Error ? e.stack : e[1]));
        }
        ctx.set({
            'Content-Type': 'application/json; charset=UTF-8',
        });
        ctx.response.body = {
            code: !e[0] ? 500 : e[0],
            mes: e instanceof Error ? e.stack : e[1]
        };
        ctx.response.status = e instanceof Array ? 200 : 500;
    }
};
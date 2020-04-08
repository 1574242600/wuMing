const logger = require('../utils/logger');

module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        switch (e[2]) {
            case 'info':
                logger.info('info: ' + (e instanceof Error ? e.stack : e[1]));
                break;
            case 'error':
                logger.error('error: ' + (e instanceof Error ? e.stack : e[1]));
                break;
            default:
                logger.error('error: ' + (e instanceof Error ? e.stack : e[1]));
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
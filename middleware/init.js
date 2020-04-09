const _class = require('../modules/allClass');


module.exports = async (ctx, next) => {
    global.language = require('../language/cn');
    global.user = ctx.session.user  === undefined ? undefined : ctx.session.user;

    ctx.Admin = new _class.Admin;
    ctx.User = new _class.User;
    await next();
};
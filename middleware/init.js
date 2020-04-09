const _class = require('../modules/allClass');

global.empty = (post,arr) => {
    for (const value of arr){
        if (post[value] === undefined) return true;
        if (post[value].trim().length === 0) return true;
    }

    return false
};

module.exports = async (ctx, next) => {
    global.language = require('../language/cn');
    global.user = ctx.session.user  === undefined ? undefined : ctx.session.user;
    ctx.Admin = new _class.Admin;
    ctx.User = new _class.User;
    await next();
};
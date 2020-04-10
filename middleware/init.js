const _class = require('../modules/allClass');

/**
 * @name empty
 * @param post object
 * @param arr string[]
 * @return boolean
 * @example
 * post = {name: 1, pwd: ''}
 * empty(post,['name'])  : false
 * empty(post,['pwd']) : true
 * empty(post,['pwd','name']) : true
 */
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
    if(ctx.request.method === 'POST') global.post = ctx.request.body;

    ctx.Admin = new _class.Admin;
    ctx.User = new _class.User;
    await next();
};
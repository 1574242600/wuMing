const _class = require('../utils/allClass');
/**
 * 判断对象是否为空
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
    global.$get =  ctx.request.query;
    if(ctx.request.method === 'POST') global.post = ctx.request.body;
    global.$language = require('../language/cn');
    global.$token = require('../utils/token')(ctx);
    global.$user = await $token.getUserInfo();
    //console.$log($tokenObj);

    ctx.Admin = new _class.Admin();
    ctx.User = new _class.User();
    ctx.Series = new _class.Series();
    await next();
};
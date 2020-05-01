const _class = require('../utils/allClass');

/**
 * 判断对象是否为空
 * @name empty
 * @param $post object
 * @param arr string[]
 * @return boolean
 * @example
 * $post = {name: 1, pwd: ''}
 * empty($post,['name'])  : false
 * empty($post,['pwd']) : true
 * empty($post,['pwd','name']) : true
 */

global.empty = (post,arr) => {
    for (const value of arr){
        if (post[value] === undefined) return true;
        if (post[value].trim().length === 0) return true;
    }

    return false
};

/**
 * 判断是否为正整数
 * @name isPosInt
 * @return array
 * @throws $language.paramException
 */

global.isPosInt = (...arguments) => {
    let len = arguments.length;
    let int;
    let arr = [];

    for(let i=0; i < len; i++){
        int = isNaN(Number(arguments[i])) ? 0 : Number(arguments[i]);
        if(int <= 0) throw $language.paramException;
        arr[i] = int;
    }

    return arr
};

module.exports = async (ctx, next) => {
    global.$get =  ctx.request.query;
    if(ctx.request.method === 'POST') global.$post = ctx.request.body;
    global.$language = require('../language/cn');
    global.$token = require('../utils/token')(ctx);
    global.$user = await $token.getUserInfo();
    //console.$log($tokenObj);

    ctx.Admin = new _class.Admin();
    ctx.User = new _class.User();
    ctx.Series = new _class.Series();
    ctx.Video = new _class.Video();
    await next();
};
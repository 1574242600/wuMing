/**
 * @global language
 * @global post
 * @global get
 *
 * */

const login = async (ctx) => {
    ctx.response.body = language.loginErr1;

    if (post.name !== undefined && post.pwd !== undefined) {

        ctx.response.body = await ctx.User.login(post.name,post.pwd);
    }
};

const info = async (ctx) => {
    if(!(await ctx.User.isLogin())){
        ctx.response.body = language.isUserFalse;
        return 1;
    }
    ctx.response.body = await ctx.User.info(user.uid);
};

module.exports = {login,info};
const md5 = require('md5-node');

class User {
    ctx;
    constructor(ctx) {
        this.ctx = ctx;
    }

    async login(){
        const ctx = this.ctx;
        const post = ctx.request.body;
        const user = await this.queryUser({name: post.name},['pwd','rand','admin','uid']);

        if (user === null) {
            return ctx.language.loginErr1;
        }

        if (md5(md5(post.pwd)+user.rand) !== user.pwd){
            return ctx.language.loginErr1;
        }

        ctx.session.user = user;
        return ctx.language.succeed;
    }

    async info(uid){
        const ctx = this.ctx;
        const data = {
            data : Object.assign(ctx.session.user,await this.queryUser({uid: uid}, ['name'])),
        };
        return Object.assign(ctx.language.succeed,data);
    }

    async queryUser(where = [],key = ['*']){
        return await this.ctx.mysql.Users.findOne(({
            where: where,
            attributes: key
        })).then(obj => {
            return obj ? obj.dataValues : null;
        });
    }

    async isLogin(){
        return !(this.ctx.session.user === undefined)
    }
}


const login = async (ctx) => {
    ctx.response.body = await new User(ctx).login();
};

const info = async (ctx) => {
    const currentUser = new User(ctx);
    if(!(await currentUser.isLogin())){
        ctx.response.body = ctx.language.isUserFalse;
        return 1;
    }
    ctx.response.body = await currentUser.info(ctx.session.user.uid);
};

module.exports = {login,info};
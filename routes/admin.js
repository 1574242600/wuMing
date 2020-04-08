const stringRandom = require('string-random');
const md5 = require('md5-node');

class Admin {
    ctx;
    user;
    constructor(ctx) {
        this.ctx = ctx;
        this.user = ctx.session.user  === undefined ? undefined : ctx.session.user;
    }

    async addUser(post){
        const ctx = this.ctx;
        const UserAdmin = this.user  === undefined ? 0 : this.user.admin;
        if (Number(UserAdmin) <= 3 || UserAdmin <= post.admin) {
            return ctx.language.adminError;
        }

        const rand = stringRandom(6);
        const created = await ctx.mysql.Users.findOrCreate({where: {name: post.name},
            defaults: {
                'pwd': md5(md5(post.pwd)+rand),
                'rand': rand,
                'admin': Number(post.admin)
            }
        }).then(([user, created]) => {
            return created;
        });

        if(created) {
            this.adminLog(`管理员[${ctx.session.user.uid}]: 创建账户${name}{${(UserAdmin)}}成功 --`+ new Date());
            return ctx.language.succeed;
        }

        return ctx.language.addUserError;
    }

    async adminLog(msg){
        this.ctx.log.info(msg);
    }
}

const addUser = async (ctx) =>{
    const post = ctx.request.body;
    const is = () => {
        if (post.name.length < -1 || !post.pwd < -1) return true;
        if (post.name.length > 32) return true;
        return isNaN(Number(post.admin));
    };

    if(is()) throw ctx.language.paramException;
    ctx.response.body = await new Admin(ctx).addUser(post);
};


module.exports = {
    addUser
};
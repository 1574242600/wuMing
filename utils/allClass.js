const stringRandom = require('string-random');
const md5 = require('md5-node');
const Sequelize  = require('./mysql');

class Admin {
    UserAdmin;
    constructor() {
        this.UserAdmin = user  === undefined ? 0 : user.admin;
    }

    async addUser(post){
        if (!this.isAdmin() || this.UserAdmin <= post.admin) {
            return language.adminError;
        }

        const created = await mysql.addUser(post);

        if(created) {
            this.adminLog(`管理员[${user.uid}]: 创建账户${name}{${(this.UserAdmin)}}成功 --`+ new Date());
            return language.succeed;
        }

        return language.addUserError;
    }

    async addSeries(name,sid = 0){
        if (!this.isAdmin()){
            return language.adminError;
        }

        const created = await mysql.addSeries(name,sid);
        if (created){
            this.adminLog(`管理员[${user.uid}]: 创建系列《${name}》成功 --`+ new Date());
            return language.succeed;
        }
        return language.addSeriesError;
    }

    //添加单集
    async addEs(id,name){

    }

    async addVideo(vid,){

    }

    async adminLog(msg){
        log.info(msg);
    }

    isAdmin(){
        return (this.UserAdmin >= 3);
    }
}

class User {

    async login(name,pwd,session){
        const user = await mysql.queryUser({name: name},['pwd','rand','admin','uid']);

        if (user === null) {
            return language.loginErr1;
        }

        if (md5(md5(pwd)+user.rand) !== user.pwd){
            return language.loginErr1;
        }

        this.setSession(user,session);
        return language.succeed;
    }

    async info(uid){
        const data = {
            data : Object.assign(user, await mysql.queryUser({uid: uid}, ['name'])),
        };
        return Object.assign(language.succeed,data);
    }

    async isLogin(){
        return !(user === undefined)
    }

    async setSession(user,session){
        delete user.pwd;
        delete user.rand;

        session.user = user;
    }
}

class mysql {

    static async queryUser(where = [],key = undefined){
        return await Sequelize.Users.findOne(({
            where: where,
            attributes: key
        })).then(obj => {
            return obj ? obj.dataValues : null;
        });
    }

    static async addUser(post){
        const rand = stringRandom(6);
        return await Sequelize.Users.findOrCreate({where: {name: post.name},
            defaults: {
                'pwd': md5(md5(post.pwd)+ rand),
                'rand': rand,
                'admin': Number(post.admin)
            }
        }).then(([user, created]) => {
            return created;
        });
    }

    static async addSeries(name,sid){
        return await Sequelize.Series.findOrCreate({where: {name: name},
            defaults: {
                'name': name,
                'sid': sid,
                'total' : 0
            }
        }).then(([user, created]) => {
            return created;
        });

    }

}



module.exports = {
    Admin,
    User
};
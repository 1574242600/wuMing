const stringRandom = require('string-random');
const md5 = require('md5-node');


class Admin {
    UserAdmin;
    constructor() {
        this.UserAdmin = $user  === undefined ? 0 : $user.admin;
    }

    async addUser(post){
        if (!this.isAdmin() || this.UserAdmin <= post.admin) {
            return $language.adminError;
        }

        const created = await mysql.insertUser(post);

        if(created) {
            this.adminLog(`管理员[${$user.uid}]: 创建账户${name}{${(this.UserAdmin)}}成功 --`+ new Date());
            return $language.succeed;
        }

        return $language.addUserError;
    }

    async addSeries(name,sid = 0){
        if (!this.isAdmin()){
            return $language.adminError;
        }

        const created = await mysql.insertSeries(name,sid);
        if (created){
            this.adminLog(`管理员[${$user.uid}]: 创建系列《${name}》成功 --`+ new Date());
            return $language.succeed;
        }
        return $language.addSeriesError;
    }

    /**
     * 添加话和对应视频
     * @name addEsAndVideo
     * @param xid Number 系列id
     * @param name string 话标题 可为空
     * @param sid Number 子系列id
     * @param post object['file','url'] 视频地址 任一即可
     * @return language object api信息
     * @example
     * post = {
     *    file : '/114514/6KiA6K666Ieq55Sx.mp4'
     * }
     * insertEsAndVideo(1,'写示例只为玩梗')  : $language.succeed
     * post = {
     *    url : 'https://www.example.com/10492/5oiR6KaB.mp4'
     * }
     * insertEsAndVideo(1,'小熊维尼第一集')  : $language.succeed
     */

    async addEsAndVideo(xid, sid = 0, name = '0', post){
        if (!this.isAdmin()){
            return $language.adminError;
        }
        post.file = post.file ? post.file : 0;
        post.url = post.url ? post.file : 0;

        const created = await mysql.insertEsAndVideo(xid,sid,name,post);

        if (created){
            this.adminLog(`管理员[${$user.uid}]: 添加话[${xid}-${sid}] 《${name}》成功 --`+ new Date());
            return $language.succeed;
        }
    }

    async adminLog(msg){
        $log.info(msg);
    }

    isAdmin(){
        return (this.UserAdmin >= 3);
    }
}

class User {

    async login(name,pwd){
        const user = await mysql.queryUser({name: name},['pwd','rand','admin','uid']);

        if (user === null) {
            return $language.loginErr1;
        }

        if (md5(md5(pwd)+user.rand) !== user.pwd){
            return $language.loginErr1;
        }

        delete user.rand;
        delete user.pwd;

        let userToken = await $token.getToken(user);
        return  Object.assign({},$language.succeed,{userToken: userToken});
    }

    async info(uid){
        const data = {
            data : Object.assign($user, await mysql.queryUser({uid: uid}, ['name'])),
        };
        return Object.assign({},$language.succeed,data);
    }

    isLogin(){
        return !($user === undefined)
    }

}

class Series {

    async seriesList(page,total){
        const data = {
            data : await mysql.querySeriesList(page, total),
        };

        return Object.assign({},$language.succeed,data);
    }

    async seriesListTotal(){
        return {
            seriesTotal: await mysql.querySeriesListTotal()
        };
    }

    async seriesEsList(xid,sid){
        const data = {
            data : await mysql.querySeriesEsList(xid, sid),
        };

        return Object.assign({},$language.succeed,data);
    }

    async queryEsVideo(vid){
        let data = {
            data : await mysql.queryEsVideo(vid),
        };
        if (data.data === null) throw $language.paramException;

        let file = data.data.file;
        delete data.data.file;
        if(file.length > -1) data.data.localUrl = '/video/?vid=' + vid;

        return Object.assign({},$language.succeed,data);
    }

}


class mysql {

    static async queryUser(where = [],key = undefined){
        return await $Sequelize.Users.findOne(({
            where: where,
            attributes: key
        })).then(obj => {
            return obj ? obj.dataValues : null;
        });
    }

    static async insertUser(post){
        const rand = stringRandom(6);
        return await $Sequelize.Users.findOrCreate({where: {name: post.name},
            defaults: {
                'pwd': md5(md5(post.pwd)+ rand),
                'rand': rand,
                'admin': Number(post.admin)
            }
        }).then(([user, created]) => {
            return created;
        });
    }

    static async insertSeries(name, sid){
        return await $Sequelize.Series.findOrCreate({where: {name: name},
            defaults: {
                'name': name,
                'sid': sid,
                'total' : 0
            }
        }).then(([user, created]) => {
            return created;
        });

    }

    static async insertEsAndVideo(xid, sid, name, post){
        let S = $Sequelize.sequelize;
        let es =  await this.querySeriesEsTotal(xid,sid) + 1;
        return S.transaction(async t => {

            let vid = await $Sequelize.Es.create({
                    'xid': xid,
                    'sid': sid,
                    'name': name,
                    'es' : es,
            },{transaction: t}).then(es =>{
                return es.vid;
            });

            await $Sequelize.Videos.create({
                'vid': vid,
                'file': post.file,
                'url' : post.url ,
            },{transaction: t});

            await $Sequelize.Series.update({total: es},{where:{'xid': xid ,'sid': sid},transaction: t});

            return true;
        }).then(result => {
            return result;
        }).catch(e => {
            $log.error(e.stack);
            throw $language.DatabaseException;
        });
    }

    /**
     * 查询系列总集数
     * @name insertEsAndVideo
     * @param xid Number 系列id
     * @param sid Number 子系列id
     * @return Number total
     * @throws language.paramException
     */
     static async querySeriesEsTotal(xid, sid){
        return $Sequelize.Series.findOne({
            where: { 'xid': xid ,'sid': sid},
            attributes: ['total']
        }).then(c => {
                if (c === null) throw $language.paramException;
                return c.total;
        })
    }

    static async querySeriesList(page, total){
        return $Sequelize.Series.findAll({
            offset: total * (page - 1),
            limit: page * total
        }).then(list => {
            return list;
        })
    }

    static async querySeriesListTotal(){
        return $Sequelize.Series.max('xid').then(max => {
            return max;
        })
    }

    static async querySeriesEsList(xid, sid){
        return $Sequelize.Es.findAll({
            where:{
                xid: xid,
                sid: sid
            },
            attributes: ['es','name','vid']
        }).then(list => {
            return list;
        })
    }

    static async queryEsVideo(vid){
        return $Sequelize.Videos.findOne({
            where:{
                vid: vid,
            },
            attributes: ['url','file']
        }).then(data => {
            return data ? data.dataValues : null;
        })
    }
}



module.exports = {
    Admin,
    User,
    Series,
};
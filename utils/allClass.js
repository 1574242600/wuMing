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
     * $post = {
     *    file : '/114514/6KiA6K666Ieq55Sx.mp4'
     * }
     * insertEsAndVideo(1,'写示例只为玩梗')  : $language.succeed
     * $post = {
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
            data: Object.assign($user, await mysql.queryUser({uid: uid}, ['name'])),
        };
        return Object.assign({},$language.succeed,data);
    }

    History = {
        up: async (uid,post) => {
            const created = await mysql.insertUserHistory(uid,post)

            if(created){
                return $language.succeed;
            }

            mysql.updateUserHistory(uid,post)
            return $language.succeed;
        },
        one: async (uid, xid) => {
            const data = {
                data: await mysql.queryUserOneHistory(uid,xid)
            }

            return Object.assign({},$language.succeed,data);
        },
        all: async (uid, page, total) => {
            const data = {
                data: await mysql.queryUserAllHistory(uid,page,total)
            }

            return Object.assign({},$language.succeed,data);
        }
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

    async seriesEsList(xid){
        const data = {
            data : await mysql.querySeriesEsList(xid),
        };

        return Object.assign({},$language.succeed,data);
    }

    async queryEsVideo(vid){
        let data = {
            data : await mysql.queryEsVideo(vid),
        };
        if (data.data === null) return $language.video404

        let file = data.data.file;
        delete data.data.file;
        if(file.length > -1) data.data.localUrl = '/video/?vid=' + vid;

        return Object.assign({},$language.succeed,data);
    }

}


class Video {
    async getVideoPath(vid) {
        let cache = await $Cache.get(vid,'video');
        let data;

        if(cache !== null) {
            data = cache;
        } else {
            data = await mysql.queryEsVideo(vid);
            $Cache.set(vid,data,'video');
        }

        if(data == null) return null;
        return data.file;
    }
}

class mysql {

    /**
     * 查询用户
     * @name queryUser
     * @param where [] sql where条件
     * @param key string[] 返回键
     * @return object 用户信息
     */
    static async queryUser(where = [],key = undefined){
        return await $Sequelize.Users.findOne(({
            where: where,
            attributes: key
        })).then(obj => {
            return obj ? obj.dataValues : null;
        });
    }

    /**
     * 插入用户
     * @name insertUser
     * @param post object post参数
     * @return created Number 判断是否插入成功
     */
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

    /**
     * 插入用户历史记录
     * @name insertUserHistory
     * @param uid Number 用户id
     * @param post object post参数
     * @return created Number 判断是否插入成功
     */
    static async insertUserHistory(uid, post){
        return await $Sequelize.History.findOrCreate({
            where: {
                uid: uid,
                xid: post.xid
            },
            defaults: {
                uid: uid,
                xid: post.xid,
                es: post.es,
                lt: post.lt,
                time: $Sequelize.sequelize.fn('NOW')
            }
        }).then(([history, created]) => {
            return created;
        });
    }

    /**
     * 更新用户历史记录
     * @name updateUserHistory
     * @param uid Number 用户id
     * @param post object post参数
     * @return true
     */
    static async updateUserHistory(uid, post){
        return await $Sequelize.History.findOne({
            where: {
                uid: uid,
                xid: post.xid
            }
        }).then(history => {
            history.update({
                es: post.es,
                lt: post.lt,
                time: $Sequelize.sequelize.fn('NOW')
            });

            return true
        })
    }

    /**
     * 查询用户多个历史记录
     * @name queryUserAllHistory
     * @param uid Number 用户id
     * @param page Number 当前页数
     * @param total Number 当前页总数
     * @return list object
     */
    static async queryUserAllHistory(uid, page, total){
        return $Sequelize.History.findAll({
            where: {uid: uid},
            offset: total * (page - 1),
            limit: page * total,
            attributes: ['xid','es','lt','time']
        }).then(list => {
            return list;
        })
    }

    /**
     * 查询用户单个历史记录
     * @name queryUserOneHistory
     * @param uid Number 用户id
     * @param xid Number 系列id
     * @return object
     */
    static async queryUserOneHistory(uid, xid){
        return $Sequelize.History.findOne({
            where: {uid: uid},
            attributes: ['xid','es','lt','time']
        }).then(data => {
            return data ? data.dataValues : null;
        })
    }

    /**
     * 插入系列
     * @name insertSeries
     * @param name string 系列名称
     * @param sid Number 父系列id
     * @return created Number 判断是否插入成功
     */
    static async insertSeries(name, sid){
        return await $Sequelize.Series.findOrCreate({where: {name: name},
            defaults: {
                'name': name,
                'sid': sid,
                'total' : 0
            }
        }).then(([series, created]) => {
            return created;
        });

    }

    /**
     * 插入系列单集和对应的视频
     * @name insertEsAndVideo
     * @param xid Number 系列id
     * @param name string 话名称
     * @param post object post参数
     * @return true
     * @throws $language.DatabaseException
     */
    static async insertEsAndVideo(xid, name, post){
        let S = $Sequelize.sequelize;
        let es =  await this.querySeriesEsTotal(xid) + 1;
        return S.transaction(async t => {

            let vid = await $Sequelize.Es.create({
                    'xid': xid,
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
     * @name querySeriesEsTotal
     * @param xid Number 系列id
     * @return Number total
     * @throws $language.paramException
     */
     static async querySeriesEsTotal(xid){
        return $Sequelize.Series.findOne({
            where: { 'xid': xid },
            attributes: ['total']
        }).then(c => {
                if (c === null) throw $language.paramException;
                return c.total;
        })
    }

    /**
     * 查询系列列表
     * @name querySeriesList
     * @param page Number 当前页数
     * @param total Number 当前页总数
     * @return list object 系列列表
     */
    static async querySeriesList(page, total){
        return $Sequelize.Series.findAll({
            offset: total * (page - 1),
            limit: page * total
        }).then(list => {
            return list;
        })
    }

    /**
     * 查询系列总数
     * @name querySeriesListTotal
     * @return max Number 总数
     */
    static async querySeriesListTotal(){
        return $Sequelize.Series.max('xid').then(max => {
            return max;
        })
    }

    /**
     * 查询系列话列表
     * @name querySeriesListTotal
     * @param xid Number 系列id
     * @return list object 系列话列表
     */
    static async querySeriesEsList(xid){
        return $Sequelize.Es.findAll({
            where:{
                xid: xid,
            },
            attributes: ['es','name','vid']
        }).then(list => {
            return list;
        })
    }

    /**
     * 查询话对应视频
     * @name queryEsVideo
     * @param vid Number 视频id
     * @return object 视频路径，url
     */
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
    Video
};
const md5 = require('md5-node');
const randString = require('string-random');

class token {
    ctx;
    token;
    constructor(ctx) {
        this.ctx = ctx;
        this.token = $get.token ? $get.token : undefined ;
    }

    async getToken(user) {
        this.token = md5(JSON.stringify(user) + randString(30,true));
        this.setToken(user);
        return this.token;
    }

    async getUserInfo(){
        return $tokenObj[this.token] ? $tokenObj[this.token] : undefined;
    }

    async setToken(user){
        let keys = Object.keys($tokenObj);
        let len = keys.length;
        if (len >= 10) {
            let key = keys.shift();
            delete $tokenObj[key];
        }
        $tokenObj[this.token] = user;
    }
}

module.exports = (ctx,key) => {
    return new token(ctx,key);
};
const Session = require('koa-session');


const config = {
    key: 'koa:sess',
    maxAge: 86400000 * 30,
    overwrite: true,
    httpOnly: false,
    signed: false,
    rolling: false,
    renew: false,
};

module.exports = {
    Session,
    config
};


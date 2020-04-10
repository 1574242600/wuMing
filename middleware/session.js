const Session = require('koa-session');


const config = {
    key: 'koa:sess',
    maxAge: 86400000 * 30,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
};

module.exports = {
    Session,
    config
};


const Koa = require('koa');
const app = new Koa();
const session = require('./middleware/session');
const bodyParser = require('koa-bodyparser');
const onerror = require('./middleware/onerror');
const hreader = require('./middleware/headers');
const log = require('./utils/logger');
const router = require('./route');
const mysql  = require('./utils/mysql');
const language = require('./language/cn');

process.on('uncaughtException', (e) => {
    log.error('未捕获错误: ' + e);
});

app.proxy = true;
app.context.mysql = mysql;
app.context.language = language;
app.context.log = log;
app.use(session.Session(session.config,app));
app.use(bodyParser());
app.use(onerror);
app.use(hreader);
app.use(router.routes());
app.listen(3000);
log.info('监听端口 3000');
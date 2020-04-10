const Koa = require('koa');
const app = new Koa();
const config = require('./config');
const log = require('./utils/logger');
const session = require('./middleware/session');
const bodyParser = require('koa-bodyparser');
const onerror = require('./middleware/onerror');
const hreader = require('./middleware/headers');
const router = require('./route');
const init  = require('./middleware/init');
global.log = log;

process.on('uncaughtException', (e) => {
    log.error('未捕获错误: ' + e);
});

app.keys = config.keys;
app.proxy = true;
app.use(session.Session(session.config,app));
app.use(bodyParser());
app.use(onerror);
app.use(hreader);

app.use(init);

app.use(router.routes());
app.listen(3000);
log.info('监听端口 3000');
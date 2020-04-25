const Koa = require('koa');
const app = new Koa();
const log = require('./utils/logger');
const bodyParser = require('koa-bodyparser');
const onerror = require('./middleware/onerror');
const hreader = require('./middleware/headers');
const router = require('./route');
const Sequelize  = require('./utils/mysql');
const cache = require('./utils/cache');
const init  = require('./middleware/init');

//以$开头的为全局变量

global.$tokenObj = {};     //用户token
global.$cacheObj = {};     //缓存
global.$Sequelize = Sequelize;
global.$Cache = cache();
global.$log = log;


process.on('uncaughtException', (e) => {
    log.error('未捕获错误: ' + e);
});


app.proxy = true;
app.use(bodyParser());
app.use(onerror);
app.use(hreader);
app.use(init);

app.use(router.routes());
app.listen(3000);
log.info('监听端口 3000');
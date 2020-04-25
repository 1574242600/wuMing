const router = require('koa-router')();
const config = require('./config');
const User = require('./modules/user');
const Admin = require('./modules/admin');
const Video = require('./modules/video');
const Series = require('./modules/series');

router.get('/ddlc', async (ctx) => {
    ctx.response.body = Object.assign({},$language.succeed,{data: {siteName:config.sitename}});
});

router.get('/', async (ctx) => {
    ctx.response.body = `hello,world`;
});

router.get('/series/list',Series.seriesList);
router.get('/series/es/list',Series.esList);
router.get('/series/es/videoUrl',Series.videoUrl);
router.post('/user/login', User.login);
router.get('/user/info', User.info);
router.post('/admin/user/add', Admin.addUser);
router.post('/admin/series/add', Admin.addSeries);
router.post('/admin/es/add', Admin.addEsAndVideo);
router.get('/localVideo',Video);

module.exports = router;
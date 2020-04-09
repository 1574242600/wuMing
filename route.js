const router = require('koa-router')();
const User = require('./modules/user');
const Admin = require('./modules/admin');

//判断服务端是否存活   ps: just monika!
router.get('/ddlc', async (ctx) => {
    ctx.response.body = `{"code": 200}`;
});

router.get('/', async (ctx) => {
    ctx.response.body = `hello,world`;
});


router.post('/user/login', User.login);
router.get('/user/info', User.info);
router.post('/admin/user/add', Admin.addUser);
router.post('/admin/series/add', Admin.addSeries);

module.exports = router;
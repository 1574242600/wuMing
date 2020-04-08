module.exports = {
    succeed: {
        'code': 200,
        'mes': 'succeed'
    },
    loginErr1: {
        'code': 400,
        'mes': '账户或密码错误'
    },
    addUserError: {
        'code': 400,
        'mes': '用户已存在'
    },
    adminError: {
        'code': 401,
        'mes': '没有权限'
    },
    isUserFalse: {
        'code': 401,
        'mes': '你还没有登录'
    },
    paramException: [400 , '请输入正确的参数', 'info']
};
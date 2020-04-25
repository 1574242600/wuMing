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
    addSeriesError: {
        'code': 400,
        'mes': '系列已存在'
    },
    adminError: {
        'code': 401,
        'mes': '权限错误'
    },
    isUserFalse: {
        'code': 401,
        'mes': '你还没有登录'
    },
    video404: {
        'code': 404,
        'mes': '该视频不存在'
    },
    video416: {
        'code': 416,
        'mes': '无法处理所请求的数据区间'
    },
    addVideoException: [400, '文件不合法','error'],
    paramException: [400 , '请输入正确的参数', 'info'],
    DatabaseException: [500 , '数据库错误，详情请查看日志', 'error']
};
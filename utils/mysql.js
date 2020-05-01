const config = require('../config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    },
    timezone: '+08:00'
});

//todo 封面
const Series = sequelize.define('series', {
    xid: {
        type: Sequelize.INTEGER(),
        primaryKey: true,
        autoIncrement: true
    },
    sid: {
        type: Sequelize.INTEGER(),
        index: true,
        defaultValue: 0,
        allowNull:false
    },
    name: {
        type: Sequelize.STRING(64),
        allowNull:false
    },
    total: {
        type: Sequelize.INTEGER(),
        allowNull:false
    }
}, {
    timestamps: false ,
    freezeTableName: true
});

const Es = sequelize.define('es', {
    xid: {
        type: Sequelize.INTEGER(),
        primaryKey: true,
        autoIncrement: false,
        allowNull:false
    },
    es: {
        type:Sequelize.INTEGER(),
        index: true,
        allowNull:false
    },
    name: {
        type: Sequelize.STRING(64),
        allowNull:false
    },
    vid: {
        type: Sequelize.INTEGER(),
        primaryKey: true,
        autoIncrement: true,
        allowNull:false
    }
}, {
    timestamps: false ,
    freezeTableName: true
});

const Videos = sequelize.define('videos', {
    vid: {
        type: Sequelize.INTEGER(),
        allowNull:false,
        unique: true,
    },
    url: {
        type: Sequelize.STRING(128),
        allowNull:false
    },
    file: {
        type: Sequelize.STRING(128),
        allowNull:false
    }
}, {
    timestamps: false ,
    freezeTableName: true
});


const Users = sequelize.define('users', {
    uid: {
        type: Sequelize.INTEGER(),
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: Sequelize.STRING(64),
        unique: true,
        allowNull:false
    },
    pwd: {
        type: Sequelize.STRING(32),
        allowNull:false
    },
    rand: {
        type: Sequelize.STRING(6),
        allowNull:false
    },
    admin: {
        type: Sequelize.INTEGER(),
        defaultValue: 0,
        allowNull:false
    }
}, {
    timestamps: false ,
    freezeTableName: true
});


const History = sequelize.define('history', {
    uid: {
        type: Sequelize.INTEGER(),
        index: true,
    },
    xid: {
        type: Sequelize.INTEGER(),
        primaryKey: true,
        allowNull:false,
        autoIncrement: false,
    },
    es: {
        type: Sequelize.INTEGER(),
        index: true,
        allowNull:false
    },
    lt: {
        type: Sequelize.INTEGER(),
        allowNull:false
    },
    time: {
        type: Sequelize.DATE,
        allowNull:false
    }
}, {
    timestamps: false ,
    freezeTableName: true
});


Es.removeAttribute('id');
Videos.removeAttribute('id');
Series.removeAttribute('id');
History.removeAttribute('id');


Series.hasMany(Es,{ foreignKey: 'xid' });
Series.hasMany(History,{ sourceKey: 'xid',foreignKey: 'xid' });
Users.hasMany(History,{ foreignKey: 'uid' });
Es.hasMany(Videos,{ sourceKey: 'vid', foreignKey: 'vid'});


//sequelize.sync();

module.exports = {
    sequelize,
    Users,
    Series,
    Es,
    Videos,
    History
};


/*
系列表 `series`

| 字段名 | 类型 | 备注 |
|-------|-----|-------|
| xid    | int(11) pr(auto) | xid |
| sid   | int(11)  默认 0  | 父id |
| name  | vchar(64)        | 名称 |
| total | int(11)          | 总话数 |

话数表 `es`

| 字段名 | 类型 | 备注 |
|-------|-----|-------|
| series.xid    | int(11) pr      | 见系列表 |
| es    | int(11) index    | 话数 |
| name  | vchar(64)        | 话名称 |
| vid   | int(11) un(auto)          | 视频id |

视频表 `videos`

| 字段名 | 类型 | 备注 |
|-------|-----|-------|
| es.vid    | int(11) pr  | 视频id |
| url    | vchar(128)        | 视频url |
| file   | vchar(128)        | 视频文件路径 |

用户表 `users`

| 字段名 | 类型 | 备注 |
|-------|-----|-------|
| uid    | int(11) pr (auto)  | 用户id |
| name   | vchar(32)  UN      | 用户名 |
| pwd    | char(32)           |  密码 |
| rand   | char(6)            | 随机字符串|
| admin | int(11)    默认 0  | 5创始人 4管理员 2-3未定义 1用户|

收藏表

| 字段名 | 类型 | 备注 |
|-------|-----|-------|
| users.uid    | int(11) pr         | 见用户表 |
| list   | int(11)            | 收藏     |

历史记录表 `history`

| 字段名 | 类型 | 备注 |
|-------|-----|-------|
| users.uid  | int(11) index        | 见用户表 |
| series.xid   | int(11) pr          | 见系列表 |
| es   | int(11)  index          | 当前话数 |
| lt   | int(11)            | 上一次观看进度 |
| time | date               | 上一次观看时间 |

 */
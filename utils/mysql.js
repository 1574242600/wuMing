const config = require('../config');
const Sequelize = require('sequelize');

const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

const Series = sequelize.define('series', {
    id: {
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
    id: {
        type: Sequelize.INTEGER(),
        primaryKey: true,
    },
    sid: {
        type:Sequelize.INTEGER(),
        defaultValue: 0,
        index: true,
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
        allowNull:false
    }
}, {
    timestamps: false ,
    freezeTableName: true
});

const Videos = sequelize.define('videos', {
    vid: {
        type: Sequelize.INTEGER(),
        primaryKey: true,
        autoIncrement: true,
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

//sequelize.sync();

module.exports = {
    Users,
    Series,
    Es,
    Videos
};
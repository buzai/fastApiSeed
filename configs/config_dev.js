const redisConfig = {
    host: '127.0.0.1',
    port: 6379,
    password: "",
    db: 0,
}

const mysqlConfig = {
    "dialect": "mysql",
    "host": "127.0.0.1",
    "username": "root",
    "password": "",
    "database": "",
    "benchmark": true,
    "timestamp": true,
    logging(...args) {
        const used = typeof args[1] === 'number' ? `[${args[1]}ms]` : '';
        console.log('[sequelize]%s %s', used, args[0]);
    },
    timezone: '+08:00' //东八区
}

const server = {
    port: 4000
}

module.exports = {
    mysqlConfig: {
        main: mysqlConfig,
    },
    redisConfig,
    server,
    swagger: {
        https: false,
        prefix: ''
    },
}

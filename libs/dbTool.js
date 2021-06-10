const Redis = require("ioredis");
const fs = require("fs");
const Sequelize = require("sequelize");
const mysqlCfg = G.config.mysqlConfig;
const _ = require("lodash");

class SequelizedbTool {
    constructor(options) {
        this.options = options;
        this.connection = null;
    }

    async connect() {
        const sequelize = new Sequelize(this.options)
        this.connection = sequelize;
        return this;
    }
    async assignModels(models){
        this.models = models;
    }
    getDB() {
        return this.connection
    }
    getAllModels() {
        return this.models;
    }
    getModel(name) {
        return this.models[name];
    }
}

class RedisdbTool {
    constructor(options) {
        this.options = options;
        this.redis = null;
    }
    async connect() {
        let redis = new Redis(this.options);
        this.redis = redis;
        return this;
    }
}

exports.RedisIntall = async function (ops) {
    let dbtl = new RedisdbTool(ops);
    let db = await dbtl.connect();
    G.db.redis = db.redis;
    return db;
}

exports.SequelizeIntall = async function (ops) {
    let dbtool = new SequelizedbTool(ops)
    await dbtool.connect();
    G.db.mysqlConnect = dbtool.getDB();
    return dbtool;
};

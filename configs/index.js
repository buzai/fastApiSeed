module.exports.install = async function(env) {
    let config = require('./config_' + env);
    return config;
} 
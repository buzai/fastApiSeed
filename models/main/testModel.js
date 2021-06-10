module.exports = function (sequelize, DataTypes) {
    let testModel = sequelize.define("testTable", {
        name: DataTypes.STRING,
    });
    // alter:true
    testModel.sync({});
    return testModel;
};

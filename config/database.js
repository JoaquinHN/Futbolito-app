const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('futbolito','drosa','admin',{
    host : 'localhost',
    dialect : 'mysql',
    logging : false
});


module.exports = sequelize;

const Sequelize = require('sequelize');
const User = require('./user');
const Classes = require('./classes');
const ClassStudent = require('./classStudent');

const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const db = {};

const sequelize = new Sequelize(
    config.database, config.username, config.password, config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Classes = Classes;
db.ClassStudent = ClassStudent;

User.init(sequelize);
Classes.init(sequelize);
ClassStudent.init(sequelize);

User.associate(db);
Classes.associate(db);
ClassStudent.associate(db);

module.exports = db;



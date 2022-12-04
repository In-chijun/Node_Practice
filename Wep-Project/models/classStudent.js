const Sequelize = require('sequelize');

module.exports = class ClassStudent extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      class_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        foreignKey: true,
      },
      id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        primaryKey: true,
        foreignKey: true
      },
    }, {
      sequelize,
      timestamps: false,
      modelName: 'ClassStudent',
      tableName: 'classStudent',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.ClassStudent.belongsTo(db.User, { foreignKey: 'id' });
    db.ClassStudent.belongsTo(db.Classes, { foreignKey: 'class_id' });
  }
};

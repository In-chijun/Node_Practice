const Sequelize = require('sequelize');

module.exports = class Classes extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      class_id: {
        type: Sequelize.STRING(100),
        allowNull: false,
        primaryKey: true
      },
      class_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      user_id: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      professor_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      students: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      day: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
    }, {
      sequelize,
      timestamps: false,
      modelName: 'Classes',
      tableName: 'classes',
      paranoid: false,
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    });
  }

  static associate(db) {
    db.Classes.belongsToMany(db.User, { through: 'classStudent', foreignKey: 'class_id' });
  }
};

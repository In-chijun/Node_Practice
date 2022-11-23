const Sequelize = require('sequelize');

module.exports = class Info extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            age: {
                type: Sequelize.INTEGER,
                allowNull: false
            },
        }, {
            sequelize,
            timestamps: false,
            underscored: false,
            modelName: 'Info',
            tableName: 'infos',
            paranoid: false,
            charset: 'utf8mb4',
            collate: 'utf8mb4_general_ci',
        });
    }

    static associate(db) {
        db.Info.belongsTo(db.User, { foreignKey: 'userId', targetKey: 'id' });
    }
};
    
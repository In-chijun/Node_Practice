const Sequelize = require('sequelize');

module.exports = class Info extends Sequelize.Model { // 그냥 테이블이다. 깊게 보려고 하는 것보다, 전체적인 것을 이해하자.
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

module.exports = (sequelize, Sequelize) => {
    const Branch = sequelize.define("branch", {
        branchID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            field: 'branchid',
        },
        address: {
            type: Sequelize.STRING,
            field: 'address',
        },
    },
        {
            freezeTableName: true,

            timestamps: false,

            createdAt: false,

            updatedAt: false,
        });
    Branch.associate = function (models) {

        Branch.belongsTo(models.account, {
            foreignKey: 'userid',
            // onDelete: 'SET NULL',
        });
        Branch.hasMany(models.invoice, {
            as: "invoice",
            foreignKey: "branchid",
        });
    }
    return Branch;
};
module.exports = (sequelize, Sequelize) => {
    const ProductImage = sequelize.define("productimage", {
        userID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            field: 'userid',
        },
        ProductID: {
            type: Sequelize.STRING,
            field: 'productid'
        },
        imageURL: {
            type: Sequelize.STRING,
            field: 'imageurl'
        },
    });

    ProductImage.associate = function (models) {

        ProductImage.belongsTo(models.product,
            {
                foreignKey: 'productid',
                onDelete: 'SET NULL',
            });

    }

    return ProductImage;
};
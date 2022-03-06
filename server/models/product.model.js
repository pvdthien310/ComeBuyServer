module.exports = (sequelize, Sequelize) => {
    const Product = sequelize.define("product", {
        productID: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
            field: 'productid',
        },
        ram: {
            type: Sequelize.STRING,
            field: 'ram',
        },
        memory: {
            type: Sequelize.STRING,
            field: 'memory',
        },
        gpu: {
            type: Sequelize.STRING,
            field: 'gpu',
        },
        cpu: {
            type: Sequelize.STRING,
            field: 'cpu',
        },
        name: {
            type: Sequelize.STRING,
            field: 'name',
        },
        brand: {
            type: Sequelize.STRING,
            field: 'brand',
        },
        description: {
            type: Sequelize.STRING,
            field: 'description',
        },
        weight: {
            type: Sequelize.STRING,
            field: 'weight',
        },
        origin: {
            type: Sequelize.STRING,
            field: 'origin',
        },
        screenDimension: {
            type: Sequelize.STRING,
            field: 'screendimension',
        },
        colorCoverage: {
            type: Sequelize.INTEGER,
            field: 'colorcoverage',
        },
        externalIOPort: {
            type: Sequelize.STRING,
            field: 'externalioport',
        },
        battery: {
            type: Sequelize.STRING,
            field: 'battery',
        },
        warranty: {
            type: Sequelize.STRING,
            field: 'warranty',
        },
        promotion: {
            type: Sequelize.STRING,
            field: 'promotion',
        },
    },
    {
        freezeTableName: true,
  
        timestamps: false,
  
        createdAt: false,
  
        updatedAt: false,
      });
    Product.associate = function (models) {
        Product.hasMany(models.productimage, {
            as:"productimage",
            foreignKey: "productid",
        });
        Product.belongsToMany(models.feature, {
            through: "product_feature",
            as: "feature",
            foreignKey: "productid",
          });
    }
    return Product;
};
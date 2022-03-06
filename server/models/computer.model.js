module.exports = (sequelize, Sequelize) => {
    const Computer = sequelize.define("computer", {
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      official: {
        type: Sequelize.BOOLEAN
      },
      brand: {
        type: Sequelize.STRING
      }
    },
    {
      freezeTableName: true,

      timestamps: false,

      createdAt: false,

      updatedAt: false,
    });
    return Computer;
  };
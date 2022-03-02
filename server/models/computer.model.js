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
    });
    return Computer;
  };
module.exports = (sequelize, Sequelize) => {
    const Account = sequelize.define("account", {
      userID: {
        type: Sequelize.STRING
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      dob: {
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      role: {
        type: Sequelize.STRING
      },
      sex: {
        type: Sequelize.STRING
      },
      bio: {
        type: Sequelize.STRING
      },
    });
    return Account;
  };
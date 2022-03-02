module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "dithien8520A",
    DB: "mytestdb",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
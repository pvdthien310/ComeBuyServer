module.exports = {
    host: "ec2-54-156-110-139.compute-1.amazonaws.com",
    user: "ovzjvxulraxgun",
    password: "6a7a21088573a0da49ea11793a6381f1311a0e70552dbe553c2bfeaf598b9fea",
    database: "d1bivukjltv8os",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // <<<<<<< YOU NEED THIS TO FIX UNHANDLED REJECTION
      }
    }
  };
module.exports = {
    host: "ec2-35-153-35-94.compute-1.amazonaws.com",
    user: "ojzxtvwablxwnl",
    password: "0fc0101f269f04db76448d1ff8ddf238a709cb7fc25298e0ce8d5b6ae7559518",
    database: "d914vnfc67o3s2",
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
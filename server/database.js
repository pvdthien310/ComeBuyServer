const mongoose = require('mongoose');
const db = require("./models");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Database connected successfully !');
  } catch (error) {
    console.log('Database Connection: ', error.message);
    process.exit(1);
  }
};

const connectDB_PostgresSQL = async () => {
  
  db.sequelize.sync().then(() => {   
    console.log("Database connected successfully !");
  });
  
};

module.exports = {connectDB,connectDB_PostgresSQL};
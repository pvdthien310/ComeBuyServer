const express = require('express');
const cors = require('cors');
require('dotenv').config();

//Config
const app = express();
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//test connection
app.get('/', (req, res) => {
  res.send('Hello my database');
});

//config route 
require("./routes/computer.routes")(app);
require("./routes/account.routes")(app);
require("./routes/authentication.routes")(app);
require("./routes/product.routes")(app);
require("./routes/productImage.routes")(app);
require("./routes/feature.routes")(app);



module.exports = app;


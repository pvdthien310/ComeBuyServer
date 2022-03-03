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

app.get('/', (req, res) => {
  res.send('Hello my database');
});
require("./routes/computer.routes")(app);

module.exports = app;


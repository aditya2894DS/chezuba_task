const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
const port = 3001;

// import db from "./Config/db.cofig";

const order = require('./Routes/OrderRoutes');

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());

app.use('/order', order)

app.post("/", (req, res) => {
  res.send(req.body)
});

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});

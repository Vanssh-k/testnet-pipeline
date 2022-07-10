const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const errorHandler = require("./middlewares/error-handler");
require("dotenv").config();

global.__basedir = __dirname;

app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/gateway", require("./routes/gateway"));
app.use("/api/lighthouse", require("./routes/lighthouse"));
app.use("/api/encryption", require("./routes/encryption"));

app.use(errorHandler);

module.exports = app;

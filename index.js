const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");

app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/api/estuary", require("./routes/estuary"));
app.use("/api/wallet", require("./routes/wallet"));

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running on port 8000");
});

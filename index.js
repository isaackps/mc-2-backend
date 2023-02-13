const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");
const companyRoutes = require("./routes/companyRoutes");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "MC",
  })
  .then(() => {
    const app = express();

    const port = process.env.PORT || 8080;

    app.use(helmet());
    app.use(bodyParser.json());
    app.use(cors());
    app.use(morgan("combined"));

    app.use("/api/v1.0/market/company", companyRoutes);

    app.listen(port, () => {
      console.log(`server has started! listening on port ${port}`);
    });
  });

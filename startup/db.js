const winston = require("winston");
const mongoose = require("mongoose");
require("./logging");

module.exports = function () {
  //   const files = new winston.transports.File({ filename: "logfile2.log" });
  //   winston.add(files);
  mongoose
    .connect("mongodb://localhost/vidly", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => winston.info("Connected to MongoDB..."));
};

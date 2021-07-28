require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
require("./startup/routes")(app);
const mongoose = require("mongoose");

// handle exceptions
winston.exceptions.handle(
  new winston.transports.File({ filename: "exceptions.log" })
);

// handle rejections by throwing exception to exceptions handler
process.on("unhandledRejection", (ex) => {
  throw ex;
});

// keep log file in winston transports
const files = new winston.transports.File({ filename: "logfile.log" });
winston.add(files);
winston.add(
  new winston.transports.MongoDB({
    db: "mongodb://localhost/vidly",
    level: "error",
    options: {
      useUnifiedTopology: true,
    },
  })
);

// // test - uncaught promises rejection
// const p = Promise.reject(new Error("Something failed miserably!"));
// p.then(() => console.log("Done"));

// // test - uncaught exception
// throw new Error("Something failed during startup.");

if (!config.get("jwtPrivateKey")) {
  console.error("FETAL ERROR: jwtPrivateKey is not defined.");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.log("Could not connect to MongoDB...", err));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

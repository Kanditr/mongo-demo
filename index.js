require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const error = require("./middleware/error");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const customers = require("./routes/customers");
const genres = require("./routes/genres");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/users");
const auth = require("./routes/auth");
const express = require("express");
const app = express();
const mongoose = require("mongoose");

// process.on("uncaughtException", (ex) => {
//   winston.error(ex.message, ex);
//   // process.exit(1);
// });

winston.exceptions.handle(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", (ex) => {
  // winston.error(ex.message, ex);
  // process.exit(1);
  throw ex;
});

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

const p = Promise.reject(new Error("Something failed miserably!"));
p.then(() => console.log("Done"));

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

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

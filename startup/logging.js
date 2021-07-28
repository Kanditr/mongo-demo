const winston = require("winston");
const { createLogger, format, transports } = winston;
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  // logging format
  const logFormat = format.printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
  });

  // handle uncaught exceptions
  winston.createLogger({
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.colorize(),
      logFormat
    ),
    exceptionHandlers: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "exceptions.log" }),
    ],
  });

  // handle uncaught rejections
  winston.createLogger({
    format: format.combine(
      format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      format.colorize(),
      logFormat
    ),
    rejectionHandlers: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "rejections.log" }),
    ],
  });

  // keep log file in winston transports
  const files = new winston.transports.File({
    filename: "logfile.log",
    format: format.combine(format.timestamp(), format.prettyPrint()),
  });

  const console = new winston.transports.Console({
    format: format.combine(
      format.timestamp(),
      format.colorize(),
      format.simple()
    ),
  });

  const db = new winston.transports.MongoDB({
    db: "mongodb://localhost/vidly",
    level: "info",
    options: {
      useUnifiedTopology: true,
    },
  });

  winston.add(console);
  winston.add(files);
  winston.add(db);

  // // test - uncaught exception
  // throw new Error("Something failed during startup.");

  // // test - uncaught promises rejection
  // const p = Promise.reject(new Error("Something failed miserably!"));
  // p.then(() => console.log("Done"));
};

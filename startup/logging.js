const winston = require("winston");
const { createLogger, format, transports } = winston;
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  // handle exceptions
  winston.exceptions.handle(
    new winston.transports.Console({
      format: format.combine(
        format.simple(),
        format.timestamp(),
        format.colorize(),
        format.simple()
      ),
    }),
    new winston.transports.File({ filename: "exceptions.log" })
  );

  //   // new method
  //   const logger = createLogger({
  //     format: format.combine(format.timestamp(), format.simple()),
  //     transports: [new transports.File({ filename: "combined.log" })],
  //     exceptionHandlers: [new transports.File({ filename: "exceptions.log" })],
  //   });

  //   logger.info({
  //     message: "test new logging method",
  //   });

  // handle rejections by throwing exception to exceptions handler
  process.on("unhandledRejection", (ex) => {
    throw ex;
  });

  // keep log file in winston transports
  winston.add(
    new winston.transports.Console({
      format: format.combine(
        format.simple(),
        format.timestamp(),
        format.colorize(),
        format.simple()
      ),
    })
  );
  winston.add(new winston.transports.File({ filename: "logfile.log" }));
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidly",
      level: "info",
      options: {
        useUnifiedTopology: true,
      },
    })
  );

  //   // // test - uncaught promises rejection
  //   // const p = Promise.reject(new Error("Something failed miserably!"));
  //   // p.then(() => console.log("Done"));

  //   // test - uncaught exception
  //   throw new Error("Something failed during startup.");
};

// const logger = createLogger({
//   format: format.combine(format.timestamp(), format.simple()),
//   transports: [
//     new transports.Console({
//       format: format.combine(
//         format.timestamp(),
//         format.colorize(),
//         format.simple()
//       ),
//     }),
//     new winston.transports.File({ filename: "example.log" }),
//   ],
// });

// logger.info({
//   message: "Check example.log – it will have no colors!",
// });

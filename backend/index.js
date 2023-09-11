const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const createError = require("http-errors");
require("dotenv").config();

const coursesEndpoint = require("./api/courses");

const app = express();

console.log(`Found mongoDB url: ${process.env.MONGODB_URL}`);

// MongoDB Connection
const mongoOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(
  process.env.MONGODB_URL || "mongodb://localhost/coursedatabase",
  mongoOptions
);
mongoose.connection.on("connected", () => console.log("MongoDB connected!"));
mongoose.connection.on("error", (err) =>
  console.error(`MongoDB connection error: ${err}`)
);
mongoose.connection.on("disconnected", () =>
  console.log("MongoDB disconnected.")
);

app.use(cors());

if (app.get("env") === "development") {
  app.use(logger("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/courses/:code", coursesEndpoint);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Return error as JSON instead of rendering
  res.status(err.status || 500).json({
    error: {
      message: err.message,
      status: err.status,
    },
  });
});

const port = process.env.PORT || 5000;
app.listen(port);

module.exports = app;

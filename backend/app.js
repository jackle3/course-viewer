const createError = require("http-errors");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");

const app = express();

// Connect to MongoDB
mongoose.connect("mongodb://localhost/coursedatabase", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define Mongoose Schema and Model
const courseSchema = new mongoose.Schema({
  year: String,
  subject: String,
  code: String,
  title: String,
  description: String,
  repeatable: Boolean,
  grading: String,
  unitsMin: Number,
  unitsMax: Number,
  sections: Array,
  gers: Array,
  objectID: String,
  number: String,
  units: Array,
  totalSections: Number,
});

const Course = mongoose.model("Course", courseSchema);

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Get course by code
app.get("/courses/:code", async (req, res) => {
  try {
    const code = req.params.code;
    const spacedCode = code.replace(/([a-zA-Z]+)(\d+)/, "$1 $2");
    const sanitizedCode = spacedCode.replace(/\s+/g, "\\s*"); // Sanitize the input code
    const regex = new RegExp(`^${sanitizedCode}`, "i"); // Construct the regular expression
    const course = await Course.find({ number: { $regex: regex } });
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

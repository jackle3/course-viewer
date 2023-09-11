const mongoose = require("mongoose");
require("dotenv").config();

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
  sanitizedNumber: String, // Adding the sanitized field
});

const Course = mongoose.model("Course", courseSchema);

module.exports = async (req, res) => {
  try {
    const code = req.query.code || req.params.code;
    const sanitizedCode = code.replace(/\s+/g, "").toLowerCase();
    const regex = new RegExp(`^${sanitizedCode}`);

    const projection =
      "subject code title description unitsMax sections gers objectID number";
    const course = await Course.find(
      { sanitizedNumber: { $regex: regex } },
      projection
    );

    if (course && course.length > 0) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

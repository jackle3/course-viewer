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
});

const Course = mongoose.model("Course", courseSchema);

module.exports = async (req, res) => {
  try {
    const code = req.query.code || req.params.code; 

    const spacedCode = code.replace(/([a-zA-Z]+)(\d+)/, "$1 $2");
    const sanitizedCode = spacedCode.replace(/\s+/g, "\\s*"); 
    const regex = new RegExp(`^${sanitizedCode}`, "i"); 
    const course = await Course.find({ number: { $regex: regex } });
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

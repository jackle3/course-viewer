const mongoose = require("mongoose");
const LRU = require("lru-cache");
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

// Initialize LRU cache
const cache = new LRU({
  max: 500, // Maximum number of items in cache
  maxAge: 1000 * 60 * 60, // Cache results for 1 hour
});

module.exports = async (req, res) => {
  try {
    const code = req.query.code || req.params.code;
    const sanitizedCode = code.replace(/\s+/g, "").toLowerCase();
    const regex = new RegExp(`^${sanitizedCode}`);

    // Check if the result is already in cache
    const cachedResult = cache.get(sanitizedCode);
    if (cachedResult) {
      return res.json(cachedResult);
    }

    const course = await Course.find({ sanitizedNumber: { $regex: regex } });

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

require('dotenv').config({ path: path.join(__dirname, '../.env') });


function readAndParseCSV(csvFilePath) {
  return new Promise((resolve, reject) => {
    const csvData = [];

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on("data", (data) => {
        csvData.push(data);
      })
      .on("end", () => {
        resolve(csvData);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
}

const dataDir = path.join(__dirname, "data/json");
const files = fs.readdirSync(dataDir);

const jsonData = [];
files.forEach((file) => {
  const filePath = path.join(dataDir, file);
  const data = fs.readFileSync(filePath, "utf-8");
  jsonData.push(JSON.parse(data));
});

const csvFilePath = "data/lookup.csv";

console.log(`${jsonData.length} departments found`);

async function main() {
  try {
    const csvData = await readAndParseCSV(csvFilePath);
    console.log(`Updating ${csvData.length} courses`);
    const csvDataMap = new Map(
      csvData.map((csvEntry) => [csvEntry["Class"], csvEntry])
    );

    const coursesToInsert = [];

    jsonData.forEach((department) => {
      department.forEach((course) => {
        const number = course["number"];
        course["sanitizedNumber"] = number.replace(/\s+/g, "").toLowerCase(); // Add sanitizedNumber

        course["hours"] = -1;
        course["evaluation"] = -1;
        course["percent"] = -1;

        if (csvDataMap.has(number)) {
          const csvEntry = csvDataMap.get(number);
          course["hours"] = parseFloat(csvEntry["Median Hours"]);
          course["evaluation"] = parseFloat(csvEntry["Average Eval"]);
          course["percent"] = parseFloat(csvEntry["Percent Completed"]);
        }

        coursesToInsert.push(course);
      });
    });

    console.log(`Updated ${jsonData.length} departments`);

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
      hours: Number,
      evaluation: Number,
      percent: Number,
      sanitizedNumber: String, // Include in the schema
    });

    courseSchema.index({ sanitizedNumber: 1 }); // Index the sanitizedNumber

    const Course = mongoose.model("Course", courseSchema);

    console.log("Created course collection and schema");

    console.log("Connecting to MongoDB...");
    console.log(`Found mongoDB url: ${process.env.MONGODB_URL}`);

    await mongoose.connect(
      process.env.MONGODB_URL || "mongodb://localhost/coursedatabase",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB Connected...");

    await Course.deleteMany({});
    console.log("Successfully wiped collection...");
    await Course.insertMany(coursesToInsert);

    console.log("Data import successful!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error reading/parsing CSV or processing MongoDB:", error);
  }
}

main();

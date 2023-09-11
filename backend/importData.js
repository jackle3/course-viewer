const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

// Define a function to read and parse the CSV file
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

// Read JSON Files
const dataDir = path.join(__dirname, "data/json");
const files = fs.readdirSync(dataDir);

const jsonData = [];
files.forEach((file) => {
  const filePath = path.join(dataDir, file);
  const data = fs.readFileSync(filePath, "utf-8");
  jsonData.push(JSON.parse(data));
});

const csvFilePath = "data/lookup.csv";

async function main() {
  try {
    const csvData = await readAndParseCSV(csvFilePath);

    // Combine the parsed CSV data with 'jsonData' based on a common identifier ('number' and 'Class')
    const csvDataMap = new Map(
      csvData.map((csvEntry) => [csvEntry["Class"], csvEntry])
    );

    // Loop through 'jsonData' and add fields from the CSV data
    jsonData.forEach((department) => {
      department.forEach((course) => {
        const number = course["number"];

        course["hours"] = -1;
        course["evaluation"] = -1;
        course["percent"] = -1;

        if (csvDataMap.has(number)) {
          // Add fields from the CSV data to 'obj'
          const csvEntry = csvDataMap.get(number);
          course["hours"] = parseFloat(csvEntry["Median Hours"]);
          course["evaluation"] = parseFloat(csvEntry["Average Eval"]);
          course["percent"] = parseFloat(csvEntry["Percent Completed"]);
        }
      });
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
      hours: Number,
      evaluation: Number,
      percent: Number,
    });

    const Course = mongoose.model("Course", courseSchema);

    await mongoose.connect("mongodb://localhost/coursedatabase", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");

    // Wipe the database by deleting all documents from the collection
    await Course.deleteMany({});

    // Store Data into Database
    const savePromises = [];
    jsonData.forEach((data) => {
      data.forEach((course) => {
        const courseData = new Course(course);
        savePromises.push(courseData.save());
      });
    });

    await Promise.all(savePromises);
    console.log("Data import successful!");
    // Close MongoDB Connection
    mongoose.connection.close();
  } catch (error) {
    console.error("Error reading/parsing CSV or processing MongoDB:", error);
  }
}

main();

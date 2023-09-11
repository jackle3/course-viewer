const mongoose = require("mongoose");
const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

require("dotenv").config();

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

async function main() {
    try {
        const csvData = await readAndParseCSV(csvFilePath);
        const csvDataMap = new Map(csvData.map((csvEntry) => [csvEntry["Class"], csvEntry]));

        const coursesToInsert = [];

        jsonData.forEach((department) => {
            department.forEach((course) => {
                const number = course["number"];

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

        await mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/coursedatabase", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected...");

        await Course.deleteMany({});
        await Course.insertMany(coursesToInsert);

        console.log("Data import successful!");
        mongoose.connection.close();
    } catch (error) {
        console.error("Error reading/parsing CSV or processing MongoDB:", error);
    }
}

main();
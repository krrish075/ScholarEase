const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const Scholarship = require('./models/Scholarship');
const Exam = require('./models/Exam');
const User = require('./models/User');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI is not defined in .env file.");
    process.exit(1);
}

const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log("Connected to MongoDB...");

        // Clear existing data (optional, handling with care)
        await Scholarship.deleteMany({});
        await Exam.deleteMany({});
        await User.deleteMany({});
        console.log("Cleared existing data...");

        // Read Local Files
        const dataPath = path.join(__dirname, 'data', 'mockData.json');
        const usersPath = path.join(__dirname, 'data', 'users.json');

        const mockData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const usersData = JSON.parse(fs.readFileSync(usersPath, 'utf8'));

        // Insert Data
        if (mockData.scholarships && mockData.scholarships.length > 0) {
            await Scholarship.insertMany(mockData.scholarships);
            console.log(`Inserted ${mockData.scholarships.length} scholarships.`);
        }

        if (mockData.exams && mockData.exams.length > 0) {
            await Exam.insertMany(mockData.exams);
            console.log(`Inserted ${mockData.exams.length} exams.`);
        }

        if (usersData && usersData.length > 0) {
            await User.insertMany(usersData);
            console.log(`Inserted ${usersData.length} users.`);
        }

        console.log("Data seeding completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedDatabase();

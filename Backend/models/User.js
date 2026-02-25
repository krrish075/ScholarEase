const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true }, // Keeping numeric ID for compatibility with your existing logic
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileCompleted: { type: Boolean, default: false },
    savedScholarships: [{ type: Number }], // Array of Scholarship IDs

    // Profile Fields
    category: { type: String },
    income: { type: String }, // Storing as string based on your JSON, can parse later
    state: { type: String },
    gender: { type: String },
    is_minority: { type: Boolean, default: false },
    is_pwd: { type: Boolean, default: false },
    cgpa: { type: String },
    year: { type: String },
    degree: { type: String },
    education_level: { type: String },
    stream: { type: String }
});

module.exports = mongoose.model('User', UserSchema);

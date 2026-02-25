const mongoose = require('mongoose');

const ExamSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    date: { type: String },
    info: { type: String },
    study_materials: [{
        title: String,
        link: String
    }],
    recommended_books: [{ type: String }],
    preparation_tips: { type: String }
});

module.exports = mongoose.model('Exam', ExamSchema);

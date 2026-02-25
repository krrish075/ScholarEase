const mongoose = require('mongoose');

const ScholarshipSchema = new mongoose.Schema({
    id: { type: Number, required: true, unique: true },
    name: { type: String, required: true },
    type: { type: String },
    stream: { type: String },
    category: [{ type: String }],
    education_level: [{ type: String }],
    income_limit: { type: Number },
    country: { type: String },
    state: { type: String },
    description: { type: String },
    benefits: [{ type: String }],
    selection_process: { type: String },
    seats: { type: Number },
    previous_cutoff: { type: String },
    application_steps: [{ type: String }],
    contact_info: {
        email: String,
        phone: String
    },
    study_materials: [{
        title: String,
        link: String
    }],
    dates: {
        start: String,
        end: String,
        result: String
    },
    documents: [{ type: String }],
    official_link: { type: String },
    is_minority: { type: Boolean, default: false },
    is_pwd: { type: Boolean, default: false },
    min_percentage: { type: Number },
    min_cgpa: { type: Number },
    year_of_study: [{ type: String }],
    gender: { type: String }
});

module.exports = mongoose.model('Scholarship', ScholarshipSchema);

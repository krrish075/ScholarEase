const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser'); // Still used, though express has it built-in now
const nodemailer = require('nodemailer');
const os = require('os');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret_key_repalce_in_production';

// Helper to keep the app running even if DB isn't connected yet (for Vercel build phase)
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Import Models
const User = require('./models/User');
const Scholarship = require('./models/Scholarship');
const Exam = require('./models/Exam');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// --- DB CONNECTION ---
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
    }
};
// Connect immediately locally, but Vercel may need per-request connection
connectDB();

// --- MIDDLEWARE ---
const checkAdmin = (req, res, next) => {
    const user = req.headers['x-admin-user'];
    const password = req.headers['x-admin-password'];

    if (user === 'AmitYadav' && password === '7276@Amit') {
        next();
    } else {
        res.status(403).json({ success: false, message: "Unauthorized: Invalid Admin Credentials" });
    }
};

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ success: false, message: 'No token provided' });

    // bearer token
    const tokenParts = token.split(' ');
    const tokenString = tokenParts.length === 2 ? tokenParts[1] : tokenParts[0];

    jwt.verify(tokenString, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ success: false, message: 'Unauthorized, Invalid Token' });
        req.userId = decoded.id; // decoded.id will hold the Mongo _id or numeric id
        next();
    });
};

// --- EMAIL CONFIGURATION (Nodemailer) ---
let transporter;
async function createTestAccount() {
    try {
        let testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: { user: testAccount.user, pass: testAccount.pass },
        });
        console.log("Email Service Ready (Ethereal Mock)");
    } catch (e) {
        console.log("Email service failed to initialize", e);
    }
}
createTestAccount();

// --- API ROUTES ---

// 1. SCHOLARSHIPS (Public Read)
app.get('/api/scholarships', async (req, res) => {
    await connectDB();
    try {
        // Fetch all and filter in memory to preserve existing complex filter logic perfectly
        // (Optimization: In a real app, move these filters to the DB query)
        let scholarships = await Scholarship.find({});

        // Filters
        const { type, country, category, search, income_limit, state, minority, pwd, cgpa, percentage, year } = req.query;

        if (search) {
            const lowerSearch = search.toLowerCase();
            if (lowerSearch) {
                scholarships = scholarships.filter(s => s.name && s.name.toLowerCase().includes(lowerSearch));
            }
        }
        if (type) scholarships = scholarships.filter(s => s.type && s.type.toLowerCase() === type.toLowerCase());
        if (country) scholarships = scholarships.filter(s => s.country && s.country.toLowerCase() === country.toLowerCase());

        // Smart Matching Filters (for Profile)
        if (category) {
            scholarships = scholarships.filter(s =>
                (s.category && s.category.some(c => c.toLowerCase() === category.toLowerCase())) ||
                (s.category && s.category.includes('General'))
            );
        }
        if (state) {
            scholarships = scholarships.filter(s =>
                (JSON.stringify(s).toLowerCase().includes(state.toLowerCase())) ||
                s.country === 'India'
            );
        }
        if (income_limit) {
            const userIncome = parseInt(income_limit);
            scholarships = scholarships.filter(s =>
                s.income_limit === null || s.income_limit >= userIncome
            );
        }
        // New Advanced Filters
        if (minority === 'true') {
            scholarships = scholarships.filter(s => s.is_minority === true);
        }
        if (pwd === 'true') {
            scholarships = scholarships.filter(s => s.is_pwd === true);
        }
        if (percentage) {
            const p = parseFloat(percentage);
            scholarships = scholarships.filter(s => s.min_percentage <= p);
        }
        if (cgpa) {
            const c = parseFloat(cgpa);
            scholarships = scholarships.filter(s => s.min_cgpa <= c);
        }
        if (year) {
            scholarships = scholarships.filter(s =>
                s.year_of_study && s.year_of_study.some(y => y.toLowerCase() === year.toLowerCase())
            );
        }
        if (req.query.gender) {
            const g = req.query.gender.toLowerCase();
            scholarships = scholarships.filter(s =>
                (s.gender && s.gender.toLowerCase() === g) || (s.gender && s.gender.toLowerCase() === 'all')
            );
        }

        res.json(scholarships);
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server Error", error: e.message });
    }
});

app.get('/api/scholarships/:id', async (req, res) => {
    await connectDB();
    try {
        const item = await Scholarship.findOne({ id: parseInt(req.params.id) });
        if (item) res.json(item);
        else res.status(404).json({ message: "Not found" });
    } catch (e) { res.status(500).json({ message: "Server Error" }); }
});

// 2. EXAMS (Public Read)
app.get('/api/exams', async (req, res) => {
    await connectDB();
    try {
        const exams = await Exam.find({});
        res.json(exams);
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

app.get('/api/exams/:id', async (req, res) => {
    await connectDB();
    try {
        const item = await Exam.findOne({ id: parseInt(req.params.id) });
        if (item) res.json(item);
        else res.status(404).json({ message: "Not found" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

// 3. ADMIN OPERATIONS (Protected)

// Add Scholarship
app.post('/api/scholarships', checkAdmin, async (req, res) => {
    await connectDB();
    try {
        const newItem = req.body;
        if (!newItem.name) return res.status(400).json({ message: "Name required" });
        newItem.id = Date.now(); // Simple ID generation

        await Scholarship.create(newItem);
        res.json({ success: true, message: "Added successfully", id: newItem.id });
    } catch (e) { res.status(500).json({ message: "Server Error", error: e.message }); }
});

// Update Scholarship
app.put('/api/scholarships/:id', checkAdmin, async (req, res) => {
    await connectDB();
    try {
        const id = parseInt(req.params.id);
        const updated = await Scholarship.findOneAndUpdate({ id: id }, req.body, { new: true });

        if (!updated) return res.status(404).json({ message: "Not found" });
        res.json({ success: true, message: "Updated successfully" });
    } catch (e) { res.status(500).json({ message: "Server Error" }); }
});

// Delete Scholarship
app.delete('/api/scholarships/:id', checkAdmin, async (req, res) => {
    await connectDB();
    try {
        const id = parseInt(req.params.id);
        const deleted = await Scholarship.findOneAndDelete({ id: id });
        if (!deleted) return res.status(404).json({ message: "Not found" });

        res.json({ success: true, message: "Deleted successfully" });
    } catch (e) { res.status(500).json({ message: "Server Error" }); }
});

// Add Exam
app.post('/api/exams', checkAdmin, async (req, res) => {
    await connectDB();
    try {
        const newItem = req.body;
        newItem.id = Date.now();
        await Exam.create(newItem);
        res.json({ success: true, message: "Exam added" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

// Delete Exam
app.delete('/api/exams/:id', checkAdmin, async (req, res) => {
    await connectDB();
    try {
        const deleted = await Exam.findOneAndDelete({ id: parseInt(req.params.id) });
        if (!deleted) return res.status(404).json({ message: "Not found" });
        res.json({ success: true, message: "Exam deleted" });
    } catch (e) { res.status(500).json({ message: "Error" }); }
});

// 4. AUTH & PROFILE
app.post('/api/auth/signup', async (req, res) => {
    await connectDB();
    const { name, email, password } = req.body;
    try {
        const existing = await User.findOne({ email: email });
        if (existing) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            id: Date.now(),
            name,
            email,
            password: hashedPassword,
            profileCompleted: false,
            savedScholarships: []
        });

        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '7d' });

        res.json({ success: true, message: "Account created", token, user: { id: newUser.id, name, email, profileCompleted: false } });
    } catch (e) { res.status(500).json({ message: "Error creating user", error: e.message }); }
});

app.post('/api/auth/login', async (req, res) => {
    await connectDB();
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        // Fallback for plaintext passwords (if any exist from earlier mockup)
        const isPlaintextMatch = (password === user.password);

        if (isMatch || isPlaintextMatch) {
            // Generate token
            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
            res.json({
                success: true,
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    profileCompleted: user.profileCompleted || false
                }
            });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    } catch (e) { res.status(500).json({ message: "Error logging in", error: e.message }); }
});

// Update Profile
app.post('/api/user/profile', verifyToken, async (req, res) => {
    await connectDB();
    const { category, income, state, gender, minority, pwd, cgpa, year, degree, education_level, stream } = req.body;
    try {
        const user = await User.findById(req.userId);

        if (user) {
            user.category = category;
            user.income = income;
            user.state = state;
            user.gender = gender;
            user.is_minority = minority;
            user.is_pwd = pwd;
            user.cgpa = cgpa;
            user.year = year;
            user.degree = degree;
            user.education_level = education_level;
            user.stream = stream;
            user.profileCompleted = true;

            await user.save();
            res.json({ success: true, message: "Profile updated", user: user });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (e) { res.status(500).json({ message: "Error updating profile" }); }
});

// Get User Profile
app.get('/api/user/me', verifyToken, async (req, res) => {
    await connectDB();
    try {
        const user = await User.findById(req.userId);
        if (user) {
            const { password, ...safeUser } = user.toObject(); // .toObject() needed to spread mongo doc
            res.json({ success: true, user: safeUser });
        } else {
            res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (e) { res.status(500).json({ message: "Server Error" }); }
});

// Get Personalized Recommendations
app.get('/api/user/recommendations', verifyToken, async (req, res) => {
    await connectDB();
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        let scholarships = await Scholarship.find({});

        // Smart Matching Filters (for Profile)
        if (user.category) {
            scholarships = scholarships.filter(s =>
                (s.category && s.category.some(c => c.toLowerCase() === user.category.toLowerCase())) ||
                (s.category && s.category.includes('General'))
            );
        }
        if (user.state) {
            scholarships = scholarships.filter(s =>
                (JSON.stringify(s).toLowerCase().includes(user.state.toLowerCase())) ||
                s.country === 'India'
            );
        }
        if (user.income) {
            const userIncome = parseInt(user.income);
            if (!isNaN(userIncome)) {
                scholarships = scholarships.filter(s =>
                    s.income_limit === null || s.income_limit >= userIncome
                );
            }
        }
        if (user.is_minority) {
            scholarships = scholarships.filter(s => s.is_minority === true);
        }
        if (user.is_pwd) {
            scholarships = scholarships.filter(s => s.is_pwd === true);
        }
        if (user.education_level) {
            scholarships = scholarships.filter(s =>
                !s.education_level || s.education_level.length === 0 || s.education_level.some(e => e.toLowerCase() === user.education_level.toLowerCase())
            );
        }
        if (user.stream && user.stream !== 'All') {
            scholarships = scholarships.filter(s =>
                !s.stream || s.stream.toLowerCase() === 'all' || s.stream.toLowerCase() === user.stream.toLowerCase()
            );
        }

        res.json({ success: true, recommendations: scholarships });
    } catch (e) { res.status(500).json({ message: "Server Error", error: e.message }); }
});

// Save Scholarship
app.post('/api/user/save_scholarship', verifyToken, async (req, res) => {
    await connectDB();
    const { scholarshipId } = req.body;
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        if (!user.savedScholarships.includes(scholarshipId)) {
            user.savedScholarships.push(scholarshipId);
            await user.save();
        }
        res.json({ success: true, savedScholarships: user.savedScholarships });
    } catch (e) { res.status(500).json({ message: "Server Error" }); }
});

// Remove Saved Scholarship
app.post('/api/user/remove_scholarship', verifyToken, async (req, res) => {
    await connectDB();
    const { scholarshipId } = req.body;
    try {
        const user = await User.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.savedScholarships = user.savedScholarships.filter(id => id !== scholarshipId);
        await user.save();

        res.json({ success: true, savedScholarships: user.savedScholarships });
    } catch (e) { res.status(500).json({ message: "Server Error" }); }
});


// 5. NOTIFICATION
app.post('/api/notify', async (req, res) => {
    const { email, scholarshipName } = req.body;
    if (!transporter) return res.status(500).json({ message: "Email service not ready" });
    try {
        let info = await transporter.sendMail({
            from: '"ScholarEase Bot" <bot@scholarease.com>',
            to: email,
            subject: `Reminder: ${scholarshipName}`,
            text: `Apply for ${scholarshipName} soon!`,
            html: `<h3>Reminder</h3><p>Apply for <strong>${scholarshipName}</strong>.</p>`
        });
        res.json({ success: true, preview: nodemailer.getTestMessageUrl(info) });
    } catch (e) { res.status(500).json({ success: false }); }
});

// Module exports for Vercel
module.exports = app;

// Only listen if run directly (not if imported by Vercel)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`ScholarEase V4 (MongoDB) running on port ${port}`);
        console.log(`Admin Password: AmitYadav`);
    });
}


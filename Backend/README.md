# ScholarEase 🎓

**ScholarEase** is an intelligent, full-stack scholarship discovery platform designed to bridge the gap between students and financial aid opportunities. 

![Version](https://img.shields.io/badge/version-6.0-blue.svg) ![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Key Features

*   **Massive Database**: Search through 150+ scholarships and competitive exams (Tata, HDFC, Government Schemes).
*   **Smart Chatbot**: An integrated AI-logic bot that answers queries about deadlines and eligibility.
*   **Luxury UI/UX**: A premium 'Matte Black' design system with hardware-accelerated animations (3D Tilt, Scroll Reveal).
*   **Visual Dossiers**: Comprehensive detail pages with timeless visualizations and document checklists.
*   **Admin Portal**: Secure dashboard (`/admin.html`) for managing content dynamically.

## 🚀 Quick Start (Local)

1.  **Clone/Download** this repository.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Start the Server**:
    ```bash
    npm start
    ```
4.  **Open Browser**: Visit `http://localhost:3000`.

## 🛠️ Tech Stack

*   **Frontend**: HTML5, CSS3 (Variables, Grid), Vanilla JavaScript.
*   **Backend**: Node.js, Express.js.
*   **Data**: JSON-based mock database (persistence enabled).
*   **Tools**: Nodemailer (Email), AOS (Animations).

## 📂 Project Structure

```
ScholarEase/
├── public/           # Static Client Files
│   ├── css/          # Stylesheets (variables.css, style.css)
│   ├── js/           # Logic (main.js, list.js, detail.js, chatbot.js)
│   └── *.html        # Pages (index, list, detail, dashboard, admin)
├── data/             # Database Files
│   └── mockData.json # Scholarship Data
├── server.js         # Express Backend Logic
└── package.json      # Dependencies
```

## 🛡️ Admin Access
*   **URL**: `/admin.html`
*   **Default PIN**: `1234`

---
*Built with ❤️ for generic educational purposes.*

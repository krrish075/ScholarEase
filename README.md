# ScholarEase Project Setup Guide

Welcome to the ScholarEase project! This repository contains both the **Frontend** and **Backend** components of the scholarship discovery platform.

## Project Structure

```text
scratch/
├── Backend/   # Node.js + Express backend (REST API, MongoDB)
└── Frontend/  # Static Frontend presentation (HTML, CSS, JS)
```

**Note:** The `Backend` folder also contains a `public` directory which seems to be an integrated version of the frontend served by Express, while the `Frontend` folder contains a standalone version.

---

## 🚀 How to Run the Backend (API Server)

The backend handles the core logic, database connections, user authentication, and API endpoints.

### Prerequisites
1. **Node.js** v14 or higher installed on your machine.
2. A **MongoDB** connection string. (An `.env` file is already present with a `MONGODB_URI` for a remote cluster).

### Steps to Run
1. Open a terminal and navigate to the `Backend` directory:
   ```bash
   cd Backend
   ```
2. Install the necessary dependencies (Express, Mongoose, JWT, bcryptjs, etc.):
   ```bash
   npm install
   ```
3. Start the node server:
   ```bash
   node server.js
   # or
   npm run start
   ```
4. You should see a message in the terminal indicating that the server is running on port 3000 and connected to MongoDB:
   ```
   ScholarEase V4 (MongoDB) running on port 3000
   MongoDB Connected
   ```
5. The API is now available at `http://localhost:3000`. It also serves a version of the frontend over the static route (`/`).

### Important Notes for Backend:
- **Admin Access:** Some endpoints are protected by an admin check. The default admin credentials are user: `AmitYadav` and password: `7276@Amit`, sent via custom headers `x-admin-user` and `x-admin-password`.
- **Environment variables:** The `Backend/.env` file defines your database (`MONGODB_URI`). If the cluster fails or you want to use local MongoDB, update the `MONGODB_URI` accordingly.

---

## 🎨 How to Run the Frontend (Standalone Presentation)

The `Frontend` folder contains a purely client-side version of the web application. It operates without relying on the backend, using local mock data for demonstration.

### Steps to Run
1. Navigate to the `Frontend` folder.
2. Simply open `index.html` in any modern web browser.
   - You can normally double-click `index.html` to open it locally (`file:///...`).
   - For a better development experience and to avoid any CORS issues with local files, consider running it through a local HTTP server extension like the **Live Server** extension in VS Code.

### Features of the Standalone Demo
- Multi-Language Support (English, Hindi, Marathi) via a client-side translation dictionary.
- Parent Mode for high-contrast accessibility.
- Dashboard experience mocking the core functionalities of the complete app.

---

## The Integrated Experience
If you want to run the full stack where the frontend actually communicates with the database via the backend API:
1. Start the Backend server as described above (`npm start` inside `Backend`).
2. Visit `http://localhost:3000` in your web browser. This serves the files from `Backend/public`, connecting directly to your active Express endpoints.

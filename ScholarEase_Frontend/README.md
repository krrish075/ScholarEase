# ScholarEase - Frontend Presentation

This is a standalone version of the ScholarEase frontend, designed for presentation and review. It operates without a backend server, using mock data to demonstrate functionality.

## Features

### 1. 30% Project Readiness
This demo showcases the core "Dashboard" experience, which represents a significant portion of the user journey.

### 2. Multi-Language Support
We have implemented a client-side translation system. You can switch between languages using the dropdown in the header:
- **English** (Default)
- **Hindi** (हिंदी)
- **Marathi** (मराठी)

_Select a language to see the interface headings and text update instantly._

### 3. Parent Mode
To make the application accessible to parents who might not be tech-savvy, we added a **Parent Mode**.
- Click the **"Parent Mode"** button in the header.
- **Effect**: The interface switches to a high-contrast, larger-text "Light Mode" which is easier to read. The terminology is also simplified in a real scenario (demonstrated here by visual changes).

## How to Run
Simply open `index.html` in any modern web browser. No server installation is required.

## Structure
- `index.html`: The main dashboard structure.
- `css/style.css`: The styling (including the specific `.parent-mode` theme).
- `js/script.js`: Contains the mock data, translation dictionary, and logic.

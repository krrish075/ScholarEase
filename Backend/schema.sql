-- Database Schema for ScholarEase

CREATE DATABASE IF NOT EXISTS scholar_ease;
USE scholar_ease;

-- Table for Scholarships
CREATE TABLE IF NOT EXISTS scholarships (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('Government', 'Private', 'International') NOT NULL,
    category VARCHAR(255) NOT NULL COMMENT 'e.g., General, SC, ST, OBC, Minority',
    education_level VARCHAR(255) NOT NULL COMMENT 'e.g., School, Diploma, UG, PG',
    income_limit DECIMAL(10, 2),
    country VARCHAR(100) DEFAULT 'India',
    description TEXT,
    amount_details TEXT,
    application_start_date DATE,
    application_end_date DATE,
    official_link VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Scholarship Exams
CREATE TABLE IF NOT EXISTS scholarship_exams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    conducting_authority VARCHAR(255),
    exam_date DATE,
    syllabus_overview TEXT,
    registration_link VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for Required Documents (Many-to-Many relationship with Scholarships usually, but simplified here as JSON or text for prototype)
-- Using a separate table for cleaner structure if needed in future, but for now we follow requirements which imply simple storage.
-- We will store documents as a JSON string in the Benefits/Docs logic in the app, but if we strictly follow schema:

CREATE TABLE IF NOT EXISTS scholarship_documents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scholarship_id INT,
    document_name VARCHAR(255),
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS scholar_benefits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scholarship_id INT,
    benefit_description VARCHAR(255),
    FOREIGN KEY (scholarship_id) REFERENCES scholarships(id) ON DELETE CASCADE
);

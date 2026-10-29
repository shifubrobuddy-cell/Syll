-- =====================================================================
-- SCHOLARSHIP RECOMMENDATION SYSTEM
-- Database: scholarship_recommendation_db
-- Compatibility: MySQL 8.x / MariaDB (XAMPP Default)
-- Engine: InnoDB | Charset: utf8mb4 | Collation: utf8mb4_unicode_ci
-- =====================================================================

CREATE DATABASE IF NOT EXISTS `scholarship_recommendation_db` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `scholarship_recommendation_db`;

-- ---------------------------------------------------------------------
-- 1. Table: tbl_admin
-- ---------------------------------------------------------------------
DROP TABLE IF EXISTS `tbl_documents`;
DROP TABLE IF EXISTS `tbl_notification`;
DROP TABLE IF EXISTS `tbl_application`;
DROP TABLE IF EXISTS `tbl_scholarship`;
DROP TABLE IF EXISTS `tbl_student`;
DROP TABLE IF EXISTS `tbl_admin`;

CREATE TABLE `tbl_admin` (
    `admin_id` INT AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL UNIQUE,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Default Admin Account:
-- Username: admin
-- Password: AdminPassword@123 (hashed using password_hash PASSWORD_BCRYPT)
INSERT INTO `tbl_admin` (`admin_id`, `username`, `email`, `password`, `full_name`, `created_at`) 
VALUES (1, 'admin', 'admin@scholarship.org', '$2y$10$PjBwT41O1uOqfN4Yx33p4e7qZzN2F9vW/aMhJ7hY3H0K7XQ4lK6Uq', 'System Administrator', NOW());

-- ---------------------------------------------------------------------
-- 2. Table: tbl_student
-- ---------------------------------------------------------------------
CREATE TABLE `tbl_student` (
    `student_id` INT AUTO_INCREMENT PRIMARY KEY,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `dob` DATE NOT NULL,
    `gender` ENUM('Male', 'Female', 'Other') NOT NULL,
    `category` ENUM('General', 'OBC', 'SC', 'ST', 'EWS', 'Minority') NOT NULL,
    `annual_income` DECIMAL(12, 2) NOT NULL,
    `course` VARCHAR(100) NOT NULL,
    `marks_percentage` DECIMAL(5, 2) NOT NULL,
    `state` VARCHAR(80) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_student_category` (`category`),
    INDEX `idx_student_income` (`annual_income`),
    INDEX `idx_student_marks` (`marks_percentage`),
    INDEX `idx_student_course` (`course`),
    INDEX `idx_student_state` (`state`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sample Student Accounts (Passwords: Student@123):
-- Hash: $2y$10$w8T0O9xT1mI8m2aUvEaGeuJkG9bFwYwYnK0ZqfFp2HhYjL5oPq3Km
INSERT INTO `tbl_student` (`student_id`, `full_name`, `email`, `password`, `dob`, `gender`, `category`, `annual_income`, `course`, `marks_percentage`, `state`, `created_at`) VALUES
(1, 'Aarav Sharma', 'aarav.sharma@example.com', '$2y$10$w8T0O9xT1mI8m2aUvEaGeuJkG9bFwYwYnK0ZqfFp2HhYjL5oPq3Km', '2004-05-14', 'Male', 'OBC', 180000.00, 'BCA', 84.50, 'Maharashtra', NOW()),
(2, 'Priya Patel', 'priya.patel@example.com', '$2y$10$w8T0O9xT1mI8m2aUvEaGeuJkG9bFwYwYnK0ZqfFp2HhYjL5oPq3Km', '2003-11-20', 'Female', 'General', 450000.00, 'B.Tech Computer Science', 91.20, 'Gujarat', NOW()),
(3, 'Rohan Kamble', 'rohan.k@example.com', '$2y$10$w8T0O9xT1mI8m2aUvEaGeuJkG9bFwYwYnK0ZqfFp2HhYjL5oPq3Km', '2004-02-08', 'Male', 'SC', 120000.00, 'B.Sc Information Technology', 78.00, 'Maharashtra', NOW()),
(4, 'Ananya Sen', 'ananya.sen@example.com', '$2y$10$w8T0O9xT1mI8m2aUvEaGeuJkG9bFwYwYnK0ZqfFp2HhYjL5oPq3Km', '2005-08-19', 'Female', 'EWS', 150000.00, 'BCA', 88.00, 'West Bengal', NOW()),
(5, 'Mohammed Rizwan', 'm.rizwan@example.com', '$2y$10$w8T0O9xT1mI8m2aUvEaGeuJkG9bFwYwYnK0ZqfFp2HhYjL5oPq3Km', '2003-09-30', 'Male', 'Minority', 210000.00, 'B.Tech Electrical', 76.40, 'Karnataka', NOW());

-- ---------------------------------------------------------------------
-- 3. Table: tbl_scholarship
-- ---------------------------------------------------------------------
CREATE TABLE `tbl_scholarship` (
    `scholarship_id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL,
    `description` TEXT NOT NULL,
    `provider` VARCHAR(150) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `category_required` VARCHAR(100) DEFAULT 'ALL',
    `max_income` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `min_marks` DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    `eligible_course` VARCHAR(150) DEFAULT 'ALL',
    `state_applicable` VARCHAR(100) DEFAULT 'ALL',
    `gender_applicable` ENUM('ALL', 'Male', 'Female', 'Other') DEFAULT 'ALL',
    `last_date` DATE NOT NULL,
    `status` ENUM('Active', 'Inactive', 'Archived') DEFAULT 'Active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_scholarship_status` (`status`),
    INDEX `idx_scholarship_deadline` (`last_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tbl_scholarship` (`scholarship_id`, `title`, `description`, `provider`, `amount`, `category_required`, `max_income`, `min_marks`, `eligible_course`, `state_applicable`, `gender_applicable`, `last_date`, `status`) VALUES
(1, 'State Post-Matric Scholarship for Backward Classes', 'Financial assistance to deserving students belonging to Other Backward Classes (OBC) pursuing undergraduate technical and non-technical programs in accredited institutions.', 'Department of Social Justice, Govt. of Maharashtra', 50000.00, 'OBC', 250000.00, 70.00, 'BCA,B.Sc Information Technology,B.Tech Computer Science', 'Maharashtra', 'ALL', '2026-12-31', 'Active'),

(2, 'Dr. B.R. Ambedkar National Merit Fellowship', 'Special state scholarship dedicated to supporting meritorious SC/ST undergraduate students with comprehensive tuition waivers and annual academic stipends.', 'Ministry of Social Justice & Empowerment', 75000.00, 'SC,ST', 300000.00, 65.00, 'ALL', 'ALL', 'ALL', '2026-11-30', 'Active'),

(3, 'Pragati National Tech Scholarship for Women', 'Empowering female undergraduates enrolled in technical engineering and computing disciplines to foster higher gender representation in science and technology.', 'All India Council for Technical Education (AICTE)', 60000.00, 'ALL', 800000.00, 75.00, 'BCA,B.Tech Computer Science,B.Tech Electrical', 'ALL', 'Female', '2026-10-15', 'Active'),

(4, 'Merit-Cum-Means National Scholarship Scheme', 'Financial grant targeting economically weaker general and minority category candidates demonstrating sustained academic excellence.', 'Ministry of Minority Affairs & Higher Education', 40000.00, 'Minority,EWS,General', 250000.00, 75.00, 'ALL', 'ALL', 'ALL', '2026-12-15', 'Active'),

(5, 'Apex IT Excellence & Coding Innovators Grant', 'Corporate social responsibility initiative awarding high-performing computer science and application students striving in software engineering and algorithms.', 'Apex Tech Foundation Trust', 85000.00, 'ALL', 500000.00, 80.00, 'BCA,B.Tech Computer Science,B.Sc Information Technology', 'ALL', 'ALL', '2026-09-30', 'Active'),

(6, 'Maharashtra EBC Higher Education Tuition Waiver', 'Tuition reimbursement initiative for students from Economically Backward Classes enrolled in professional undergraduate courses.', 'Higher & Technical Education Dept., Maharashtra', 35000.00, 'EWS,General,OBC', 250000.00, 60.00, 'BCA,B.Tech Computer Science,B.Tech Electrical', 'Maharashtra', 'ALL', '2026-11-15', 'Active'),

(7, 'National Talent Search Higher Education Fellowship', 'Prestigious all-India scholarship recognizing students with top 5% academic performance throughout secondary and tertiary schooling.', 'National Talent Research Council', 100000.00, 'ALL', 0.00, 88.00, 'ALL', 'ALL', 'ALL', '2026-10-31', 'Active'),

(8, 'Karnataka State Domicile Science & Tech Fellowship', 'State-level endowment grant for students domiciled in Karnataka admitted to engineering and applied computing programs.', 'Karnataka Higher Education Board', 45000.00, 'ALL', 350000.00, 70.00, 'B.Tech Computer Science,B.Tech Electrical,BCA', 'Karnataka', 'ALL', '2026-12-20', 'Active');

-- ---------------------------------------------------------------------
-- 4. Table: tbl_application
-- ---------------------------------------------------------------------
CREATE TABLE `tbl_application` (
    `application_id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `scholarship_id` INT NOT NULL,
    `applied_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `status` ENUM('Applied', 'Under Review', 'Approved', 'Rejected') DEFAULT 'Applied',
    `remarks` TEXT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY `unique_student_scholarship` (`student_id`, `scholarship_id`),
    CONSTRAINT `fk_app_student` FOREIGN KEY (`student_id`) REFERENCES `tbl_student` (`student_id`) ON DELETE CASCADE,
    CONSTRAINT `fk_app_scholarship` FOREIGN KEY (`scholarship_id`) REFERENCES `tbl_scholarship` (`scholarship_id`) ON DELETE RESTRICT,
    INDEX `idx_app_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tbl_application` (`application_id`, `student_id`, `scholarship_id`, `applied_date`, `status`, `remarks`) VALUES
(1, 1, 1, '2026-08-01 10:15:00', 'Approved', 'All caste and income certificates thoroughly validated. Academic criteria met with distinction.'),
(2, 1, 5, '2026-08-05 14:22:00', 'Under Review', 'Dossier assigned to technical review board for coding credentials verification.'),
(3, 2, 3, '2026-08-02 09:30:00', 'Approved', 'Merit verified (91.2%). Enrolled in B.Tech Computer Science.'),
(4, 3, 2, '2026-08-03 11:45:00', 'Under Review', 'Income and category documents undergoing tahsildar database cross-check.'),
(5, 4, 6, '2026-08-04 16:10:00', 'Applied', NULL),
(6, 5, 4, '2026-08-06 13:05:00', 'Applied', NULL);

-- ---------------------------------------------------------------------
-- 5. Table: tbl_documents
-- ---------------------------------------------------------------------
CREATE TABLE `tbl_documents` (
    `document_id` INT AUTO_INCREMENT PRIMARY KEY,
    `application_id` INT NOT NULL,
    `document_type` ENUM('Marksheet', 'Income Certificate', 'ID Proof', 'Caste Certificate', 'Other') NOT NULL,
    `original_filename` VARCHAR(255) NOT NULL,
    `stored_filename` VARCHAR(255) NOT NULL,
    `file_path` VARCHAR(255) NOT NULL,
    `file_size_kb` INT NOT NULL,
    `mime_type` VARCHAR(100) NOT NULL,
    `uploaded_on` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_doc_application` FOREIGN KEY (`application_id`) REFERENCES `tbl_application` (`application_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tbl_documents` (`document_id`, `application_id`, `document_type`, `original_filename`, `stored_filename`, `file_path`, `file_size_kb`, `mime_type`, `uploaded_on`) VALUES
(1, 1, 'Marksheet', 'aarav_hsc_marksheet.pdf', 'DOC_APP1_MARKSHEET_8f9a2.pdf', 'uploads/documents/DOC_APP1_MARKSHEET_8f9a2.pdf', 340, 'application/pdf', '2026-08-01 10:16:00'),
(2, 1, 'Income Certificate', 'income_cert_2026.pdf', 'DOC_APP1_INCOME_b3e12.pdf', 'uploads/documents/DOC_APP1_INCOME_b3e12.pdf', 280, 'application/pdf', '2026-08-01 10:16:30'),
(3, 1, 'ID Proof', 'aadhaar_card_scan.pdf', 'DOC_APP1_ID_1a4c9.pdf', 'uploads/documents/DOC_APP1_ID_1a4c9.pdf', 195, 'application/pdf', '2026-08-01 10:17:00'),
(4, 2, 'Marksheet', 'sem_transcript.pdf', 'DOC_APP2_MARKSHEET_7c2b1.pdf', 'uploads/documents/DOC_APP2_MARKSHEET_7c2b1.pdf', 410, 'application/pdf', '2026-08-05 14:23:00'),
(5, 3, 'Marksheet', 'priya_btech_transcript.pdf', 'DOC_APP3_MARKSHEET_9e4a3.pdf', 'uploads/documents/DOC_APP3_MARKSHEET_9e4a3.pdf', 520, 'application/pdf', '2026-08-02 09:31:00');

-- ---------------------------------------------------------------------
-- 6. Table: tbl_notification
-- ---------------------------------------------------------------------
CREATE TABLE `tbl_notification` (
    `notification_id` INT AUTO_INCREMENT PRIMARY KEY,
    `student_id` INT NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `type` ENUM('Recommendation', 'Application Update', 'Deadline Alert', 'System') DEFAULT 'System',
    `is_read` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_notif_student` FOREIGN KEY (`student_id`) REFERENCES `tbl_student` (`student_id`) ON DELETE CASCADE,
    INDEX `idx_notif_student_read` (`student_id`, `is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `tbl_notification` (`notification_id`, `student_id`, `title`, `message`, `type`, `is_read`, `created_at`) VALUES
(1, 1, 'Application Approved!', 'Congratulations! Your application for State Post-Matric Scholarship for Backward Classes has been approved by the department.', 'Application Update', 0, '2026-08-07 11:20:00'),
(2, 1, 'Application Under Review', 'Your application for Apex IT Excellence & Coding Innovators Grant is now under formal verification.', 'Application Update', 1, '2026-08-05 15:00:00'),
(3, 1, 'New Recommendation Matched', 'A new scholarship matching your BCA course and Maharashtra domicile is available: Apex IT Excellence Grant.', 'Recommendation', 1, '2026-08-01 09:00:00'),
(4, 2, 'Application Approved!', 'Your submission for Pragati National Tech Scholarship for Women was verified and approved.', 'Application Update', 0, '2026-08-04 14:10:00'),
(5, 3, 'Application Under Review', 'Your application for Dr. B.R. Ambedkar National Merit Fellowship is currently in review.', 'Application Update', 0, '2026-08-03 12:00:00');

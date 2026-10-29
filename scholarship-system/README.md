# Scholarship Recommendation System

> **A Rule-Based Academic & Financial Opportunity Discovery Platform**  
> Built strictly with **HTML5, CSS3, Vanilla JavaScript, PHP 8.x, and MySQL 8.x (Apache / XAMPP)**.  
> *Zero external frontend frameworks, zero CSS libraries, zero client-side charting libraries.*

---

## 1. System Architecture & Technology Stack

| Layer | Technology | Specifications |
| :--- | :--- | :--- |
| **Frontend Presentation** | Native HTML5 + CSS3 + Vanilla JavaScript | Custom design system with Deep Navy (`#18263D`), Indigo (`#344B78`), Champagne Gold (`#D6B36A`), and Warm Ivory (`#F7F5F0`). Pure SVG mathematical charts. |
| **Backend Application Tier** | PHP 8.x (Native OOP & Procedural) | PDO Prepared Statements, Session RBAC, CSRF token validation, MIME file verification. |
| **Data Storage Tier** | MySQL 8.x / MariaDB | Relational database (`scholarship_recommendation_db`) with InnoDB tables, foreign keys, and indexes. |
| **Web Server Environment** | Apache (XAMPP Suite) | Rooted at `http://localhost/scholarship-system/` |

---

## 2. Rule-Based Recommendation Algorithm

The platform uses a **deterministic 5-criteria multi-parameter scoring engine** (Max Score: 100%):

$$\text{Match Score} = W_{\text{cat}} + W_{\text{inc}} + W_{\text{mrk}} + W_{\text{crs}} + W_{\text{st}}$$

### Evaluation Criteria Breakdown:
1. **Social Category Match ($W_{\text{cat}} = 20\text{ pts}$):** Criteria is `ALL` or student category is in the allowed whitelist.
2. **Income Ceiling ($W_{\text{inc}} = 20\text{ pts}$):** `max_income` is 0 (open) or $\text{student\_income} \le \text{max\_income}$.
3. **Academic Merit Cutoff ($W_{\text{mrk}} = 20\text{ pts}$):** $\text{student\_marks} \ge \text{min\_marks}$ ($20\text{ pts}$) or within 5% ($10\text{ pts}$).
4. **Enrolled Course Stream ($W_{\text{crs}} = 20\text{ pts}$):** Criteria is `ALL` or matches course name.
5. **State Domicile ($W_{\text{st}} = 20\text{ pts}$):** Criteria is `ALL` or matches student state domicile.

---

## 3. XAMPP Installation & Deployment Guide

### Step 1: Clone or Copy Project Files
Place the entire `scholarship-system` directory inside your XAMPP `htdocs` folder:
```
C:\xampp\htdocs\scholarship-system\
```

### Step 2: Start Apache and MySQL
1. Launch the **XAMPP Control Panel**.
2. Click **Start** for **Apache** and **MySQL**.

### Step 3: Import the MySQL Database
1. Open your browser and navigate to `http://localhost/phpmyadmin/`.
2. Click **New** on the left navigation and create a database named:
   ```
   scholarship_recommendation_db
   ```
3. Click on the newly created database, open the **Import** tab.
4. Choose the file: `database/scholarship_recommendation_db.sql` and click **Import**.

### Step 4: Verify Database Connection
Open `config/database.php` and confirm the default credentials:
```php
$host = '127.0.0.1';
$db_name = 'scholarship_recommendation_db';
$username = 'root';
$password = '';
```

### Step 5: Launch Application
Open your browser and visit:
```
http://localhost/scholarship-system/
```

---

## 4. Test Credentials for Academic Viva

### 👨‍🎓 Student Account
* **Email:** `aarav.sharma@example.com`
* **Password:** `Student@123`
* **Profile:** BCA student, OBC Category, 84.50% Marks, ₹1,80,000 Income, Maharashtra Domicile.

### 🛡️ Administrator Account
* **Username:** `admin` (or `admin@scholarship.org`)
* **Password:** `AdminPassword@123`

---

## 5. Academic Viva Voce Defense Guide

### Q1: Why is this system rule-based instead of using Machine Learning?
> **Answer:** Scholarship eligibility is governed by strict, legally binding institutional criteria (statutory income cutoffs, caste categories, academic pass marks). A rule-based engine offers **100% deterministic accuracy and total transparency**, allowing applicants and auditors to inspect the exact mathematical reason why an applicant qualified or was disqualified.

### Q2: How is SQL Injection prevented?
> **Answer:** Every database operation uses **PDO with prepared statements and parameter binding (`?` placeholders)**. Direct string concatenation in queries is strictly avoided, and `PDO::ATTR_EMULATE_PREPARES` is set to `false`.

### Q3: How are file uploads secured?
> **Answer:** Document uploads undergo **4-layer server-side validation**:
> 1. Real MIME type detection using PHP `finfo_file` (not trusting client headers).
> 2. File extension whitelist enforcement (`pdf`, `jpg`, `png`).
> 3. File size restriction (5MB cap).
> 4. Filename randomization (`DOC_APP1_MARKSHEET_8f9a2.pdf`) stored outside public web executable directories.

### Q4: How is CSRF (Cross-Site Request Forgery) mitigated?
> **Answer:** Every state-modifying POST form includes a cryptographically secure random token generated via `bin2hex(random_bytes(32))` stored in `$_SESSION['csrf_token']` and validated using `hash_equals()`.

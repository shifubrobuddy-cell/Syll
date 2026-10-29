<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Student Registration Module
 * File: register.php
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';

if (isStudentLoggedIn()) {
    header("Location: student/dashboard.php");
    exit;
}

$pageTitle = "Student Registration";
$baseUrl = "";
$errorMsg = "";
$formData = [
    'full_name'        => '',
    'email'            => '',
    'dob'              => '',
    'gender'           => 'Male',
    'category'         => 'General',
    'annual_income'    => '',
    'course'           => 'BCA',
    'marks_percentage' => '',
    'state'            => 'Maharashtra'
];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!verifyCSRFToken($csrfToken)) {
        $errorMsg = "Security token mismatch. Please submit again.";
    } else {
        $fullName = trim($_POST['full_name'] ?? '');
        $email = trim($_POST['email'] ?? '');
        $password = $_POST['password'] ?? '';
        $confirmPassword = $_POST['confirm_password'] ?? '';
        $dob = $_POST['dob'] ?? '';
        $gender = $_POST['gender'] ?? 'Male';
        $category = $_POST['category'] ?? 'General';
        $annualIncome = (float)($_POST['annual_income'] ?? 0);
        $course = trim($_POST['course'] ?? '');
        $marks = (float)($_POST['marks_percentage'] ?? 0);
        $state = trim($_POST['state'] ?? '');

        // Preserve form data on error
        $formData = [
            'full_name'        => $fullName,
            'email'            => $email,
            'dob'              => $dob,
            'gender'           => $gender,
            'category'         => $category,
            'annual_income'    => $annualIncome,
            'course'           => $course,
            'marks_percentage' => $marks,
            'state'            => $state
        ];

        // Validation
        if (empty($fullName) || empty($email) || empty($password) || empty($dob) || empty($course) || empty($state)) {
            $errorMsg = "Please fill in all mandatory fields marked with an asterisk (*).";
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errorMsg = "Please provide a valid email address.";
        } elseif (strlen($password) < 8) {
            $errorMsg = "Password must be at least 8 characters in length.";
        } elseif ($password !== $confirmPassword) {
            $errorMsg = "Password confirmation does not match.";
        } elseif ($marks < 0 || $marks > 100) {
            $errorMsg = "Academic marks percentage must be between 0.00% and 100.00%.";
        } elseif ($annualIncome < 0) {
            $errorMsg = "Annual family income cannot be negative.";
        } else {
            try {
                $db = getDB();

                // Check duplicate email
                $chk = $db->prepare("SELECT student_id FROM tbl_student WHERE email = ?");
                $chk->execute([$email]);
                if ($chk->fetch()) {
                    $errorMsg = "An account with this email address already exists. Please log in.";
                } else {
                    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
                    $ins = $db->prepare("
                        INSERT INTO tbl_student 
                        (full_name, email, password, dob, gender, category, annual_income, course, marks_percentage, state, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                    ");
                    $ins->execute([
                        $fullName,
                        $email,
                        $hashedPassword,
                        $dob,
                        $gender,
                        $category,
                        $annualIncome,
                        $course,
                        $marks,
                        $state
                    ]);

                    $newStudentId = (int)$db->lastInsertId();

                    // Create Welcome Notification
                    createNotification(
                        $db,
                        $newStudentId,
                        "Welcome to Scholarship Recommendation System",
                        "Your student profile has been registered. Explore your personalized scholarship recommendations on your dashboard!",
                        "System"
                    );

                    // Automatic login after registration
                    $_SESSION['user_type'] = 'student';
                    $_SESSION['student_id'] = $newStudentId;
                    $_SESSION['student_name'] = $fullName;
                    $_SESSION['student_email'] = $email;
                    $_SESSION['flash_success'] = "Account successfully registered! Welcome to your dashboard.";

                    header("Location: student/dashboard.php");
                    exit;
                }
            } catch (Exception $e) {
                $errorMsg = "Database registration failed. Please verify input parameters.";
            }
        }
    }
}

$csrf = generateCSRFToken();
include __DIR__ . '/includes/header.php';
?>

<main class="main-content">
    <div class="container container-narrow">
        <div class="card" style="padding: 2.5rem;">
            <div class="text-center mb-4">
                <h2 style="margin-bottom: 0.25rem;">Create Student Profile</h2>
                <p>Register to calculate rule-based eligibility and unlock funding grants</p>
            </div>

            <?php if (!empty($errorMsg)): ?>
                <div class="alert alert-danger"><?= sanitize($errorMsg) ?></div>
            <?php endif; ?>

            <form action="register.php" method="POST" id="studentRegisterForm">
                <input type="hidden" name="csrf_token" value="<?= $csrf ?>">

                <h5 style="color: var(--secondary); margin-bottom: 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem;">
                    1. Account Credentials & Personal Info
                </h5>

                <div class="grid grid-2">
                    <div class="form-group">
                        <label for="full_name" class="form-label">Full Name <span class="required">*</span></label>
                        <input type="text" id="full_name" name="full_name" class="form-control" value="<?= sanitize($formData['full_name']) ?>" placeholder="e.g. Aarav Sharma" required>
                    </div>

                    <div class="form-group">
                        <label for="email" class="form-label">Email Address <span class="required">*</span></label>
                        <input type="email" id="email" name="email" class="form-control" value="<?= sanitize($formData['email']) ?>" placeholder="e.g. aarav@example.com" required>
                    </div>
                </div>

                <div class="grid grid-2">
                    <div class="form-group">
                        <label for="password" class="form-label">Password (Min 8 chars) <span class="required">*</span></label>
                        <div style="position: relative;">
                            <input type="password" id="password" name="password" class="form-control" placeholder="••••••••" required>
                            <button type="button" class="password-toggle-btn btn btn-secondary btn-sm" data-target="password" style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); padding: 0.3rem 0.6rem; font-size: 0.75rem;">Show</button>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="confirm_password" class="form-label">Confirm Password <span class="required">*</span></label>
                        <input type="password" id="confirm_password" name="confirm_password" class="form-control" placeholder="••••••••" required>
                    </div>
                </div>

                <div class="grid grid-2">
                    <div class="form-group">
                        <label for="dob" class="form-label">Date of Birth <span class="required">*</span></label>
                        <input type="date" id="dob" name="dob" class="form-control" value="<?= sanitize($formData['dob']) ?>" required>
                    </div>

                    <div class="form-group">
                        <label for="gender" class="form-label">Gender <span class="required">*</span></label>
                        <select id="gender" name="gender" class="form-select" required>
                            <option value="Male" <?= $formData['gender'] === 'Male' ? 'selected' : '' ?>>Male</option>
                            <option value="Female" <?= $formData['gender'] === 'Female' ? 'selected' : '' ?>>Female</option>
                            <option value="Other" <?= $formData['gender'] === 'Other' ? 'selected' : '' ?>>Other</option>
                        </select>
                    </div>
                </div>

                <h5 style="color: var(--secondary); margin: 1.5rem 0 1rem; border-bottom: 1px solid var(--border-light); padding-bottom: 0.5rem;">
                    2. Eligibility & Academic Parameters (Used by Recommendation Engine)
                </h5>

                <div class="grid grid-2">
                    <div class="form-group">
                        <label for="category" class="form-label">Social Category <span class="required">*</span></label>
                        <select id="category" name="category" class="form-select" required>
                            <option value="General" <?= $formData['category'] === 'General' ? 'selected' : '' ?>>General</option>
                            <option value="OBC" <?= $formData['category'] === 'OBC' ? 'selected' : '' ?>>OBC (Other Backward Class)</option>
                            <option value="SC" <?= $formData['category'] === 'SC' ? 'selected' : '' ?>>SC (Scheduled Caste)</option>
                            <option value="ST" <?= $formData['category'] === 'ST' ? 'selected' : '' ?>>ST (Scheduled Tribe)</option>
                            <option value="EWS" <?= $formData['category'] === 'EWS' ? 'selected' : '' ?>>EWS (Economically Weaker Section)</option>
                            <option value="Minority" <?= $formData['category'] === 'Minority' ? 'selected' : '' ?>>Minority</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="annual_income" class="form-label">Annual Family Income (₹) <span class="required">*</span></label>
                        <input type="number" id="annual_income" name="annual_income" class="form-control" value="<?= sanitize($formData['annual_income']) ?>" placeholder="e.g. 180000" min="0" step="1000" required>
                    </div>
                </div>

                <div class="grid grid-3">
                    <div class="form-group">
                        <label for="course" class="form-label">Enrolled Course <span class="required">*</span></label>
                        <select id="course" name="course" class="form-select" required>
                            <option value="BCA" <?= $formData['course'] === 'BCA' ? 'selected' : '' ?>>BCA</option>
                            <option value="B.Tech Computer Science" <?= $formData['course'] === 'B.Tech Computer Science' ? 'selected' : '' ?>>B.Tech Computer Science</option>
                            <option value="B.Sc Information Technology" <?= $formData['course'] === 'B.Sc Information Technology' ? 'selected' : '' ?>>B.Sc IT</option>
                            <option value="B.Tech Electrical" <?= $formData['course'] === 'B.Tech Electrical' ? 'selected' : '' ?>>B.Tech Electrical</option>
                            <option value="B.Com" <?= $formData['course'] === 'B.Com' ? 'selected' : '' ?>>B.Com</option>
                            <option value="BBA" <?= $formData['course'] === 'BBA' ? 'selected' : '' ?>>BBA</option>
                            <option value="MCA" <?= $formData['course'] === 'MCA' ? 'selected' : '' ?>>MCA</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="marks_percentage" class="form-label">Marks Percentage (%) <span class="required">*</span></label>
                        <input type="number" id="marks_percentage" name="marks_percentage" class="form-control" value="<?= sanitize($formData['marks_percentage']) ?>" placeholder="e.g. 84.50" min="0" max="100" step="0.01" required>
                    </div>

                    <div class="form-group">
                        <label for="state" class="form-label">State Domicile <span class="required">*</span></label>
                        <select id="state" name="state" class="form-select" required>
                            <option value="Maharashtra" <?= $formData['state'] === 'Maharashtra' ? 'selected' : '' ?>>Maharashtra</option>
                            <option value="Gujarat" <?= $formData['state'] === 'Gujarat' ? 'selected' : '' ?>>Gujarat</option>
                            <option value="Karnataka" <?= $formData['state'] === 'Karnataka' ? 'selected' : '' ?>>Karnataka</option>
                            <option value="West Bengal" <?= $formData['state'] === 'West Bengal' ? 'selected' : '' ?>>West Bengal</option>
                            <option value="Tamil Nadu" <?= $formData['state'] === 'Tamil Nadu' ? 'selected' : '' ?>>Tamil Nadu</option>
                            <option value="Delhi" <?= $formData['state'] === 'Delhi' ? 'selected' : '' ?>>Delhi</option>
                            <option value="Uttar Pradesh" <?= $formData['state'] === 'Uttar Pradesh' ? 'selected' : '' ?>>Uttar Pradesh</option>
                        </select>
                    </div>
                </div>

                <div class="mt-4">
                    <button type="submit" class="btn btn-primary btn-block btn-lg">
                        Complete Registration & Calculate Recommendations
                    </button>
                </div>
            </form>

            <div class="text-center text-sm mt-3">
                Already registered? <a href="login.php" style="font-weight: 600; color: var(--primary);">Sign in here</a>
            </div>
        </div>
    </div>
</main>

<?php include __DIR__ . '/includes/footer.php'; ?>

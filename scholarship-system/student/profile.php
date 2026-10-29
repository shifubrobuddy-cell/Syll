<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Student Profile & Eligibility Parameter Manager
 * File: student/profile.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

requireStudentAuth();

$pageTitle = "My Student Profile";
$baseUrl = "../";

$db = getDB();
$student = getLoggedInStudent($db);

$successMsg = "";
$errorMsg = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!verifyCSRFToken($csrfToken)) {
        $errorMsg = "Security validation failed. Please refresh.";
    } else {
        $fullName = trim($_POST['full_name'] ?? '');
        $dob = $_POST['dob'] ?? '';
        $gender = $_POST['gender'] ?? 'Male';
        $category = $_POST['category'] ?? 'General';
        $annualIncome = (float)($_POST['annual_income'] ?? 0);
        $course = trim($_POST['course'] ?? '');
        $marks = (float)($_POST['marks_percentage'] ?? 0);
        $state = trim($_POST['state'] ?? '');

        if (empty($fullName) || empty($dob) || empty($course) || empty($state)) {
            $errorMsg = "Please fill in all mandatory fields.";
        } elseif ($marks < 0 || $marks > 100) {
            $errorMsg = "Marks must be between 0% and 100%.";
        } elseif ($annualIncome < 0) {
            $errorMsg = "Income cannot be negative.";
        } else {
            try {
                $upd = $db->prepare("
                    UPDATE tbl_student 
                    SET full_name = ?, dob = ?, gender = ?, category = ?, annual_income = ?, course = ?, marks_percentage = ?, state = ?
                    WHERE student_id = ?
                ");
                $upd->execute([$fullName, $dob, $gender, $category, $annualIncome, $course, $marks, $state, $student['student_id']]);

                $_SESSION['student_name'] = $fullName;
                $student = getLoggedInStudent($db); // Refresh
                $successMsg = "Profile updated successfully! Recommendation engine calculations refreshed.";
            } catch (Exception $e) {
                $errorMsg = "Database update error: " . $e->getMessage();
            }
        }
    }
}

$csrf = generateCSRFToken();
include __DIR__ . '/../includes/header.php';
?>

<main class="main-content">
    <div class="container container-narrow">
        <div class="card" style="padding: 2.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border-light);">
                <div>
                    <h2 style="font-size: 1.75rem; margin-bottom: 0.25rem;">Academic & Financial Profile</h2>
                    <p class="text-sm">These parameters are directly fed into the Rule-Based Recommendation Engine</p>
                </div>
                <a href="dashboard.php" class="btn btn-secondary btn-sm">← Back to Dashboard</a>
            </div>

            <?php if (!empty($successMsg)): ?>
                <div class="alert alert-success"><?= sanitize($successMsg) ?></div>
            <?php endif; ?>

            <?php if (!empty($errorMsg)): ?>
                <div class="alert alert-danger"><?= sanitize($errorMsg) ?></div>
            <?php endif; ?>

            <form action="profile.php" method="POST">
                <input type="hidden" name="csrf_token" value="<?= $csrf ?>">

                <h5 style="color: var(--secondary); margin-bottom: 1rem;">1. Personal Identity</h5>
                <div class="grid grid-2">
                    <div class="form-group">
                        <label for="full_name" class="form-label">Full Name <span class="required">*</span></label>
                        <input type="text" id="full_name" name="full_name" class="form-control" value="<?= sanitize($student['full_name']) ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="email" class="form-label">Registered Email</label>
                        <input type="email" id="email" class="form-control" value="<?= sanitize($student['email']) ?>" disabled>
                        <div class="input-help">Email cannot be modified directly</div>
                    </div>
                </div>

                <div class="grid grid-2">
                    <div class="form-group">
                        <label for="dob" class="form-label">Date of Birth <span class="required">*</span></label>
                        <input type="date" id="dob" name="dob" class="form-control" value="<?= sanitize($student['dob']) ?>" required>
                    </div>
                    <div class="form-group">
                        <label for="gender" class="form-label">Gender <span class="required">*</span></label>
                        <select id="gender" name="gender" class="form-select" required>
                            <option value="Male" <?= $student['gender'] === 'Male' ? 'selected' : '' ?>>Male</option>
                            <option value="Female" <?= $student['gender'] === 'Female' ? 'selected' : '' ?>>Female</option>
                            <option value="Other" <?= $student['gender'] === 'Other' ? 'selected' : '' ?>>Other</option>
                        </select>
                    </div>
                </div>

                <h5 style="color: var(--secondary); margin: 1.5rem 0 1rem; border-top: 1px solid var(--border-light); padding-top: 1rem;">
                    2. Recommendation Criteria Fields
                </h5>

                <div class="grid grid-2">
                    <div class="form-group">
                        <label for="category" class="form-label">Social Category <span class="required">*</span></label>
                        <select id="category" name="category" class="form-select" required>
                            <option value="General" <?= $student['category'] === 'General' ? 'selected' : '' ?>>General</option>
                            <option value="OBC" <?= $student['category'] === 'OBC' ? 'selected' : '' ?>>OBC (Other Backward Class)</option>
                            <option value="SC" <?= $student['category'] === 'SC' ? 'selected' : '' ?>>SC (Scheduled Caste)</option>
                            <option value="ST" <?= $student['category'] === 'ST' ? 'selected' : '' ?>>ST (Scheduled Tribe)</option>
                            <option value="EWS" <?= $student['category'] === 'EWS' ? 'selected' : '' ?>>EWS (Economically Weaker Section)</option>
                            <option value="Minority" <?= $student['category'] === 'Minority' ? 'selected' : '' ?>>Minority</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="annual_income" class="form-label">Annual Family Income (₹) <span class="required">*</span></label>
                        <input type="number" id="annual_income" name="annual_income" class="form-control" value="<?= (int)$student['annual_income'] ?>" min="0" step="1000" required>
                    </div>
                </div>

                <div class="grid grid-3">
                    <div class="form-group">
                        <label for="course" class="form-label">Enrolled Course <span class="required">*</span></label>
                        <select id="course" name="course" class="form-select" required>
                            <option value="BCA" <?= $student['course'] === 'BCA' ? 'selected' : '' ?>>BCA</option>
                            <option value="B.Tech Computer Science" <?= $student['course'] === 'B.Tech Computer Science' ? 'selected' : '' ?>>B.Tech Computer Science</option>
                            <option value="B.Sc Information Technology" <?= $student['course'] === 'B.Sc Information Technology' ? 'selected' : '' ?>>B.Sc IT</option>
                            <option value="B.Tech Electrical" <?= $student['course'] === 'B.Tech Electrical' ? 'selected' : '' ?>>B.Tech Electrical</option>
                            <option value="B.Com" <?= $student['course'] === 'B.Com' ? 'selected' : '' ?>>B.Com</option>
                            <option value="BBA" <?= $student['course'] === 'BBA' ? 'selected' : '' ?>>BBA</option>
                            <option value="MCA" <?= $student['course'] === 'MCA' ? 'selected' : '' ?>>MCA</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="marks_percentage" class="form-label">Marks Percentage (%) <span class="required">*</span></label>
                        <input type="number" id="marks_percentage" name="marks_percentage" class="form-control" value="<?= $student['marks_percentage'] ?>" min="0" max="100" step="0.01" required>
                    </div>

                    <div class="form-group">
                        <label for="state" class="form-label">State Domicile <span class="required">*</span></label>
                        <select id="state" name="state" class="form-select" required>
                            <option value="Maharashtra" <?= $student['state'] === 'Maharashtra' ? 'selected' : '' ?>>Maharashtra</option>
                            <option value="Gujarat" <?= $student['state'] === 'Gujarat' ? 'selected' : '' ?>>Gujarat</option>
                            <option value="Karnataka" <?= $student['state'] === 'Karnataka' ? 'selected' : '' ?>>Karnataka</option>
                            <option value="West Bengal" <?= $student['state'] === 'West Bengal' ? 'selected' : '' ?>>West Bengal</option>
                            <option value="Tamil Nadu" <?= $student['state'] === 'Tamil Nadu' ? 'selected' : '' ?>>Tamil Nadu</option>
                            <option value="Delhi" <?= $student['state'] === 'Delhi' ? 'selected' : '' ?>>Delhi</option>
                            <option value="Uttar Pradesh" <?= $student['state'] === 'Uttar Pradesh' ? 'selected' : '' ?>>Uttar Pradesh</option>
                        </select>
                    </div>
                </div>

                <div class="mt-4" style="display: flex; gap: 1rem;">
                    <button type="submit" class="btn btn-primary btn-lg" style="flex: 1;">Save Changes & Recompute Recommendations</button>
                    <a href="recommendations.php" class="btn btn-accent btn-lg">View Recommendations →</a>
                </div>
            </form>
        </div>
    </div>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

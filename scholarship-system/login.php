<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Unified Authentication Controller (Student & Admin Login)
 * File: login.php
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';

// Redirect if already logged in
if (isStudentLoggedIn()) {
    header("Location: student/dashboard.php");
    exit;
} elseif (isAdminLoggedIn()) {
    header("Location: admin/dashboard.php");
    exit;
}

$pageTitle = "Sign In";
$baseUrl = "";
$errorMsg = $_SESSION['flash_error'] ?? '';
$successMsg = $_SESSION['flash_success'] ?? '';
unset($_SESSION['flash_error'], $_SESSION['flash_success']);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!verifyCSRFToken($csrfToken)) {
        $errorMsg = "Security token mismatch. Please submit the form again.";
    } else {
        $emailOrUsername = trim($_POST['username_email'] ?? '');
        $password = $_POST['password'] ?? '';
        $role = $_POST['role'] ?? 'student';

        if (empty($emailOrUsername) || empty($password)) {
            $errorMsg = "Please enter both credentials and select your login role.";
        } else {
            try {
                $db = getDB();

                if ($role === 'admin') {
                    // Authenticate Administrator
                    $stmt = $db->prepare("SELECT * FROM tbl_admin WHERE username = ? OR email = ?");
                    $stmt->execute([$emailOrUsername, $emailOrUsername]);
                    $admin = $stmt->fetch();

                    if ($admin && password_verify($password, $admin['password'])) {
                        $_SESSION['user_type'] = 'admin';
                        $_SESSION['admin_id'] = (int)$admin['admin_id'];
                        $_SESSION['admin_name'] = $admin['full_name'];
                        header("Location: admin/dashboard.php");
                        exit;
                    } else {
                        $errorMsg = "Invalid administrative username/email or password.";
                    }
                } else {
                    // Authenticate Student
                    $stmt = $db->prepare("SELECT * FROM tbl_student WHERE email = ?");
                    $stmt->execute([$emailOrUsername]);
                    $student = $stmt->fetch();

                    if ($student && password_verify($password, $student['password'])) {
                        $_SESSION['user_type'] = 'student';
                        $_SESSION['student_id'] = (int)$student['student_id'];
                        $_SESSION['student_name'] = $student['full_name'];
                        $_SESSION['student_email'] = $student['email'];
                        header("Location: student/dashboard.php");
                        exit;
                    } else {
                        $errorMsg = "Invalid student email address or password.";
                    }
                }
            } catch (Exception $e) {
                $errorMsg = "An error occurred while authenticating. Please try again.";
            }
        }
    }
}

$csrf = generateCSRFToken();
include __DIR__ . '/includes/header.php';
?>

<main class="main-content flex items-center justify-center">
    <div class="container container-narrow" style="max-width: 480px;">
        <div class="card" style="padding: 2.25rem;">
            <div class="text-center mb-3">
                <div style="width: 44px; height: 44px; background-color: var(--primary); color: var(--accent); border-radius: var(--radius-sm); display: inline-flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; margin-bottom: 0.75rem;">
                    S
                </div>
                <h2 style="font-size: 1.75rem; margin-bottom: 0.25rem;">Portal Sign In</h2>
                <p class="text-sm">Access your scholarships, recommendations & submissions</p>
            </div>

            <?php if (!empty($errorMsg)): ?>
                <div class="alert alert-danger"><?= sanitize($errorMsg) ?></div>
            <?php endif; ?>

            <?php if (!empty($successMsg)): ?>
                <div class="alert alert-success"><?= sanitize($successMsg) ?></div>
            <?php endif; ?>

            <form action="login.php" method="POST" id="loginForm">
                <input type="hidden" name="csrf_token" value="<?= $csrf ?>">

                <!-- Role Selector Tabs -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; background-color: var(--surface-subtle); padding: 0.35rem; border-radius: var(--radius-sm); margin-bottom: 1.25rem;">
                    <label style="cursor: pointer; text-align: center;">
                        <input type="radio" name="role" value="student" checked style="display: none;" onchange="updateRoleUI(this.value)">
                        <div id="studentTabBtn" style="padding: 0.5rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--radius-sm); background-color: var(--surface); color: var(--primary); box-shadow: var(--shadow-subtle);">
                            Student
                        </div>
                    </label>
                    <label style="cursor: pointer; text-align: center;">
                        <input type="radio" name="role" value="admin" style="display: none;" onchange="updateRoleUI(this.value)">
                        <div id="adminTabBtn" style="padding: 0.5rem; font-size: 0.875rem; font-weight: 600; border-radius: var(--radius-sm); color: var(--text-secondary);">
                            Administrator
                        </div>
                    </label>
                </div>

                <div class="form-group">
                    <label for="username_email" class="form-label" id="usernameEmailLabel">
                        Email Address <span class="required">*</span>
                    </label>
                    <input type="text" id="username_email" name="username_email" class="form-control" placeholder="e.g. aarav.sharma@example.com" required autocomplete="username">
                </div>

                <div class="form-group">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <label for="password" class="form-label" style="margin-bottom: 0;">Password <span class="required">*</span></label>
                        <a href="forgot_password.php" class="text-xs" style="color: var(--secondary); font-weight: 600;">Forgot Password?</a>
                    </div>
                    <div style="position: relative;">
                        <input type="password" id="password" name="password" class="form-control" placeholder="••••••••" required autocomplete="current-password" style="padding-right: 4.5rem;">
                        <button type="button" class="password-toggle-btn btn btn-secondary btn-sm" data-target="password" style="position: absolute; right: 6px; top: 50%; transform: translateY(-50%); padding: 0.3rem 0.6rem; font-size: 0.75rem;">
                            Show
                        </button>
                    </div>
                </div>

                <div style="margin-top: 1.5rem;">
                    <button type="submit" class="btn btn-primary btn-block btn-lg" id="submitLoginBtn">
                        Sign In to Account
                    </button>
                </div>
            </form>

            <div class="text-center text-sm mt-4 pt-2" style="border-top: 1px solid var(--border-light);">
                Don't have a student account? <a href="register.php" style="font-weight: 600; color: var(--primary);">Register here</a>
            </div>
        </div>
    </div>
</main>

<script>
function updateRoleUI(role) {
    const sBtn = document.getElementById('studentTabBtn');
    const aBtn = document.getElementById('adminTabBtn');
    const label = document.getElementById('usernameEmailLabel');
    const input = document.getElementById('username_email');

    if (role === 'admin') {
        aBtn.style.backgroundColor = 'var(--surface)';
        aBtn.style.color = 'var(--primary)';
        aBtn.style.boxShadow = 'var(--shadow-subtle)';
        sBtn.style.backgroundColor = 'transparent';
        sBtn.style.color = 'var(--text-secondary)';
        sBtn.style.boxShadow = 'none';
        label.innerHTML = 'Username or Admin Email <span class="required">*</span>';
        input.placeholder = 'e.g. admin or admin@scholarship.org';
    } else {
        sBtn.style.backgroundColor = 'var(--surface)';
        sBtn.style.color = 'var(--primary)';
        sBtn.style.boxShadow = 'var(--shadow-subtle)';
        aBtn.style.backgroundColor = 'transparent';
        aBtn.style.color = 'var(--text-secondary)';
        aBtn.style.boxShadow = 'none';
        label.innerHTML = 'Email Address <span class="required">*</span>';
        input.placeholder = 'e.g. aarav.sharma@example.com';
    }
}
</script>

<?php include __DIR__ . '/includes/footer.php'; ?>

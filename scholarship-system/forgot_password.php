<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Password Recovery Simulation
 * File: forgot_password.php
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';

$pageTitle = "Reset Password";
$baseUrl = "";
$message = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = trim($_POST['email'] ?? '');
    if (!empty($email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $message = "If an account is associated with " . sanitize($email) . ", a password reset link has been dispatched to your email.";
    } else {
        $message = "Please provide a valid registered email address.";
    }
}

include __DIR__ . '/includes/header.php';
?>

<main class="main-content flex items-center justify-center">
    <div class="container container-narrow" style="max-width: 460px;">
        <div class="card" style="padding: 2.25rem;">
            <div class="text-center mb-3">
                <h2 style="font-size: 1.75rem; margin-bottom: 0.25rem;">Reset Password</h2>
                <p class="text-sm">Enter your registered email to receive access instructions</p>
            </div>

            <?php if (!empty($message)): ?>
                <div class="alert alert-info"><?= $message ?></div>
            <?php endif; ?>

            <form action="forgot_password.php" method="POST">
                <div class="form-group">
                    <label for="email" class="form-label">Registered Email Address</label>
                    <input type="email" id="email" name="email" class="form-control" placeholder="e.g. aarav.sharma@example.com" required>
                </div>

                <div class="mt-4">
                    <button type="submit" class="btn btn-primary btn-block">Send Reset Link</button>
                </div>
            </form>

            <div class="text-center text-sm mt-4">
                <a href="login.php" style="color: var(--secondary); font-weight: 600;">← Back to Sign In</a>
            </div>
        </div>
    </div>
</main>

<?php include __DIR__ . '/includes/footer.php'; ?>

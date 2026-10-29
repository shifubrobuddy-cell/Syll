<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Authentication, Session & RBAC Handler
 * File: includes/auth.php
 */

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

/**
 * Generate and store CSRF token in session
 */
function generateCSRFToken(): string {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Verify submitted CSRF token
 */
function verifyCSRFToken(?string $token): bool {
    if (empty($_SESSION['csrf_token']) || empty($token)) {
        return false;
    }
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Check if a student is logged in
 */
function isStudentLoggedIn(): bool {
    return isset($_SESSION['user_type']) && $_SESSION['user_type'] === 'student' && !empty($_SESSION['student_id']);
}

/**
 * Check if an admin is logged in
 */
function isAdminLoggedIn(): bool {
    return isset($_SESSION['user_type']) && $_SESSION['user_type'] === 'admin' && !empty($_SESSION['admin_id']);
}

/**
 * Enforce student authentication
 */
function requireStudentAuth(): void {
    if (!isStudentLoggedIn()) {
        $_SESSION['flash_error'] = "Please log in as a student to access this page.";
        header("Location: ../login.php");
        exit;
    }
}

/**
 * Enforce admin authentication
 */
function requireAdminAuth(): void {
    if (!isAdminLoggedIn()) {
        $_SESSION['flash_error'] = "Administrative login required.";
        header("Location: ../login.php");
        exit;
    }
}

/**
 * Get current logged in student data
 */
function getLoggedInStudent(PDO $db): ?array {
    if (!isStudentLoggedIn()) {
        return null;
    }
    $stmt = $db->prepare("SELECT * FROM tbl_student WHERE student_id = ?");
    $stmt->execute([$_SESSION['student_id']]);
    $student = $stmt->fetch();
    return $student ?: null;
}

/**
 * Get current logged in admin data
 */
function getLoggedInAdmin(PDO $db): ?array {
    if (!isAdminLoggedIn()) {
        return null;
    }
    $stmt = $db->prepare("SELECT admin_id, username, email, full_name FROM tbl_admin WHERE admin_id = ?");
    $stmt->execute([$_SESSION['admin_id']]);
    $admin = $stmt->fetch();
    return $admin ?: null;
}
?>

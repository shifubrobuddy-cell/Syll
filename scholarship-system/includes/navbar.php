<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Navigation Bar Component
 * File: includes/navbar.php
 */

$isStudent = isStudentLoggedIn();
$isAdmin = isAdminLoggedIn();
$unreadNotifs = 0;

if ($isStudent) {
    try {
        $db = getDB();
        $unreadNotifs = getUnreadNotificationCount($db, $_SESSION['student_id']);
    } catch (Exception $e) {
        $unreadNotifs = 0;
    }
}
$bUrl = isset($baseUrl) ? $baseUrl : '';
?>
<header style="background-color: var(--surface); border-bottom: 1px solid var(--border); position: sticky; top: 0; z-index: 100;">
    <div class="container" style="display: flex; align-items: center; justify-content: space-between; height: 72px;">
        <!-- Brand Logo -->
        <a href="<?= $bUrl ?>index.php" style="display: flex; align-items: center; gap: 0.65rem; text-decoration: none;">
            <img src="<?= $bUrl ?>../assets/aistudio/scholarship_logo_full_c25f5592.png" alt="Scholarship Recommendation System" style="height: 42px; width: auto; object-fit: contain;" onerror="this.style.display='none'; document.getElementById('php-brand-fallback').style.display='flex';" />
            <div id="php-brand-fallback" style="display: none; align-items: center; gap: 0.65rem;">
                <div style="width: 36px; height: 36px; background-color: var(--primary); color: var(--accent); border-radius: var(--radius-sm); display: flex; align-items: center; justify-content: center; font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700;">
                    S
                </div>
                <div>
                    <div style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--primary); line-height: 1.1;">SCHOLARSHIP</div>
                    <div style="font-size: 0.65rem; font-weight: 600; color: var(--secondary); letter-spacing: 0.12em; text-transform: uppercase;">Recommendation System</div>
                </div>
            </div>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links-desktop" style="display: flex; align-items: center; gap: 1.5rem;">
            <?php if (!$isStudent && !$isAdmin): ?>
                <a href="<?= $bUrl ?>index.php" style="font-size: 0.9375rem; font-weight: 500; color: var(--primary);">Home</a>
                <a href="<?= $bUrl ?>student/scholarships.php" style="font-size: 0.9375rem; font-weight: 500; color: var(--primary);">Scholarships</a>
                <a href="<?= $bUrl ?>index.php#how-it-works" style="font-size: 0.9375rem; font-weight: 500; color: var(--primary);">How It Works</a>
                <div style="display: flex; align-items: center; gap: 0.75rem; margin-left: 1rem;">
                    <a href="<?= $bUrl ?>login.php" class="btn btn-secondary btn-sm">Sign In</a>
                    <a href="<?= $bUrl ?>register.php" class="btn btn-primary btn-sm">Get Started</a>
                </div>
            <?php elseif ($isStudent): ?>
                <a href="<?= $bUrl ?>student/dashboard.php" style="font-size: 0.9375rem; font-weight: 500; color: var(--primary);">Dashboard</a>
                <a href="<?= $bUrl ?>student/scholarships.php" style="font-size: 0.9375rem; font-weight: 500; color: var(--primary);">Scholarships</a>
                <a href="<?= $bUrl ?>student/recommendations.php" style="font-size: 0.9375rem; font-weight: 600; color: #8C6A1B; background-color: var(--accent-subtle); padding: 0.35rem 0.75rem; border-radius: var(--radius-pill);">Recommendations</a>
                <a href="<?= $bUrl ?>student/my_applications.php" style="font-size: 0.9375rem; font-weight: 500; color: var(--primary);">My Applications</a>
                <a href="<?= $bUrl ?>student/notifications.php" style="font-size: 0.9375rem; font-weight: 500; color: var(--primary); display: inline-flex; align-items: center; gap: 0.35rem;">
                    Alerts
                    <?php if ($unreadNotifs > 0): ?>
                        <span class="badge badge-danger" style="font-size: 0.65rem; padding: 0.2rem 0.5rem;"><?= $unreadNotifs ?></span>
                    <?php endif; ?>
                </a>
                <a href="<?= $bUrl ?>student/profile.php" style="font-size: 0.9375rem; font-weight: 500; color: var(--primary);">Profile</a>
                <a href="<?= $bUrl ?>logout.php" class="btn btn-secondary btn-sm" style="color: var(--danger); border-color: var(--danger-border);">Logout</a>
            <?php elseif ($isAdmin): ?>
                <a href="<?= $bUrl ?>admin/dashboard.php" style="font-size: 0.9375rem; font-weight: 500; color: var(--primary);">Admin Hub</a>
                <a href="<?= $bUrl ?>admin/manage_scholarships.php" style="font-size: 0.9375rem; font-weight: 500; color: var(--primary);">Scholarships</a>
                <a href="<?= $bUrl ?>admin/manage_students.php" style="font-size: 0.9375rem; font-weight: 500; color: var(--primary);">Students</a>
                <a href="<?= $bUrl ?>admin/verify_applications.php" style="font-size: 0.9375rem; font-weight: 500; color: var(--primary);">Applications</a>
                <a href="<?= $bUrl ?>admin/reports.php" style="font-size: 0.9375rem; font-weight: 500; color: var(--primary);">Reports</a>
                <a href="<?= $bUrl ?>logout.php" class="btn btn-secondary btn-sm" style="color: var(--danger);">Logout</a>
            <?php endif; ?>
        </nav>

        <!-- Mobile Menu Hamburger Button -->
        <button id="mobileMenuToggle" class="navbar-menu-toggle btn btn-secondary btn-sm" aria-label="Toggle menu" style="padding: 0.5rem 0.75rem;">
            ☰
        </button>
    </div>

    <!-- Mobile Drawer -->
    <div id="mobileDrawer" class="navbar-mobile-drawer">
        <?php if (!$isStudent && !$isAdmin): ?>
            <a href="<?= $bUrl ?>index.php" class="navbar-mobile-link">Home</a>
            <a href="<?= $bUrl ?>student/scholarships.php" class="navbar-mobile-link">Scholarships</a>
            <a href="<?= $bUrl ?>index.php#how-it-works" class="navbar-mobile-link">How It Works</a>
            <a href="<?= $bUrl ?>login.php" class="navbar-mobile-link">Sign In</a>
            <a href="<?= $bUrl ?>register.php" class="navbar-mobile-link" style="color: var(--accent);">Get Started</a>
        <?php elseif ($isStudent): ?>
            <a href="<?= $bUrl ?>student/dashboard.php" class="navbar-mobile-link">Dashboard</a>
            <a href="<?= $bUrl ?>student/scholarships.php" class="navbar-mobile-link">Scholarships</a>
            <a href="<?= $bUrl ?>student/recommendations.php" class="navbar-mobile-link">Recommendations</a>
            <a href="<?= $bUrl ?>student/my_applications.php" class="navbar-mobile-link">My Applications</a>
            <a href="<?= $bUrl ?>student/notifications.php" class="navbar-mobile-link">Notifications (<?= $unreadNotifs ?>)</a>
            <a href="<?= $bUrl ?>student/profile.php" class="navbar-mobile-link">My Profile</a>
            <a href="<?= $bUrl ?>logout.php" class="navbar-mobile-link" style="color: var(--danger);">Logout</a>
        <?php elseif ($isAdmin): ?>
            <a href="<?= $bUrl ?>admin/dashboard.php" class="navbar-mobile-link">Dashboard</a>
            <a href="<?= $bUrl ?>admin/manage_scholarships.php" class="navbar-mobile-link">Manage Scholarships</a>
            <a href="<?= $bUrl ?>admin/manage_students.php" class="navbar-mobile-link">Manage Students</a>
            <a href="<?= $bUrl ?>admin/verify_applications.php" class="navbar-mobile-link">Verify Applications</a>
            <a href="<?= $bUrl ?>admin/reports.php" class="navbar-mobile-link">Reports & Analytics</a>
            <a href="<?= $bUrl ?>logout.php" class="navbar-mobile-link" style="color: var(--danger);">Logout</a>
        <?php endif; ?>
    </div>
</header>

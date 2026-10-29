<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Administrative Command Center
 * File: admin/dashboard.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

requireAdminAuth();

$pageTitle = "Admin Dashboard";
$baseUrl = "../";

$db = getDB();
$admin = getLoggedInAdmin($db);

// Dynamic Metric Calculations from MySQL
$totalStudents = (int)$db->query("SELECT COUNT(*) FROM tbl_student")->fetchColumn();
$totalScholarships = (int)$db->query("SELECT COUNT(*) FROM tbl_scholarship")->fetchColumn();
$activeScholarships = (int)$db->query("SELECT COUNT(*) FROM tbl_scholarship WHERE status = 'Active'")->fetchColumn();
$totalApplications = (int)$db->query("SELECT COUNT(*) FROM tbl_application")->fetchColumn();
$pendingApplications = (int)$db->query("SELECT COUNT(*) FROM tbl_application WHERE status IN ('Applied', 'Under Review')")->fetchColumn();
$approvedApplications = (int)$db->query("SELECT COUNT(*) FROM tbl_application WHERE status = 'Approved'")->fetchColumn();
$rejectedApplications = (int)$db->query("SELECT COUNT(*) FROM tbl_application WHERE status = 'Rejected'")->fetchColumn();

// Fetch Recent Applications with Student and Scholarship Info
$stmtRecent = $db->query("
    SELECT a.*, s.full_name as student_name, s.course, s.category, sch.title as scholarship_title, sch.amount 
    FROM tbl_application a
    JOIN tbl_student s ON a.student_id = s.student_id
    JOIN tbl_scholarship sch ON a.scholarship_id = sch.scholarship_id
    ORDER BY a.applied_date DESC
    LIMIT 6
");
$recentApps = $stmtRecent->fetchAll();

// Fetch Upcoming Scholarship Deadlines
$stmtDeadlines = $db->query("
    SELECT * FROM tbl_scholarship 
    WHERE status = 'Active' 
    ORDER BY last_date ASC 
    LIMIT 4
");
$upcomingDeadlines = $stmtDeadlines->fetchAll();

include __DIR__ . '/../includes/header.php';
?>

<div class="admin-layout">
    <!-- Admin Navigation Sidebar -->
    <aside class="admin-sidebar">
        <div style="padding: 0 1.5rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <div style="font-size: 0.75rem; color: var(--accent); font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em;">Auditor Portal</div>
            <div style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: #FFFFFF;"><?= sanitize($admin['full_name']) ?></div>
            <div style="font-size: 0.75rem; color: #94A3B8;"><?= sanitize($admin['email']) ?></div>
        </div>

        <ul class="admin-nav mt-2">
            <li class="admin-nav-item"><a href="dashboard.php" class="admin-nav-link active">📊 Dashboard Overview</a></li>
            <li class="admin-nav-item"><a href="manage_scholarships.php" class="admin-nav-link">🎓 Manage Scholarships</a></li>
            <li class="admin-nav-item"><a href="manage_students.php" class="admin-nav-link">👥 Registered Students</a></li>
            <li class="admin-nav-item"><a href="verify_applications.php" class="admin-nav-link">📑 Verify Applications</a></li>
            <li class="admin-nav-item"><a href="reports.php" class="admin-nav-link">📈 Reports & Analytics</a></li>
            <li class="admin-nav-item"><a href="../export.php?type=applications_csv" class="admin-nav-link" style="color: var(--accent);">📥 Export Applications (CSV)</a></li>
            <li class="admin-nav-item"><a href="../logout.php" class="admin-nav-link" style="color: #F87171;">🚪 Logout</a></li>
        </ul>
    </aside>

    <!-- Admin Content View -->
    <main class="admin-content">
        <div class="container" style="max-width: 100%; padding: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h2>Executive Admin Command Center</h2>
                    <p>Real-time applicant audits, grant lifecycle monitoring, and eligibility analytics.</p>
                </div>
                <div style="display: flex; gap: 0.75rem;">
                    <a href="manage_scholarships.php?action=create" class="btn btn-accent btn-sm">+ Add New Scholarship</a>
                    <a href="verify_applications.php" class="btn btn-primary btn-sm">Audit Submissions (<?= $pendingApplications ?>)</a>
                </div>
            </div>

            <!-- Metrics Overview -->
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-icon-box icon-box-primary">👥</div>
                    <div class="metric-info">
                        <div class="metric-value"><?= $totalStudents ?></div>
                        <div class="metric-label">Registered Students</div>
                    </div>
                </div>

                <div class="metric-card">
                    <div class="metric-icon-box icon-box-gold">🎓</div>
                    <div class="metric-info">
                        <div class="metric-value"><?= $activeScholarships ?> / <?= $totalScholarships ?></div>
                        <div class="metric-label">Active / Total Grants</div>
                    </div>
                </div>

                <div class="metric-card">
                    <div class="metric-icon-box icon-box-amber">⏳</div>
                    <div class="metric-info">
                        <div class="metric-value"><?= $pendingApplications ?></div>
                        <div class="metric-label">Pending Verifications</div>
                    </div>
                </div>

                <div class="metric-card">
                    <div class="metric-icon-box icon-box-green">✓</div>
                    <div class="metric-info">
                        <div class="metric-value"><?= $approvedApplications ?></div>
                        <div class="metric-label">Approved Applications</div>
                    </div>
                </div>
            </div>

            <!-- 2-Column Administrative Grid -->
            <div style="display: grid; grid-template-columns: 1.35fr 0.65fr; gap: 2rem;">
                
                <!-- Recent Application Dossiers -->
                <div class="card" style="padding: 0;">
                    <div class="card-header" style="padding: 1.25rem 1.5rem; margin: 0;">
                        <h3 class="card-title">Recent Submissions for Audit</h3>
                        <a href="verify_applications.php" class="text-sm font-semibold" style="color: var(--secondary);">Open Verification Desk →</a>
                    </div>
                    <div class="table-responsive" style="border: none;">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Applicant</th>
                                    <th>Scholarship</th>
                                    <th>Applied On</th>
                                    <th>Status</th>
                                    <th>Audit Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (!empty($recentApps)): ?>
                                    <?php foreach ($recentApps as $ra): ?>
                                        <tr>
                                            <td>
                                                <strong><?= sanitize($ra['student_name']) ?></strong>
                                                <div class="text-xs text-muted"><?= sanitize($ra['course']) ?> (<?= sanitize($ra['category']) ?>)</div>
                                            </td>
                                            <td>
                                                <div style="font-weight: 500;"><?= sanitize($ra['scholarship_title']) ?></div>
                                                <div class="text-xs text-muted"><?= formatCurrency($ra['amount']) ?></div>
                                            </td>
                                            <td><?= formatDate($ra['applied_date']) ?></td>
                                            <td>
                                                <?php
                                                $b = 'badge-neutral';
                                                if ($ra['status'] === 'Approved') $b = 'badge-success';
                                                elseif ($ra['status'] === 'Under Review') $b = 'badge-warning';
                                                elseif ($ra['status'] === 'Rejected') $b = 'badge-danger';
                                                elseif ($ra['status'] === 'Applied') $b = 'badge-info';
                                                ?>
                                                <span class="badge <?= $b ?>"><?= $ra['status'] ?></span>
                                            </td>
                                            <td>
                                                <a href="verify_applications.php?id=<?= $ra['application_id'] ?>" class="btn btn-secondary btn-sm">
                                                    Verify Dossier
                                                </a>
                                            </td>
                                        </tr>
                                    <?php endforeach; ?>
                                <?php else: ?>
                                    <tr>
                                        <td colspan="5" class="text-center text-muted py-3">No applications registered yet.</td>
                                    </tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Upcoming Deadlines Watchlist -->
                <div class="card">
                    <div class="card-header" style="margin-bottom: 1rem;">
                        <h3 class="card-title">Deadline Watchlist</h3>
                        <a href="manage_scholarships.php" class="text-xs font-semibold">Manage</a>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                        <?php foreach ($upcomingDeadlines as $ud): ?>
                            <div style="background-color: var(--surface-subtle); padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border);">
                                <div style="font-weight: 600; font-size: 0.9375rem; color: var(--primary); margin-bottom: 0.25rem;">
                                    <?= sanitize($ud['title']) ?>
                                </div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-secondary);">
                                    <span>Award: <strong><?= formatCurrency($ud['amount']) ?></strong></span>
                                    <span>Closes: <strong style="color: var(--danger);"><?= formatDate($ud['last_date']) ?></strong></span>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

            </div>
        </div>
    </main>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

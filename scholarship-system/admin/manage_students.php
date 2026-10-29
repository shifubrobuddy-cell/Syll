<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Student Roster & Academic Parameters Directory
 * File: admin/manage_students.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

requireAdminAuth();

$pageTitle = "Registered Students";
$baseUrl = "../";

$db = getDB();
$admin = getLoggedInAdmin($db);

// Filter by category or course if requested
$catFilter = $_GET['category'] ?? 'ALL';
$courseFilter = $_GET['course'] ?? 'ALL';

$sql = "SELECT * FROM tbl_student WHERE 1=1";
$params = [];

if ($catFilter !== 'ALL') {
    $sql .= " AND category = ?";
    $params[] = $catFilter;
}
if ($courseFilter !== 'ALL') {
    $sql .= " AND course = ?";
    $params[] = $courseFilter;
}
$sql .= " ORDER BY created_at DESC";

$stmt = $db->prepare($sql);
$stmt->execute($params);
$students = $stmt->fetchAll();

include __DIR__ . '/../includes/header.php';
?>

<div class="admin-layout">
    <aside class="admin-sidebar">
        <div style="padding: 0 1.5rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <div style="font-size: 0.75rem; color: var(--accent); font-weight: 700; text-transform: uppercase;">Auditor Portal</div>
            <div style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: #FFFFFF;"><?= sanitize($admin['full_name']) ?></div>
        </div>

        <ul class="admin-nav mt-2">
            <li class="admin-nav-item"><a href="dashboard.php" class="admin-nav-link">📊 Dashboard Overview</a></li>
            <li class="admin-nav-item"><a href="manage_scholarships.php" class="admin-nav-link">🎓 Manage Scholarships</a></li>
            <li class="admin-nav-item"><a href="manage_students.php" class="admin-nav-link active">👥 Registered Students</a></li>
            <li class="admin-nav-item"><a href="verify_applications.php" class="admin-nav-link">📑 Verify Applications</a></li>
            <li class="admin-nav-item"><a href="reports.php" class="admin-nav-link">📈 Reports & Analytics</a></li>
            <li class="admin-nav-item"><a href="../logout.php" class="admin-nav-link" style="color: #F87171;">🚪 Logout</a></li>
        </ul>
    </aside>

    <main class="admin-content">
        <div class="container" style="max-width: 100%; padding: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h2>Registered Student Profiles</h2>
                    <p class="text-sm">Student academic records, income statements, and category classifications.</p>
                </div>
                <div>
                    <input type="text" id="adminTableSearch" class="form-control" placeholder="🔍 Quick search students..." style="width: 260px;">
                </div>
            </div>

            <div class="card" style="padding: 0;">
                <div class="table-responsive" style="border: none;">
                    <table class="table admin-data-table">
                        <thead>
                            <tr>
                                <th>Student ID</th>
                                <th>Full Name & Email</th>
                                <th>Category</th>
                                <th>Course Stream</th>
                                <th>Marks</th>
                                <th>Annual Income</th>
                                <th>Domicile State</th>
                                <th>Registered</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($students as $st): ?>
                                <tr>
                                    <td><strong>#STU-<?= str_pad($st['student_id'], 4, '0', STR_PAD_LEFT) ?></strong></td>
                                    <td>
                                        <div style="font-weight: 600; color: var(--primary);"><?= sanitize($st['full_name']) ?></div>
                                        <div class="text-xs text-muted"><?= sanitize($st['email']) ?></div>
                                    </td>
                                    <td><span class="badge badge-accent"><?= sanitize($st['category']) ?></span></td>
                                    <td><?= sanitize($st['course']) ?></td>
                                    <td><strong><?= $st['marks_percentage'] ?>%</strong></td>
                                    <td><?= formatCurrency($st['annual_income']) ?></td>
                                    <td><?= sanitize($st['state']) ?></td>
                                    <td class="text-xs text-muted"><?= formatDate($st['created_at']) ?></td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

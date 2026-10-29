<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Database Analytics & Native SVG Reporting Engine (Zero External Chart Libraries)
 * File: admin/reports.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

requireAdminAuth();

$pageTitle = "Reports & Analytics";
$baseUrl = "../";

$db = getDB();
$admin = getLoggedInAdmin($db);

// 1. Distribution of Applications by Status
$stmtStatus = $db->query("
    SELECT status, COUNT(*) as count 
    FROM tbl_application 
    GROUP BY status
");
$statusData = $stmtStatus->fetchAll();

// 2. Applications by Student Category
$stmtCategory = $db->query("
    SELECT s.category, COUNT(a.application_id) as count 
    FROM tbl_student s
    LEFT JOIN tbl_application a ON s.student_id = a.student_id
    GROUP BY s.category
");
$categoryData = $stmtCategory->fetchAll();

// 3. Applications by Course Stream
$stmtCourse = $db->query("
    SELECT s.course, COUNT(a.application_id) as count 
    FROM tbl_student s
    JOIN tbl_application a ON s.student_id = a.student_id
    GROUP BY s.course
");
$courseData = $stmtCourse->fetchAll();

// 4. Most Popular Scholarships
$stmtPop = $db->query("
    SELECT sch.title, sch.amount, COUNT(a.application_id) as total_applicants,
           SUM(CASE WHEN a.status = 'Approved' THEN 1 ELSE 0 END) as approved_count
    FROM tbl_scholarship sch
    LEFT JOIN tbl_application a ON sch.scholarship_id = a.scholarship_id
    GROUP BY sch.scholarship_id
    ORDER BY total_applicants DESC
    LIMIT 6
");
$popularScholarships = $stmtPop->fetchAll();

// Format data for SVG Bar Charts
$categoryChartData = [];
$categoryColors = ['#18263D', '#344B78', '#D6B36A', '#2A734C', '#B87314', '#A83232'];
$idx = 0;
foreach ($categoryData as $cd) {
    $categoryChartData[] = [
        'label' => $cd['category'],
        'value' => (int)$cd['count'],
        'color' => $categoryColors[$idx % count($categoryColors)]
    ];
    $idx++;
}

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
            <li class="admin-nav-item"><a href="manage_students.php" class="admin-nav-link">👥 Registered Students</a></li>
            <li class="admin-nav-item"><a href="verify_applications.php" class="admin-nav-link">📑 Verify Applications</a></li>
            <li class="admin-nav-item"><a href="reports.php" class="admin-nav-link active">📈 Reports & Analytics</a></li>
            <li class="admin-nav-item"><a href="../logout.php" class="admin-nav-link" style="color: #F87171;">🚪 Logout</a></li>
        </ul>
    </aside>

    <main class="admin-content">
        <div class="container" style="max-width: 100%; padding: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h2>Statistical Reports & Analytics</h2>
                    <p class="text-sm">Real-time MySQL aggregations rendered with mathematical SVG charts (Zero external JS libraries).</p>
                </div>
                <div style="display: flex; gap: 0.75rem;">
                    <a href="../export.php?type=applications_csv" class="btn btn-secondary btn-sm">📥 Export CSV</a>
                    <a href="../export.php?type=applications_json" class="btn btn-secondary btn-sm" target="_blank">📥 Export JSON</a>
                </div>
            </div>

            <!-- Charts 2-Column Grid -->
            <div class="grid grid-2" style="margin-bottom: 2rem;">
                
                <!-- Chart 1: Applications by Category (Native SVG Chart) -->
                <div class="chart-container">
                    <div class="chart-header">
                        <h4 class="card-title">Applications by Social Category</h4>
                        <span class="badge badge-accent">Live Distribution</span>
                    </div>
                    <div id="categorySVGChart" class="chart-wrapper">
                        <!-- Rendered by Vanilla JS Math Engine -->
                    </div>
                </div>

                <!-- Chart 2: Status Breakdown Summary -->
                <div class="card" style="padding: 1.5rem;">
                    <div class="card-header" style="margin-bottom: 1.25rem;">
                        <h4 class="card-title">Application Status Ratios</h4>
                        <span class="badge badge-neutral">Audited Counts</span>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                        <?php foreach ($statusData as $st): ?>
                            <?php 
                            $barColor = 'var(--primary)';
                            if ($st['status'] === 'Approved') $barColor = 'var(--success)';
                            elseif ($st['status'] === 'Under Review') $barColor = 'var(--warning)';
                            elseif ($st['status'] === 'Rejected') $barColor = 'var(--danger)';
                            elseif ($st['status'] === 'Applied') $barColor = 'var(--info)';
                            ?>
                            <div>
                                <div style="display: flex; justify-content: space-between; font-size: 0.875rem; margin-bottom: 0.25rem;">
                                    <strong><?= $st['status'] ?></strong>
                                    <span><?= $st['count'] ?> Submissions</span>
                                </div>
                                <div style="height: 10px; background-color: var(--surface-subtle); border-radius: var(--radius-pill); overflow: hidden;">
                                    <div style="height: 100%; width: <?= min(100, $st['count'] * 20) ?>%; background-color: <?= $barColor ?>; border-radius: var(--radius-pill);"></div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

            </div>

            <!-- Popular Scholarships Table -->
            <div class="card" style="padding: 0;">
                <div class="card-header" style="padding: 1.25rem 1.5rem; margin: 0;">
                    <h3 class="card-title">Grant Popularity & Approval Rates</h3>
                </div>
                <div class="table-responsive" style="border: none;">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Scholarship Title</th>
                                <th>Award Amount</th>
                                <th>Total Applicants</th>
                                <th>Approved Grants</th>
                                <th>Approval Rate</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($popularScholarships as $pop): ?>
                                <?php 
                                $rate = $pop['total_applicants'] > 0 ? round(($pop['approved_count'] / $pop['total_applicants']) * 100) : 0;
                                ?>
                                <tr>
                                    <td><strong><?= sanitize($pop['title']) ?></strong></td>
                                    <td><?= formatCurrency($pop['amount']) ?></td>
                                    <td><strong><?= $pop['total_applicants'] ?></strong></td>
                                    <td><span class="badge badge-success"><?= $pop['approved_count'] ?> Approved</span></td>
                                    <td>
                                        <div style="display: flex; align-items: center; gap: 0.5rem;">
                                            <div style="flex: 1; height: 6px; background-color: var(--surface-subtle); border-radius: var(--radius-pill); overflow: hidden; min-width: 60px;">
                                                <div style="height: 100%; width: <?= $rate ?>%; background-color: var(--secondary);"></div>
                                            </div>
                                            <span style="font-size: 0.75rem; font-weight: 600;"><?= $rate ?>%</span>
                                        </div>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    </main>
</div>

<script>
document.addEventListener('DOMContentLoaded', () => {
    const categoryChartData = <?= json_encode($categoryChartData) ?>;
    if (window.renderSVGBarChart && categoryChartData.length > 0) {
        window.renderSVGBarChart('categorySVGChart', categoryChartData);
    }
});
</script>

<?php include __DIR__ . '/../includes/footer.php'; ?>

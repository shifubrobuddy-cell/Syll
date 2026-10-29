<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Student Command Center / Dashboard
 * File: student/dashboard.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

requireStudentAuth();

$pageTitle = "Student Dashboard";
$baseUrl = "../";

$db = getDB();
$student = getLoggedInStudent($db);

if (!$student) {
    header("Location: ../logout.php");
    exit;
}

// 1. Fetch all active scholarships and evaluate Rule-Based Recommendations
$stmtSch = $db->query("SELECT * FROM tbl_scholarship WHERE status = 'Active' ORDER BY last_date ASC");
$allScholarships = $stmtSch->fetchAll();

$recommendedScholarships = [];
foreach ($allScholarships as $sch) {
    $matchResult = calculateScholarshipMatch($student, $sch);
    if ($matchResult['match_score'] >= 50) {
        $recommendedScholarships[] = array_merge($sch, ['match' => $matchResult]);
    }
}

// Sort recommendations by match score descending, then amount descending
usort($recommendedScholarships, function($a, $b) {
    if ($b['match']['match_score'] === $a['match']['match_score']) {
        return $b['amount'] <=> $a['amount'];
    }
    return $b['match']['match_score'] <=> $a['match']['match_score'];
});

// 2. Fetch Student Applications Statistics
$stmtApps = $db->prepare("
    SELECT a.*, s.title, s.provider, s.amount, s.last_date 
    FROM tbl_application a
    JOIN tbl_scholarship s ON a.scholarship_id = s.scholarship_id
    WHERE a.student_id = ?
    ORDER BY a.applied_date DESC
");
$stmtApps->execute([$student['student_id']]);
$studentApplications = $stmtApps->fetchAll();

$totalApplied = count($studentApplications);
$approvedCount = 0;
$underReviewCount = 0;
$appliedPendingCount = 0;

foreach ($studentApplications as $app) {
    if ($app['status'] === 'Approved') $approvedCount++;
    elseif ($app['status'] === 'Under Review') $underReviewCount++;
    elseif ($app['status'] === 'Applied') $appliedPendingCount++;
}

// 3. Fetch Recent Notifications
$stmtNotifs = $db->prepare("SELECT * FROM tbl_notification WHERE student_id = ? ORDER BY created_at DESC LIMIT 4");
$stmtNotifs->execute([$student['student_id']]);
$recentNotifications = $stmtNotifs->fetchAll();

// 4. Calculate Profile Completeness (Deterministic check)
$completenessFields = ['full_name', 'email', 'dob', 'gender', 'category', 'annual_income', 'course', 'marks_percentage', 'state'];
$filledCount = 0;
foreach ($completenessFields as $f) {
    if (!empty($student[$f]) || (isset($student[$f]) && $student[$f] !== '')) $filledCount++;
}
$profileCompleteness = round(($filledCount / count($completenessFields)) * 100);

include __DIR__ . '/../includes/header.php';
?>

<main class="main-content">
    <div class="container">
        <!-- Dashboard Header -->
        <div class="dashboard-header" style="background: transparent; border: none; padding: 0; margin-bottom: 2rem;">
            <div class="dashboard-title-row">
                <div class="user-welcome">
                    <div class="user-avatar">
                        <?= strtoupper(substr($student['full_name'], 0, 1)) ?>
                    </div>
                    <div>
                        <h2 style="margin-bottom: 0.25rem;">Welcome back, <?= sanitize($student['full_name']) ?></h2>
                        <div class="text-sm text-secondary">
                            Student ID: <strong>#STU-<?= str_pad($student['student_id'], 4, '0', STR_PAD_LEFT) ?></strong> • <?= sanitize($student['course']) ?> • <?= sanitize($student['state']) ?>
                        </div>
                    </div>
                </div>
                <div style="display: flex; gap: 0.75rem;">
                    <a href="recommendations.php" class="btn btn-accent">★ View All Recommendations</a>
                    <a href="profile.php" class="btn btn-secondary">Update Profile</a>
                </div>
            </div>
        </div>

        <!-- Metrics Overview Grid -->
        <div class="metrics-grid">
            <div class="metric-card">
                <div class="metric-icon-box icon-box-gold">★</div>
                <div class="metric-info">
                    <div class="metric-value"><?= count($recommendedScholarships) ?></div>
                    <div class="metric-label">Recommended Grants</div>
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-icon-box icon-box-primary">📄</div>
                <div class="metric-info">
                    <div class="metric-value"><?= $totalApplied ?></div>
                    <div class="metric-label">Total Applications</div>
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-icon-box icon-box-amber">⏳</div>
                <div class="metric-info">
                    <div class="metric-value"><?= $underReviewCount ?></div>
                    <div class="metric-label">Under Review</div>
                </div>
            </div>

            <div class="metric-card">
                <div class="metric-icon-box icon-box-green">✓</div>
                <div class="metric-info">
                    <div class="metric-value"><?= $approvedCount ?></div>
                    <div class="metric-label">Approved Grants</div>
                </div>
            </div>
        </div>

        <!-- Main 2-Column Dashboard Body -->
        <div style="display: grid; grid-template-columns: 1fr 340px; gap: 2rem;">
            <!-- Left Column: Top Recommendations & Active Applications -->
            <div style="display: flex; flex-direction: column; gap: 2rem;">
                
                <!-- Section: Top Personalized Recommendations -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">Top Recommended For You</h3>
                        <a href="recommendations.php" class="text-sm font-semibold" style="color: var(--secondary);">Explore All (<?= count($recommendedScholarships) ?>) →</a>
                    </div>
                    <div class="card-body">
                        <?php if (!empty($recommendedScholarships)): ?>
                            <div style="display: flex; flex-direction: column; gap: 1rem;">
                                <?php foreach (array_slice($recommendedScholarships, 0, 3) as $rec): ?>
                                    <div style="background-color: var(--surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 1.25rem; display: flex; flex-direction: column; gap: 0.75rem;">
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem;">
                                            <div>
                                                <h4 style="font-size: 1.1rem; margin-bottom: 0.25rem;">
                                                    <a href="scholarship_details.php?id=<?= $rec['scholarship_id'] ?>" style="color: var(--primary);">
                                                        <?= sanitize($rec['title']) ?>
                                                    </a>
                                                </h4>
                                                <div class="text-xs text-muted"><?= sanitize($rec['provider']) ?></div>
                                            </div>
                                            <div style="text-align: right; flex-shrink: 0;">
                                                <span class="match-score-badge"><?= $rec['match']['match_score'] ?>% MATCH</span>
                                                <div style="font-family: var(--font-heading); font-size: 1.15rem; font-weight: 700; color: var(--primary); margin-top: 0.25rem;">
                                                    <?= formatCurrency($rec['amount']) ?>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Rule Match Summary Chips -->
                                        <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; font-size: 0.75rem;">
                                            <span class="badge badge-success">✓ <?= $student['category'] ?> Match</span>
                                            <span class="badge badge-success">✓ <?= $student['course'] ?> Match</span>
                                            <span class="badge badge-neutral">Deadline: <?= formatDate($rec['last_date']) ?></span>
                                        </div>

                                        <div style="display: flex; justify-content: flex-end; gap: 0.75rem; border-top: 1px solid var(--border-light); padding-top: 0.75rem;">
                                            <a href="scholarship_details.php?id=<?= $rec['scholarship_id'] ?>" class="btn btn-secondary btn-sm">Inspect Criteria</a>
                                            <a href="apply.php?id=<?= $rec['scholarship_id'] ?>" class="btn btn-primary btn-sm">Apply Now</a>
                                        </div>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        <?php else: ?>
                            <div class="empty-state">
                                <div class="empty-state-title">No direct recommendations found</div>
                                <p class="text-sm">Try updating your academic stream or income parameters to discover more matches.</p>
                                <a href="profile.php" class="btn btn-secondary btn-sm mt-2">Edit Profile</a>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>

                <!-- Section: Recent Application Status -->
                <div class="card">
                    <div class="card-header">
                        <h3 class="card-title">My Application Status</h3>
                        <a href="my_applications.php" class="text-sm font-semibold" style="color: var(--secondary);">View All Submissions →</a>
                    </div>
                    <div class="card-body">
                        <?php if (!empty($studentApplications)): ?>
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Scholarship</th>
                                            <th>Applied Date</th>
                                            <th>Award Amount</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach (array_slice($studentApplications, 0, 4) as $app): ?>
                                            <tr>
                                                <td>
                                                    <strong><?= sanitize($app['title']) ?></strong>
                                                    <div class="text-xs text-muted"><?= sanitize($app['provider']) ?></div>
                                                </td>
                                                <td><?= formatDate($app['applied_date']) ?></td>
                                                <td><strong><?= formatCurrency($app['amount']) ?></strong></td>
                                                <td>
                                                    <?php
                                                    $badgeStyle = 'badge-neutral';
                                                    if ($app['status'] === 'Approved') $badgeStyle = 'badge-success';
                                                    elseif ($app['status'] === 'Under Review') $badgeStyle = 'badge-warning';
                                                    elseif ($app['status'] === 'Rejected') $badgeStyle = 'badge-danger';
                                                    elseif ($app['status'] === 'Applied') $badgeStyle = 'badge-info';
                                                    ?>
                                                    <span class="badge <?= $badgeStyle ?>"><?= $app['status'] ?></span>
                                                </td>
                                                <td>
                                                    <a href="application_status.php?id=<?= $app['application_id'] ?>" class="btn btn-secondary btn-sm">Timeline</a>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php else: ?>
                            <div class="empty-state">
                                <div class="empty-state-title">You haven't submitted any applications yet</div>
                                <p class="text-sm">Explore recommended grants matching your profile and submit your documents.</p>
                                <a href="recommendations.php" class="btn btn-primary btn-sm mt-2">Find Eligible Scholarships</a>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            </div>

            <!-- Right Sidebar: Profile Snapshot, Completeness, Notifications -->
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">
                
                <!-- Profile Snapshot Card -->
                <div class="card">
                    <h4 class="card-title mb-2" style="font-size: 1.15rem;">Eligibility Profile</h4>
                    
                    <div style="margin-bottom: 1rem;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.8125rem; font-weight: 600;">
                            <span>Completeness</span>
                            <span><?= $profileCompleteness ?>%</span>
                        </div>
                        <div class="completeness-bar-container">
                            <div class="completeness-bar-fill" style="width: <?= $profileCompleteness ?>%;"></div>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.875rem; border-top: 1px solid var(--border-light); padding-top: 0.85rem;">
                        <div style="display: flex; justify-content: space-between;">
                            <span class="text-muted">Category:</span>
                            <strong><?= sanitize($student['category']) ?></strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span class="text-muted">Course:</span>
                            <strong><?= sanitize($student['course']) ?></strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span class="text-muted">Marks:</span>
                            <strong><?= sanitize($student['marks_percentage']) ?>%</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span class="text-muted">Annual Income:</span>
                            <strong><?= formatCurrency($student['annual_income']) ?></strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span class="text-muted">State:</span>
                            <strong><?= sanitize($student['state']) ?></strong>
                        </div>
                    </div>

                    <div class="mt-3">
                        <a href="profile.php" class="btn btn-secondary btn-sm btn-block">Edit Profile Parameters</a>
                    </div>
                </div>

                <!-- Recent In-App Alerts -->
                <div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem;">
                        <h4 class="card-title" style="font-size: 1.15rem; margin: 0;">Recent Alerts</h4>
                        <a href="notifications.php" class="text-xs font-semibold">View All</a>
                    </div>
                    
                    <?php if (!empty($recentNotifications)): ?>
                        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                            <?php foreach ($recentNotifications as $n): ?>
                                <div style="padding: 0.75rem; border-radius: var(--radius-sm); background-color: <?= $n['is_read'] ? 'var(--surface-subtle)' : 'var(--accent-subtle)' ?>; border-left: 3px solid <?= $n['is_read'] ? 'var(--border)' : 'var(--accent)' ?>;">
                                    <div style="font-size: 0.8125rem; font-weight: 700; color: var(--primary); margin-bottom: 0.2rem;">
                                        <?= sanitize($n['title']) ?>
                                    </div>
                                    <div style="font-size: 0.75rem; color: var(--text-secondary); line-height: 1.4;">
                                        <?= sanitize($n['message']) ?>
                                    </div>
                                    <div class="text-xs text-muted mt-1" style="font-size: 0.7rem;">
                                        <?= formatDate($n['created_at'], 'd M, H:i') ?>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php else: ?>
                        <div class="text-sm text-muted text-center py-2">You're all caught up!</div>
                    <?php endif; ?>
                </div>

            </div>
        </div>
    </div>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

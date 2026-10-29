<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Student Applications Management & Tracking List
 * File: student/my_applications.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

requireStudentAuth();

$pageTitle = "My Applications";
$baseUrl = "../";

$db = getDB();
$student = getLoggedInStudent($db);

$stmt = $db->prepare("
    SELECT a.*, s.title, s.provider, s.amount, s.last_date 
    FROM tbl_application a
    JOIN tbl_scholarship s ON a.scholarship_id = s.scholarship_id
    WHERE a.student_id = ?
    ORDER BY a.applied_date DESC
");
$stmt->execute([$student['student_id']]);
$applications = $stmt->fetchAll();

include __DIR__ . '/../includes/header.php';
?>

<main class="main-content">
    <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
            <div>
                <h2>My Scholarship Applications</h2>
                <p>Track submission statuses, verification timelines, and administrative remarks.</p>
            </div>
            <a href="recommendations.php" class="btn btn-primary">+ Discover More Scholarships</a>
        </div>

        <?php if (!empty($applications)): ?>
            <div class="card" style="padding: 0;">
                <div class="table-responsive" style="border: none;">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Application ID</th>
                                <th>Scholarship Opportunity</th>
                                <th>Award Amount</th>
                                <th>Submission Date</th>
                                <th>Current Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($applications as $app): ?>
                                <tr>
                                    <td>
                                        <strong style="color: var(--primary);">#APP-<?= str_pad($app['application_id'], 4, '0', STR_PAD_LEFT) ?></strong>
                                    </td>
                                    <td>
                                        <div style="font-weight: 600; color: var(--primary);">
                                            <?= sanitize($app['title']) ?>
                                        </div>
                                        <div class="text-xs text-muted"><?= sanitize($app['provider']) ?></div>
                                    </td>
                                    <td>
                                        <strong style="color: var(--secondary); font-family: var(--font-heading); font-size: 1.05rem;">
                                            <?= formatCurrency($app['amount']) ?>
                                        </strong>
                                    </td>
                                    <td><?= formatDate($app['applied_date']) ?></td>
                                    <td>
                                        <?php
                                        $badgeClass = 'badge-neutral';
                                        if ($app['status'] === 'Approved') $badgeClass = 'badge-success';
                                        elseif ($app['status'] === 'Under Review') $badgeClass = 'badge-warning';
                                        elseif ($app['status'] === 'Rejected') $badgeClass = 'badge-danger';
                                        elseif ($app['status'] === 'Applied') $badgeClass = 'badge-info';
                                        ?>
                                        <span class="badge <?= $badgeClass ?>"><?= $app['status'] ?></span>
                                    </td>
                                    <td>
                                        <a href="application_status.php?id=<?= $app['application_id'] ?>" class="btn btn-secondary btn-sm">
                                            View Timeline →
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            </div>
        <?php else: ?>
            <div class="empty-state">
                <div class="empty-state-icon">📄</div>
                <div class="empty-state-title">No applications submitted yet</div>
                <p class="text-sm mb-3">Browse recommendations curated to your academic profile and start applying today.</p>
                <a href="recommendations.php" class="btn btn-primary">Explore Recommended Grants</a>
            </div>
        <?php endif; ?>
    </div>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Application Status & Visual Progress Timeline
 * File: student/application_status.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

requireStudentAuth();

$applicationId = (int)($_GET['id'] ?? 0);
if ($applicationId <= 0) {
    header("Location: my_applications.php");
    exit;
}

$db = getDB();
$student = getLoggedInStudent($db);

// Fetch application with ownership validation (Strict IDOR protection)
$stmt = $db->prepare("
    SELECT a.*, s.title, s.provider, s.amount, s.last_date 
    FROM tbl_application a
    JOIN tbl_scholarship s ON a.scholarship_id = s.scholarship_id
    WHERE a.application_id = ? AND a.student_id = ?
");
$stmt->execute([$applicationId, $student['student_id']]);
$app = $stmt->fetch();

if (!$app) {
    die("Application not found or you are not authorized to view this dossier.");
}

// Fetch uploaded documents for this application
$stmtDocs = $db->prepare("SELECT * FROM tbl_documents WHERE application_id = ? ORDER BY uploaded_on ASC");
$stmtDocs->execute([$applicationId]);
$documents = $stmtDocs->fetchAll();

$pageTitle = "Application #APP-" . str_pad($app['application_id'], 4, '0', STR_PAD_LEFT);
$baseUrl = "../";

include __DIR__ . '/../includes/header.php';
?>

<main class="main-content">
    <div class="container container-narrow">
        <div style="margin-bottom: 1.5rem;">
            <a href="my_applications.php" class="btn btn-secondary btn-sm">← Back to My Applications</a>
        </div>

        <div class="card" style="padding: 2.5rem; margin-bottom: 2rem;">
            <div class="card-header" style="margin-bottom: 2rem;">
                <div>
                    <span class="badge badge-neutral mb-1">Dossier #APP-<?= str_pad($app['application_id'], 4, '0', STR_PAD_LEFT) ?></span>
                    <h2 style="font-size: 1.85rem; margin-bottom: 0.25rem;"><?= sanitize($app['title']) ?></h2>
                    <div class="text-sm text-secondary">
                        Provider: <?= sanitize($app['provider']) ?> • Award: <strong><?= formatCurrency($app['amount']) ?></strong>
                    </div>
                </div>
                <div>
                    <?php
                    $statusBadge = 'badge-info';
                    if ($app['status'] === 'Approved') $statusBadge = 'badge-success';
                    elseif ($app['status'] === 'Under Review') $statusBadge = 'badge-warning';
                    elseif ($app['status'] === 'Rejected') $statusBadge = 'badge-danger';
                    ?>
                    <span class="badge <?= $statusBadge ?>" style="font-size: 0.875rem; padding: 0.5rem 1rem;">
                        <?= $app['status'] ?>
                    </span>
                </div>
            </div>

            <!-- Visual Multi-Stage Timeline -->
            <div style="background-color: var(--surface-subtle); border-radius: var(--radius-md); padding: 2rem 1.5rem; margin-bottom: 2.5rem; border: 1px solid var(--border);">
                <div class="timeline">
                    <!-- Step 1: Applied -->
                    <div class="timeline-step completed">
                        <div class="timeline-node">✓</div>
                        <div class="timeline-label">Application<br>Submitted</div>
                    </div>

                    <!-- Step 2: Documents Verified -->
                    <div class="timeline-step <?= !empty($documents) ? 'completed' : 'active' ?>">
                        <div class="timeline-node">✓</div>
                        <div class="timeline-label">Documents<br>Uploaded</div>
                    </div>

                    <!-- Step 3: Under Review -->
                    <?php
                    $isReviewActive = ($app['status'] === 'Under Review');
                    $isReviewDone = ($app['status'] === 'Approved' || $app['status'] === 'Rejected');
                    ?>
                    <div class="timeline-step <?= $isReviewDone ? 'completed' : ($isReviewActive ? 'active' : '') ?>">
                        <div class="timeline-node"><?= $isReviewDone ? '✓' : '3' ?></div>
                        <div class="timeline-label">Under<br>Review</div>
                    </div>

                    <!-- Step 4: Decision -->
                    <?php
                    $isApproved = ($app['status'] === 'Approved');
                    $isRejected = ($app['status'] === 'Rejected');
                    ?>
                    <div class="timeline-step <?= $isApproved ? 'completed' : ($isRejected ? 'rejected' : '') ?>">
                        <div class="timeline-node"><?= $isApproved ? '✓' : ($isRejected ? '✕' : '4') ?></div>
                        <div class="timeline-label">Final<br>Decision</div>
                    </div>
                </div>
            </div>

            <!-- Admin Remarks / Review Banner -->
            <?php if (!empty($app['remarks'])): ?>
                <div style="background-color: <?= $app['status'] === 'Approved' ? 'var(--success-bg)' : ($app['status'] === 'Rejected' ? 'var(--danger-bg)' : 'var(--warning-bg)') ?>; border: 1px solid <?= $app['status'] === 'Approved' ? 'var(--success-border)' : ($app['status'] === 'Rejected' ? 'var(--danger-border)' : 'var(--warning-border)') ?>; border-radius: var(--radius-sm); padding: 1.25rem; margin-bottom: 2rem;">
                    <h5 style="color: var(--primary); margin-bottom: 0.35rem;">Administrative Auditor Remarks:</h5>
                    <p style="margin: 0; font-size: 0.9375rem; color: var(--text-primary);">
                        <?= nl2br(sanitize($app['remarks'])) ?>
                    </p>
                </div>
            <?php endif; ?>

            <!-- Uploaded Documents Attached -->
            <div style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 1rem; color: var(--primary);">Uploaded Supporting Documents</h4>
                <?php if (!empty($documents)): ?>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Document Type</th>
                                    <th>Original File Name</th>
                                    <th>File Size</th>
                                    <th>Uploaded On</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($documents as $doc): ?>
                                    <tr>
                                        <td><strong><?= sanitize($doc['document_type']) ?></strong></td>
                                        <td><?= sanitize($doc['original_filename']) ?></td>
                                        <td><?= $doc['file_size_kb'] ?> KB</td>
                                        <td><?= formatDate($doc['uploaded_on'], 'd M Y, H:i') ?></td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                <?php else: ?>
                    <div class="text-sm text-muted">No documents uploaded with this submission.</div>
                <?php endif; ?>
            </div>

            <!-- Metadata Info Row -->
            <div style="background-color: var(--surface-subtle); padding: 1rem; border-radius: var(--radius-sm); font-size: 0.8125rem; color: var(--text-secondary); display: flex; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem;">
                <div>Submitted on: <strong><?= formatDate($app['applied_date'], 'd M Y, H:i:s') ?></strong></div>
                <div>Last Updated: <strong><?= formatDate($app['updated_at'], 'd M Y, H:i:s') ?></strong></div>
            </div>
        </div>
    </div>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

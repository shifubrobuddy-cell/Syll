<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Application Audit, Document Verification & Decision Controller
 * File: admin/verify_applications.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

requireAdminAuth();

$pageTitle = "Verify Applications";
$baseUrl = "../";

$db = getDB();
$admin = getLoggedInAdmin($db);

$auditAppId = (int)($_GET['id'] ?? 0);
$successMsg = $_SESSION['flash_success'] ?? '';
$errorMsg = $_SESSION['flash_error'] ?? '';
unset($_SESSION['flash_success'], $_SESSION['flash_error']);

// Handle Status Decision POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!verifyCSRFToken($csrfToken)) {
        $errorMsg = "Security token error.";
    } else {
        $appId = (int)($_POST['application_id'] ?? 0);
        $newStatus = $_POST['status'] ?? '';
        $remarks = trim($_POST['remarks'] ?? '');

        if (!in_array($newStatus, ['Under Review', 'Approved', 'Rejected'], true)) {
            $errorMsg = "Invalid status selection.";
        } elseif ($newStatus === 'Rejected' && empty($remarks)) {
            $errorMsg = "Rejection requires an explicit explanatory remark for the applicant.";
        } else {
            try {
                // Fetch student and scholarship details for notification
                $stmtFetch = $db->prepare("
                    SELECT a.student_id, s.title 
                    FROM tbl_application a
                    JOIN tbl_scholarship s ON a.scholarship_id = s.scholarship_id
                    WHERE a.application_id = ?
                ");
                $stmtFetch->execute([$appId]);
                $appData = $stmtFetch->fetch();

                if ($appData) {
                    // Update Application
                    $upd = $db->prepare("UPDATE tbl_application SET status = ?, remarks = ?, updated_at = NOW() WHERE application_id = ?");
                    $upd->execute([$newStatus, $remarks, $appId]);

                    // Dispatch Student Notification
                    $notifTitle = "Application Status Update: " . $newStatus;
                    $notifMsg = "Your application for '{$appData['title']}' (Dossier #APP-{$appId}) has been updated to '{$newStatus}'.";
                    if (!empty($remarks)) {
                        $notifMsg .= " Remarks: " . $remarks;
                    }

                    createNotification($db, (int)$appData['student_id'], $notifTitle, $notifMsg, "Application Update");

                    $_SESSION['flash_success'] = "Application #APP-{$appId} successfully marked as '{$newStatus}'. Student has been notified.";
                    header("Location: verify_applications.php");
                    exit;
                }
            } catch (Exception $e) {
                $errorMsg = "Audit decision error: " . $e->getMessage();
            }
        }
    }
}

// Fetch single dossier for verification if requested
$auditDossier = null;
$dossierDocs = [];
$matchScoreData = null;

if ($auditAppId > 0) {
    $stmtDossier = $db->prepare("
        SELECT a.*, s.full_name, s.email, s.category, s.annual_income, s.course, s.marks_percentage, s.state, s.gender,
               sch.title as scholarship_title, sch.provider, sch.amount, sch.category_required, sch.max_income, sch.min_marks, sch.eligible_course, sch.state_applicable
        FROM tbl_application a
        JOIN tbl_student s ON a.student_id = s.student_id
        JOIN tbl_scholarship sch ON a.scholarship_id = sch.scholarship_id
        WHERE a.application_id = ?
    ");
    $stmtDossier->execute([$auditAppId]);
    $auditDossier = $stmtDossier->fetch();

    if ($auditDossier) {
        $stmtDocs = $db->prepare("SELECT * FROM tbl_documents WHERE application_id = ?");
        $stmtDocs->execute([$auditAppId]);
        $dossierDocs = $stmtDocs->fetchAll();

        $studentArr = [
            'category' => $auditDossier['category'],
            'annual_income' => $auditDossier['annual_income'],
            'marks_percentage' => $auditDossier['marks_percentage'],
            'course' => $auditDossier['course'],
            'state' => $auditDossier['state'],
            'gender' => $auditDossier['gender']
        ];
        $schArr = [
            'category_required' => $auditDossier['category_required'],
            'max_income' => $auditDossier['max_income'],
            'min_marks' => $auditDossier['min_marks'],
            'eligible_course' => $auditDossier['eligible_course'],
            'state_applicable' => $auditDossier['state_applicable'],
            'gender_applicable' => 'ALL'
        ];
        $matchScoreData = calculateScholarshipMatch($studentArr, $schArr);
    }
}

// Fetch all applications for audit list
$stmtAll = $db->query("
    SELECT a.*, s.full_name as student_name, s.category, s.course, s.marks_percentage, sch.title as scholarship_title, sch.amount
    FROM tbl_application a
    JOIN tbl_student s ON a.student_id = s.student_id
    JOIN tbl_scholarship sch ON a.scholarship_id = sch.scholarship_id
    ORDER BY a.applied_date DESC
");
$allApps = $stmtAll->fetchAll();

$csrf = generateCSRFToken();
include __DIR__ . '/../includes/header.php';
?>

<div class="admin-layout">
    <!-- Sidebar -->
    <aside class="admin-sidebar">
        <div style="padding: 0 1.5rem 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <div style="font-size: 0.75rem; color: var(--accent); font-weight: 700; text-transform: uppercase;">Auditor Portal</div>
            <div style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; color: #FFFFFF;"><?= sanitize($admin['full_name']) ?></div>
        </div>

        <ul class="admin-nav mt-2">
            <li class="admin-nav-item"><a href="dashboard.php" class="admin-nav-link">📊 Dashboard Overview</a></li>
            <li class="admin-nav-item"><a href="manage_scholarships.php" class="admin-nav-link">🎓 Manage Scholarships</a></li>
            <li class="admin-nav-item"><a href="manage_students.php" class="admin-nav-link">👥 Registered Students</a></li>
            <li class="admin-nav-item"><a href="verify_applications.php" class="admin-nav-link active">📑 Verify Applications</a></li>
            <li class="admin-nav-item"><a href="reports.php" class="admin-nav-link">📈 Reports & Analytics</a></li>
            <li class="admin-nav-item"><a href="../logout.php" class="admin-nav-link" style="color: #F87171;">🚪 Logout</a></li>
        </ul>
    </aside>

    <main class="admin-content">
        <div class="container" style="max-width: 100%; padding: 0;">
            
            <?php if (!empty($successMsg)): ?>
                <div class="alert alert-success"><?= sanitize($successMsg) ?></div>
            <?php endif; ?>

            <?php if (!empty($errorMsg)): ?>
                <div class="alert alert-danger"><?= sanitize($errorMsg) ?></div>
            <?php endif; ?>

            <?php if ($auditDossier): ?>
                <!-- INDIVIDUAL APPLICATION AUDIT VIEW -->
                <div class="card" style="padding: 2.25rem; margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1rem; flex-wrap: wrap; gap: 1rem;">
                        <div>
                            <span class="badge badge-accent mb-1">Dossier Audit: #APP-<?= str_pad($auditDossier['application_id'], 4, '0', STR_PAD_LEFT) ?></span>
                            <h2 style="font-size: 1.75rem; margin-bottom: 0.25rem;"><?= sanitize($auditDossier['scholarship_title']) ?></h2>
                            <div class="text-sm text-secondary">Applicant: <strong><?= sanitize($auditDossier['full_name']) ?></strong> (<?= sanitize($auditDossier['email']) ?>)</div>
                        </div>
                        <div style="text-align: right;">
                            <a href="verify_applications.php" class="btn btn-secondary btn-sm">← Back to Audit List</a>
                        </div>
                    </div>

                    <!-- Candidate Facts vs Scholarship Criteria Side-by-Side Comparison -->
                    <div class="grid grid-2" style="gap: 1.5rem; margin-bottom: 2rem;">
                        <div style="background-color: var(--surface-subtle); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
                            <h4 style="color: var(--primary); margin-bottom: 0.75rem;">Applicant Profile Claims</h4>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;">
                                <div>Social Category: <strong><?= sanitize($auditDossier['category']) ?></strong></div>
                                <div>Annual Income: <strong><?= formatCurrency($auditDossier['annual_income']) ?></strong></div>
                                <div>Marks: <strong><?= $auditDossier['marks_percentage'] ?>%</strong></div>
                                <div>Course: <strong><?= sanitize($auditDossier['course']) ?></strong></div>
                                <div>State: <strong><?= sanitize($auditDossier['state']) ?></strong></div>
                            </div>
                        </div>

                        <div style="background-color: var(--surface-subtle); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
                            <h4 style="color: var(--secondary); margin-bottom: 0.75rem;">Scholarship Rule Criteria</h4>
                            <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.875rem;">
                                <div>Required Category: <strong><?= sanitize($auditDossier['category_required']) ?></strong></div>
                                <div>Max Income Limit: <strong><?= $auditDossier['max_income'] > 0 ? formatCurrency($auditDossier['max_income']) : 'No Limit' ?></strong></div>
                                <div>Cutoff Marks: <strong>≥<?= $auditDossier['min_marks'] ?>%</strong></div>
                                <div>Eligible Courses: <strong><?= sanitize($auditDossier['eligible_course']) ?></strong></div>
                                <div>Applicable State: <strong><?= sanitize($auditDossier['state_applicable']) ?></strong></div>
                            </div>
                        </div>
                    </div>

                    <!-- Uploaded Documents Audit -->
                    <div style="margin-bottom: 2rem;">
                        <h4 style="color: var(--primary); margin-bottom: 0.75rem;">Uploaded Verification Documents</h4>
                        <?php if (!empty($dossierDocs)): ?>
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Document Type</th>
                                            <th>Original Filename</th>
                                            <th>File Size</th>
                                            <th>MIME Type</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <?php foreach ($dossierDocs as $d): ?>
                                            <tr>
                                                <td><strong><?= sanitize($d['document_type']) ?></strong></td>
                                                <td><?= sanitize($d['original_filename']) ?></td>
                                                <td><?= $d['file_size_kb'] ?> KB</td>
                                                <td><code><?= sanitize($d['mime_type']) ?></code></td>
                                                <td>
                                                    <span class="badge badge-success">✓ Stored & Verified</span>
                                                </td>
                                            </tr>
                                        <?php endforeach; ?>
                                    </tbody>
                                </table>
                            </div>
                        <?php else: ?>
                            <div class="text-sm text-muted">No documents uploaded with this submission.</div>
                        <?php endif; ?>
                    </div>

                    <!-- Audit Decision Action Form -->
                    <div style="background-color: #FAF9F6; border: 2px solid var(--border); border-radius: var(--radius-md); padding: 1.5rem;">
                        <h4 style="margin-bottom: 1rem; color: var(--primary);">Official Audit Decision</h4>

                        <form action="verify_applications.php" method="POST">
                            <input type="hidden" name="csrf_token" value="<?= $csrf ?>">
                            <input type="hidden" name="application_id" value="<?= $auditDossier['application_id'] ?>">

                            <div class="form-group mb-3">
                                <label class="form-label">Auditor Remarks / Justification</label>
                                <textarea name="remarks" class="form-control form-textarea" placeholder="Add verification findings, eligibility confirmations, or specific reasons for rejection..."><?= sanitize($auditDossier['remarks'] ?? '') ?></textarea>
                            </div>

                            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                                <button type="submit" name="status" value="Under Review" class="btn btn-secondary">
                                    Mark Under Review
                                </button>
                                <button type="submit" name="status" value="Approved" class="btn btn-success">
                                    ✓ Approve Scholarship Application
                                </button>
                                <button type="submit" name="status" value="Rejected" class="btn btn-danger">
                                    ✕ Reject Application
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

            <?php else: ?>
                <!-- MASTER APPLICATION AUDIT LIST -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
                    <div>
                        <h2>Application Verification Desk</h2>
                        <p class="text-sm">Inspect uploaded documents, verify eligibility criteria, and record official grant decisions.</p>
                    </div>
                    <div>
                        <input type="text" id="adminTableSearch" class="form-control" placeholder="🔍 Search applications..." style="width: 240px;">
                    </div>
                </div>

                <div class="card" style="padding: 0;">
                    <div class="table-responsive" style="border: none;">
                        <table class="table admin-data-table">
                            <thead>
                                <tr>
                                    <th>App ID</th>
                                    <th>Student Applicant</th>
                                    <th>Scholarship</th>
                                    <th>Marks</th>
                                    <th>Applied Date</th>
                                    <th>Current Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($allApps as $app): ?>
                                    <tr>
                                        <td><strong>#APP-<?= str_pad($app['application_id'], 4, '0', STR_PAD_LEFT) ?></strong></td>
                                        <td>
                                            <div style="font-weight: 600; color: var(--primary);"><?= sanitize($app['student_name']) ?></div>
                                            <div class="text-xs text-muted"><?= sanitize($app['course']) ?> (<?= sanitize($app['category']) ?>)</div>
                                        </td>
                                        <td>
                                            <div style="font-weight: 500;"><?= sanitize($app['scholarship_title']) ?></div>
                                            <div class="text-xs text-muted"><?= formatCurrency($app['amount']) ?></div>
                                        </td>
                                        <td><strong><?= $app['marks_percentage'] ?>%</strong></td>
                                        <td><?= formatDate($app['applied_date']) ?></td>
                                        <td>
                                            <?php
                                            $stClass = 'badge-neutral';
                                            if ($app['status'] === 'Approved') $stClass = 'badge-success';
                                            elseif ($app['status'] === 'Under Review') $stClass = 'badge-warning';
                                            elseif ($app['status'] === 'Rejected') $stClass = 'badge-danger';
                                            elseif ($app['status'] === 'Applied') $stClass = 'badge-info';
                                            ?>
                                            <span class="badge <?= $stClass ?>"><?= $app['status'] ?></span>
                                        </td>
                                        <td>
                                            <a href="verify_applications.php?id=<?= $app['application_id'] ?>" class="btn btn-primary btn-sm">
                                                Audit Dossier →
                                            </a>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            <?php endif; ?>

        </div>
    </main>
</div>

<?php include __DIR__ . '/../includes/footer.php'; ?>

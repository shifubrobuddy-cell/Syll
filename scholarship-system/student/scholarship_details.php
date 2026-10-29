<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Scholarship Comprehensive Details & Transparent Eligibility Breakdown
 * File: student/scholarship_details.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

$scholarshipId = (int)($_GET['id'] ?? 0);
if ($scholarshipId <= 0) {
    header("Location: scholarships.php");
    exit;
}

$db = getDB();
$stmt = $db->prepare("SELECT * FROM tbl_scholarship WHERE scholarship_id = ?");
$stmt->execute([$scholarshipId]);
$scholarship = $stmt->fetch();

if (!$scholarship) {
    die("Scholarship record not found.");
}

$pageTitle = $scholarship['title'];
$baseUrl = "../";

$student = isStudentLoggedIn() ? getLoggedInStudent($db) : null;
$matchResult = $student ? calculateScholarshipMatch($student, $scholarship) : null;

// Check existing application status
$existingApp = null;
if ($student) {
    $stmtChk = $db->prepare("SELECT * FROM tbl_application WHERE student_id = ? AND scholarship_id = ?");
    $stmtChk->execute([$student['student_id'], $scholarshipId]);
    $existingApp = $stmtChk->fetch();
}

include __DIR__ . '/../includes/header.php';
?>

<main class="main-content">
    <div class="container container-narrow">
        <div style="margin-bottom: 1.5rem;">
            <a href="scholarships.php" class="btn btn-secondary btn-sm">← Back to Catalog</a>
        </div>

        <div class="card" style="padding: 2.5rem; margin-bottom: 2rem;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--border-light); flex-wrap: wrap;">
                <div>
                    <span class="badge badge-accent mb-1"><?= sanitize($scholarship['category_required']) ?> Category</span>
                    <h2 style="font-size: 2rem; margin-bottom: 0.35rem; color: var(--primary);">
                        <?= sanitize($scholarship['title']) ?>
                    </h2>
                    <div style="font-size: 1rem; color: var(--secondary); font-weight: 600;">
                        Provider: <?= sanitize($scholarship['provider']) ?>
                    </div>
                </div>
                <div style="text-align: right; background-color: var(--surface-subtle); padding: 1rem 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--border);">
                    <div class="text-xs text-muted font-semibold uppercase">Grant Amount</div>
                    <div style="font-family: var(--font-heading); font-size: 2rem; font-weight: 700; color: var(--primary);">
                        <?= formatCurrency($scholarship['amount']) ?>
                    </div>
                    <div class="text-xs text-muted">Deadline: <?= formatDate($scholarship['last_date']) ?></div>
                </div>
            </div>

            <!-- Description -->
            <div style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem;">Scholarship Overview</h4>
                <p style="font-size: 1rem; line-height: 1.7;"><?= nl2br(sanitize($scholarship['description'])) ?></p>
            </div>

            <!-- Eligibility Rules Specifications Table -->
            <div style="margin-bottom: 2rem;">
                <h4 style="margin-bottom: 0.75rem;">Official Eligibility Criteria</h4>
                <div class="table-responsive">
                    <table class="table">
                        <tbody>
                            <tr>
                                <th style="width: 35%;">Required Social Category</th>
                                <td><strong><?= sanitize($scholarship['category_required']) ?></strong></td>
                            </tr>
                            <tr>
                                <th>Annual Family Income Limit</th>
                                <td>
                                    <strong>
                                        <?= $scholarship['max_income'] > 0 ? 'Maximum ' . formatCurrency($scholarship['max_income']) : 'No Income Ceiling' ?>
                                    </strong>
                                </td>
                            </tr>
                            <tr>
                                <th>Academic Cutoff Marks</th>
                                <td>
                                    <strong>
                                        <?= $scholarship['min_marks'] > 0 ? 'Minimum ' . $scholarship['min_marks'] . '% marks required' : 'Open / Passing Grade' ?>
                                    </strong>
                                </td>
                            </tr>
                            <tr>
                                <th>Eligible Courses</th>
                                <td><strong><?= sanitize($scholarship['eligible_course']) ?></strong></td>
                            </tr>
                            <tr>
                                <th>Applicable State Domicile</th>
                                <td><strong><?= sanitize($scholarship['state_applicable']) ?></strong></td>
                            </tr>
                            <tr>
                                <th>Applicable Gender</th>
                                <td><strong><?= sanitize($scholarship['gender_applicable']) ?></strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- RULE-BASED MATCH BREAKDOWN CARD FOR LOGGED IN STUDENTS -->
            <?php if ($student && $matchResult): ?>
                <div style="background-color: var(--surface-subtle); border: 2px solid <?= $matchResult['is_eligible'] ? 'var(--success-border)' : 'var(--border)' ?>; border-radius: var(--radius-md); padding: 1.75rem; margin-bottom: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                        <h4 style="margin: 0; color: var(--primary);">Your Rule-Based Eligibility Evaluation</h4>
                        <span class="match-score-badge"><?= $matchResult['match_score'] ?>% MATCH</span>
                    </div>

                    <?php if ($matchResult['is_eligible']): ?>
                        <div class="alert alert-success" style="margin-bottom: 1rem;">
                            <strong>✓ YOU ARE FULLY ELIGIBLE:</strong> Your student credentials satisfy all official eligibility requirements for this grant.
                        </div>
                    <?php else: ?>
                        <div class="alert alert-warning" style="margin-bottom: 1rem;">
                            <strong>⚠ NOT DIRECTLY ELIGIBLE:</strong> One or more criteria did not match your current student profile. Review details below.
                        </div>
                    <?php endif; ?>

                    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                        <?php foreach ($matchResult['breakdown'] as $crit): ?>
                            <div class="criteria-item <?= $crit['status'] ? 'valid' : 'invalid' ?>">
                                <span class="criteria-icon"><?= $crit['status'] ? '✓' : '✕' ?></span>
                                <div style="flex: 1;">
                                    <strong><?= $crit['label'] ?>:</strong> <?= sanitize($crit['reason']) ?>
                                </div>
                                <span style="font-weight: 700; font-size: 0.8125rem;">+<?= $crit['points'] ?> pts</span>
                            </div>
                        <?php endforeach; ?>
                    </div>
                </div>

                <!-- Call to action button -->
                <div style="text-align: center;">
                    <?php if ($existingApp): ?>
                        <div class="alert alert-info">
                            You have already submitted an application for this scholarship on <?= formatDate($existingApp['applied_date']) ?>. Current status: <strong><?= $existingApp['status'] ?></strong>.
                        </div>
                        <a href="application_status.php?id=<?= $existingApp['application_id'] ?>" class="btn btn-primary btn-lg">Track Application Status →</a>
                    <?php elseif ($matchResult['is_eligible']): ?>
                        <a href="apply.php?id=<?= $scholarship['scholarship_id'] ?>" class="btn btn-primary btn-lg" style="padding: 1rem 2.5rem; font-size: 1.15rem;">
                            APPLY NOW FOR THIS SCHOLARSHIP
                        </a>
                    <?php else: ?>
                        <a href="apply.php?id=<?= $scholarship['scholarship_id'] ?>" class="btn btn-secondary btn-lg">
                            Proceed to Apply with Current Credentials
                        </a>
                    <?php endif; ?>
                </div>

            <?php elseif (!$student): ?>
                <div class="alert alert-info text-center" style="margin: 0;">
                    Please <a href="../login.php" style="font-weight: bold; text-decoration: underline;">Sign In as a Student</a> to calculate your personalized eligibility match score and apply.
                </div>
            <?php endif; ?>
        </div>
    </div>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

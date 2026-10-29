<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Dedicated Recommendation Showcase & Explainable Match View
 * File: student/recommendations.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

requireStudentAuth();

$pageTitle = "Scholarships Recommended For You";
$baseUrl = "../";

$db = getDB();
$student = getLoggedInStudent($db);

// Fetch all active scholarships
$stmt = $db->query("SELECT * FROM tbl_scholarship WHERE status = 'Active' ORDER BY last_date ASC");
$allScholarships = $stmt->fetchAll();

// Calculate match score for each scholarship
$recommendations = [];
foreach ($allScholarships as $sch) {
    $match = calculateScholarshipMatch($student, $sch);
    $recommendations[] = array_merge($sch, ['match' => $match]);
}

// Sort by match score descending, then by award amount descending
usort($recommendations, function($a, $b) {
    if ($b['match']['match_score'] === $a['match']['match_score']) {
        return $b['amount'] <=> $a['amount'];
    }
    return $b['match']['match_score'] <=> $a['match']['match_score'];
});

include __DIR__ . '/../includes/header.php';
?>

<main class="main-content">
    <div class="container">
        <!-- Header Banner -->
        <div style="background-color: var(--primary); color: #FFFFFF; padding: 2.5rem; border-radius: var(--radius-md); margin-bottom: 2.5rem; position: relative;">
            <div style="max-width: 720px;">
                <span style="background-color: var(--accent); color: var(--primary-dark); font-size: 0.75rem; font-weight: 700; padding: 0.25rem 0.75rem; border-radius: var(--radius-pill); text-transform: uppercase; letter-spacing: 0.08em; display: inline-block; margin-bottom: 0.75rem;">
                    Rule-Based Recommendation Engine
                </span>
                <h1 style="color: #FFFFFF; font-size: 2.35rem; margin-bottom: 0.75rem;">
                    Scholarships Recommended For You
                </h1>
                <p style="color: #CBD5E1; font-size: 1rem; margin-bottom: 1.25rem; line-height: 1.6;">
                    Every active scholarship is mathematically compared against your profile parameters (<strong><?= sanitize($student['course']) ?></strong>, <strong><?= sanitize($student['category']) ?></strong>, <strong><?= sanitize($student['marks_percentage']) ?>%</strong> marks, <strong><?= formatCurrency($student['annual_income']) ?></strong> income, <strong><?= sanitize($student['state']) ?></strong> domicile).
                </p>
                <a href="profile.php" class="btn btn-accent btn-sm">Edit Eligibility Parameters</a>
            </div>
        </div>

        <!-- Recommendations Grid -->
        <div style="display: flex; flex-direction: column; gap: 1.75rem;">
            <?php foreach ($recommendations as $rec): ?>
                <?php $m = $rec['match']; ?>
                <div class="card" style="border-left: 4px solid <?= $m['is_eligible'] ? 'var(--success)' : 'var(--accent)' ?>; padding: 2rem;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; flex-wrap: wrap;">
                        <div style="flex: 1; min-width: 280px;">
                            <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.5rem; flex-wrap: wrap;">
                                <span class="match-score-badge" style="font-size: 1rem; padding: 0.4rem 0.85rem;">
                                    <?= $m['match_score'] ?>% MATCH
                                </span>
                                <span class="badge <?= $m['badge_class'] ?>">
                                    <?= $m['rank_tier'] ?>
                                </span>
                                <span class="badge badge-neutral">
                                    Deadline: <?= formatDate($rec['last_date']) ?>
                                </span>
                            </div>

                            <h3 style="margin-bottom: 0.35rem; font-size: 1.45rem;">
                                <a href="scholarship_details.php?id=<?= $rec['scholarship_id'] ?>" style="color: var(--primary);">
                                    <?= sanitize($rec['title']) ?>
                                </a>
                            </h3>
                            <div class="text-sm text-secondary font-semibold mb-2">
                                <?= sanitize($rec['provider']) ?>
                            </div>
                            <p class="text-sm" style="margin-bottom: 1.25rem;">
                                <?= sanitize($rec['description']) ?>
                            </p>
                        </div>

                        <!-- Amount Box -->
                        <div style="text-align: right; background-color: var(--surface-subtle); padding: 1.25rem 1.75rem; border-radius: var(--radius-md); border: 1px solid var(--border); min-width: 200px;">
                            <div class="text-xs text-muted font-semibold uppercase">Grant Amount</div>
                            <div style="font-family: var(--font-heading); font-size: 1.85rem; font-weight: 700; color: var(--primary); margin: 0.25rem 0;">
                                <?= formatCurrency($rec['amount']) ?>
                            </div>
                            <a href="apply.php?id=<?= $rec['scholarship_id'] ?>" class="btn btn-primary btn-sm btn-block mt-2">
                                <?= $m['is_eligible'] ? 'Apply Now' : 'Inspect & Apply' ?>
                            </a>
                        </div>
                    </div>

                    <!-- Why It Matches Section (Criteria Checklist) -->
                    <div style="margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--border-light);">
                        <h6 style="color: var(--secondary); margin-bottom: 0.75rem; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.08em;">
                            Algorithm Criteria Verification Breakdown
                        </h6>
                        <div class="grid grid-2" style="gap: 0.65rem;">
                            <?php foreach ($m['breakdown'] as $critKey => $crit): ?>
                                <div class="criteria-item <?= $crit['status'] ? 'valid' : 'invalid' ?>" style="margin: 0;">
                                    <span class="criteria-icon"><?= $crit['status'] ? '✓' : '✕' ?></span>
                                    <div style="flex: 1; font-size: 0.8125rem;">
                                        <strong><?= $crit['label'] ?>:</strong> <?= sanitize($crit['reason']) ?>
                                    </div>
                                    <span style="font-size: 0.75rem; font-weight: 700;">+<?= $crit['points'] ?> pts</span>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

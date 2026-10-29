<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Scholarship Catalog & Interactive Search/Filter
 * File: student/scholarships.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

$pageTitle = "Browse All Scholarships";
$baseUrl = "../";

$db = getDB();
$student = isStudentLoggedIn() ? getLoggedInStudent($db) : null;

// Query all active scholarships from MySQL
$stmt = $db->query("SELECT * FROM tbl_scholarship WHERE status = 'Active' ORDER BY last_date ASC");
$scholarships = $stmt->fetchAll();

include __DIR__ . '/../includes/header.php';
?>

<main class="main-content">
    <div class="container">
        <!-- Catalog Header & Search Controls -->
        <div style="margin-bottom: 2rem;">
            <h2>Scholarship Directory</h2>
            <p>Explore all active state, national, and merit funding schemes.</p>

            <div class="card" style="padding: 1.25rem; margin-top: 1rem;">
                <div class="grid grid-3" style="gap: 1rem; align-items: flex-end;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="scholarshipSearchInput" class="form-label">Search by Title or Provider</label>
                        <div class="search-wrapper">
                            <span class="search-icon">🔍</span>
                            <input type="text" id="scholarshipSearchInput" class="form-control search-input" placeholder="e.g. Post-Matric, AICTE, Tech Foundation...">
                        </div>
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="categoryFilter" class="form-label">Filter by Category</label>
                        <select id="categoryFilter" class="form-select">
                            <option value="ALL">All Categories</option>
                            <option value="General">General</option>
                            <option value="OBC">OBC</option>
                            <option value="SC">SC</option>
                            <option value="ST">ST</option>
                            <option value="EWS">EWS</option>
                            <option value="Minority">Minority</option>
                        </select>
                    </div>

                    <div class="form-group" style="margin-bottom: 0;">
                        <label for="courseFilter" class="form-label">Filter by Course Stream</label>
                        <select id="courseFilter" class="form-select">
                            <option value="ALL">All Academic Streams</option>
                            <option value="BCA">BCA</option>
                            <option value="B.Tech Computer Science">B.Tech Computer Science</option>
                            <option value="B.Sc Information Technology">B.Sc IT</option>
                            <option value="B.Tech Electrical">B.Tech Electrical</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Scholarships Grid -->
        <div class="grid grid-3" id="scholarshipListGrid">
            <?php foreach ($scholarships as $sch): ?>
                <?php 
                $match = $student ? calculateScholarshipMatch($student, $sch) : null;
                ?>
                <div class="card card-interactive scholarship-card-item" 
                     data-title="<?= sanitize($sch['title']) ?>" 
                     data-provider="<?= sanitize($sch['provider']) ?>"
                     data-category="<?= sanitize($sch['category_required']) ?>"
                     data-course="<?= sanitize($sch['eligible_course']) ?>"
                     style="display: flex; flex-direction: column;">
                    
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem; gap: 0.5rem;">
                        <span class="badge badge-accent"><?= sanitize($sch['category_required']) ?> Category</span>
                        <?php if ($match): ?>
                            <span class="badge <?= $match['badge_class'] ?>"><?= $match['match_score'] ?>% Match</span>
                        <?php endif; ?>
                    </div>

                    <h4 style="font-size: 1.15rem; margin-bottom: 0.35rem;">
                        <a href="scholarship_details.php?id=<?= $sch['scholarship_id'] ?>" style="color: var(--primary);">
                            <?= sanitize($sch['title']) ?>
                        </a>
                    </h4>

                    <div class="text-xs text-muted mb-2 font-semibold"><?= sanitize($sch['provider']) ?></div>

                    <p class="text-sm" style="flex: 1; margin-bottom: 1.25rem;">
                        <?= sanitize(substr($sch['description'], 0, 110)) ?>...
                    </p>

                    <div style="background-color: var(--surface-subtle); padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 1rem; font-size: 0.8125rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.25rem;">
                            <span class="text-muted">Award Amount:</span>
                            <strong style="color: var(--primary);"><?= formatCurrency($sch['amount']) ?></strong>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span class="text-muted">Min Marks:</span>
                            <strong><?= $sch['min_marks'] > 0 ? $sch['min_marks'] . '%' : 'Open' ?></strong>
                        </div>
                    </div>

                    <div class="card-footer" style="padding-top: 0.85rem; margin-top: auto;">
                        <div class="text-xs text-muted">
                            Deadline: <strong><?= formatDate($sch['last_date']) ?></strong>
                        </div>
                        <a href="scholarship_details.php?id=<?= $sch['scholarship_id'] ?>" class="btn btn-primary btn-sm">View Details</a>
                    </div>
                </div>
            <?php endforeach; ?>
        </div>
    </div>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

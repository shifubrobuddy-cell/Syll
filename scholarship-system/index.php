<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Institutional Landing Page
 * File: index.php
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';

$pageTitle = "Find Scholarships That Find You";
$baseUrl = "";

// Fetch active featured scholarships dynamically from database
$featuredScholarships = [];
try {
    $db = getDB();
    $stmt = $db->query("SELECT * FROM tbl_scholarship WHERE status = 'Active' ORDER BY amount DESC LIMIT 3");
    $featuredScholarships = $stmt->fetchAll();
} catch (Exception $e) {
    $featuredScholarships = [];
}

include __DIR__ . '/includes/header.php';
?>

<!-- =========================================================================
     1. HERO SECTION (With Pure HTML/CSS Engine Roadmap Illustration)
     ========================================================================= -->
<section style="background: linear-gradient(180deg, var(--surface) 0%, var(--background) 100%); padding: 4.5rem 0 3.5rem; border-bottom: 1px solid var(--border);">
    <div class="container">
        <div style="display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 3.5rem; align-items: center;">
            <div>
                <div style="display: inline-flex; align-items: center; gap: 0.5rem; background-color: var(--accent-subtle); color: #8C6A1B; padding: 0.35rem 0.85rem; border-radius: var(--radius-pill); font-size: 0.8125rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 1.25rem;">
                    ★ Scholarship Discovery Platform
                </div>
                <h1 style="margin-bottom: 1.25rem; color: var(--primary); font-size: 3.25rem;">
                    Find Scholarships.<br><span style="color: var(--secondary); font-style: italic;">That Find You.</span>
                </h1>
                <p style="font-size: 1.125rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 2rem;">
                    Discover verified funding opportunities matched precisely to your academic course, category, family income, and state domicile. Transparent rule-based evaluation with real-time tracking.
                </p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <a href="register.php" class="btn btn-primary btn-lg">FIND MY SCHOLARSHIPS</a>
                    <a href="student/scholarships.php" class="btn btn-secondary btn-lg">EXPLORE SCHOLARSHIPS</a>
                </div>
            </div>

            <!-- Custom HTML/CSS Product Illustration (Zero Stock Images) -->
            <div style="background-color: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); padding: 1.75rem; box-shadow: var(--shadow-lg); position: relative;">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.25rem; padding-bottom: 0.75rem; border-bottom: 1px solid var(--border-light);">
                    <span style="font-size: 0.8125rem; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em;">Automated Matching Pipeline</span>
                    <span class="badge badge-success">Active Engine</span>
                </div>

                <!-- Pipeline Stages -->
                <div style="display: flex; flex-direction: column; gap: 0.85rem;">
                    <div style="background-color: var(--surface-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border-left: 3px solid var(--primary);">
                        <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">STEP 01: STUDENT PROFILE</div>
                        <div style="font-size: 0.875rem; font-weight: 600; color: var(--primary);">BCA • OBC • Marks: 84.5% • Maharashtra</div>
                    </div>

                    <div style="display: flex; justify-content: center; color: var(--accent); font-weight: bold;">↓</div>

                    <div style="background-color: var(--surface-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border-left: 3px solid var(--secondary);">
                        <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">STEP 02: RULE-BASED MATCHING</div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span style="font-size: 0.875rem; font-weight: 600; color: var(--primary);">5/5 Criteria Satisfied</span>
                            <span class="match-score-badge" style="font-size: 0.75rem; padding: 0.25rem 0.5rem;">100% MATCH</span>
                        </div>
                    </div>

                    <div style="display: flex; justify-content: center; color: var(--accent); font-weight: bold;">↓</div>

                    <div style="background-color: var(--accent-subtle); padding: 0.75rem 1rem; border-radius: var(--radius-sm); border: 1px solid rgba(214,179,106,0.3);">
                        <div style="font-size: 0.75rem; color: #8C6A1B; font-weight: 700;">STEP 03: RECOMMENDED AWARD</div>
                        <div style="font-size: 0.9375rem; font-weight: 700; color: var(--primary);">Post-Matric Backward Classes Grant (₹50,000)</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- =========================================================================
     2. HOW IT WORKS SECTION
     ========================================================================= -->
<section id="how-it-works" style="padding: 4.5rem 0; background-color: var(--surface); border-bottom: 1px solid var(--border);">
    <div class="container">
        <div class="text-center" style="max-width: 680px; margin: 0 auto 3.5rem;">
            <h2 style="margin-bottom: 0.75rem;">How The Recommendation Engine Works</h2>
            <p>Our rule-based matching architecture evaluates your exact academic and financial credentials directly against verified scholarship parameters.</p>
        </div>

        <div class="grid grid-4" style="gap: 1.5rem;">
            <div class="card" style="border-top: 3px solid var(--primary);">
                <div style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--accent); font-weight: 700; margin-bottom: 0.5rem;">01</div>
                <h4 style="margin-bottom: 0.5rem;">Create Profile</h4>
                <p class="text-sm">Register with your current course, verified percentage, annual income, social category, and state of domicile.</p>
            </div>

            <div class="card" style="border-top: 3px solid var(--secondary);">
                <div style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--accent); font-weight: 700; margin-bottom: 0.5rem;">02</div>
                <h4 style="margin-bottom: 0.5rem;">Match Eligibility</h4>
                <p class="text-sm">Our multi-criteria algorithm evaluates active opportunities with mathematical transparency and zero guesswork.</p>
            </div>

            <div class="card" style="border-top: 3px solid var(--accent);">
                <div style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--accent); font-weight: 700; margin-bottom: 0.5rem;">03</div>
                <h4 style="margin-bottom: 0.5rem;">Discover Ranked Grants</h4>
                <p class="text-sm">View personalized recommendations with breakdown checklists detailing exactly why you qualify for each award.</p>
            </div>

            <div class="card" style="border-top: 3px solid var(--success);">
                <div style="font-family: var(--font-heading); font-size: 1.5rem; color: var(--accent); font-weight: 700; margin-bottom: 0.5rem;">04</div>
                <h4 style="margin-bottom: 0.5rem;">Apply & Track</h4>
                <p class="text-sm">Upload verified certificates and track application status from submission to final administrative approval.</p>
            </div>
        </div>
    </div>
</section>

<!-- =========================================================================
     3. FEATURED SCHOLARSHIPS (Dynamic from MySQL)
     ========================================================================= -->
<section style="padding: 4.5rem 0; background-color: var(--background);">
    <div class="container">
        <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 2.5rem; flex-wrap: wrap; gap: 1rem;">
            <div>
                <h2>Featured Opportunities</h2>
                <p style="margin-bottom: 0;">Explore high-value financial endowments currently open for submissions.</p>
            </div>
            <a href="student/scholarships.php" class="btn btn-outline-primary">View Full Catalog →</a>
        </div>

        <div class="grid grid-3" style="gap: 1.5rem;">
            <?php if (!empty($featuredScholarships)): ?>
                <?php foreach ($featuredScholarships as $sch): ?>
                    <div class="card card-interactive" style="display: flex; flex-direction: column;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
                            <span class="badge badge-accent"><?= sanitize($sch['category_required']) ?> Category</span>
                            <span style="font-family: var(--font-heading); font-size: 1.35rem; font-weight: 700; color: var(--primary);">
                                <?= formatCurrency($sch['amount']) ?>
                            </span>
                        </div>
                        <h4 style="margin-bottom: 0.5rem; font-size: 1.15rem;">
                            <a href="student/scholarship_details.php?id=<?= $sch['scholarship_id'] ?>"><?= sanitize($sch['title']) ?></a>
                        </h4>
                        <div class="text-sm text-muted mb-2" style="font-weight: 500;">
                            <?= sanitize($sch['provider']) ?>
                        </div>
                        <p class="text-sm" style="flex: 1; margin-bottom: 1.25rem;">
                            <?= sanitize(substr($sch['description'], 0, 110)) ?>...
                        </p>
                        <div class="card-footer" style="padding-top: 0.85rem; margin-top: auto;">
                            <div class="text-xs text-muted">
                                Deadline: <strong style="color: var(--primary);"><?= formatDate($sch['last_date']) ?></strong>
                            </div>
                            <a href="student/scholarship_details.php?id=<?= $sch['scholarship_id'] ?>" class="btn btn-primary btn-sm">View Details</a>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php else: ?>
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-title">No scholarships currently listed.</div>
                </div>
            <?php endif; ?>
        </div>
    </div>
</section>

<!-- =========================================================================
     4. FINAL CALL TO ACTION
     ========================================================================= -->
<section style="background-color: var(--primary); color: #FFFFFF; padding: 4.5rem 0; text-align: center;">
    <div class="container container-narrow">
        <h2 style="color: #FFFFFF; font-size: 2.5rem; margin-bottom: 1rem;">Start Finding Scholarships Today</h2>
        <p style="color: #CBD5E1; font-size: 1.125rem; margin: 0 auto 2rem; max-width: 600px;">
            Join students unlocking education grants with transparent rule-based eligibility evaluation.
        </p>
        <a href="register.php" class="btn btn-accent btn-lg">GET STARTED FOR FREE</a>
    </div>
</section>

<?php include __DIR__ . '/includes/footer.php'; ?>

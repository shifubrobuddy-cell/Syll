<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Scholarship Catalog CRUD & Rule Configuration
 * File: admin/manage_scholarships.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

requireAdminAuth();

$pageTitle = "Manage Scholarships";
$baseUrl = "../";

$db = getDB();
$admin = getLoggedInAdmin($db);

$action = $_GET['action'] ?? 'list';
$editId = (int)($_GET['id'] ?? 0);
$successMsg = "";
$errorMsg = "";

// 1. Handle Delete Action
if ($action === 'delete' && $editId > 0) {
    try {
        $del = $db->prepare("DELETE FROM tbl_scholarship WHERE scholarship_id = ?");
        $del->execute([$editId]);
        $_SESSION['flash_success'] = "Scholarship deleted successfully.";
        header("Location: manage_scholarships.php");
        exit;
    } catch (Exception $e) {
        $errorMsg = "Cannot delete scholarship as submissions are attached to it.";
        $action = 'list';
    }
}

// 2. Handle Add / Edit Submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!verifyCSRFToken($csrfToken)) {
        $errorMsg = "Security token validation failed.";
    } else {
        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $provider = trim($_POST['provider'] ?? '');
        $amount = (float)($_POST['amount'] ?? 0);
        $category = trim($_POST['category_required'] ?? 'ALL');
        $maxIncome = (float)($_POST['max_income'] ?? 0);
        $minMarks = (float)($_POST['min_marks'] ?? 0);
        $course = trim($_POST['eligible_course'] ?? 'ALL');
        $state = trim($_POST['state_applicable'] ?? 'ALL');
        $gender = $_POST['gender_applicable'] ?? 'ALL';
        $lastDate = $_POST['last_date'] ?? '';
        $status = $_POST['status'] ?? 'Active';

        if (empty($title) || empty($description) || empty($provider) || empty($lastDate)) {
            $errorMsg = "Please fill in all mandatory scholarship fields.";
        } else {
            try {
                if ($editId > 0) {
                    // Update
                    $stmt = $db->prepare("
                        UPDATE tbl_scholarship 
                        SET title = ?, description = ?, provider = ?, amount = ?, category_required = ?, max_income = ?, min_marks = ?, eligible_course = ?, state_applicable = ?, gender_applicable = ?, last_date = ?, status = ?
                        WHERE scholarship_id = ?
                    ");
                    $stmt->execute([$title, $description, $provider, $amount, $category, $maxIncome, $minMarks, $course, $state, $gender, $lastDate, $status, $editId]);
                    $successMsg = "Scholarship updated successfully.";
                    $action = 'list';
                } else {
                    // Insert
                    $stmt = $db->prepare("
                        INSERT INTO tbl_scholarship 
                        (title, description, provider, amount, category_required, max_income, min_marks, eligible_course, state_applicable, gender_applicable, last_date, status, created_at)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
                    ");
                    $stmt->execute([$title, $description, $provider, $amount, $category, $maxIncome, $minMarks, $course, $state, $gender, $lastDate, $status]);
                    $successMsg = "New scholarship added to catalog.";
                    $action = 'list';
                }
            } catch (Exception $e) {
                $errorMsg = "Database error: " . $e->getMessage();
            }
        }
    }
}

// Fetch single record if editing
$editItem = null;
if ($action === 'edit' && $editId > 0) {
    $stmt = $db->prepare("SELECT * FROM tbl_scholarship WHERE scholarship_id = ?");
    $stmt->execute([$editId]);
    $editItem = $stmt->fetch();
}

// Fetch all scholarships for listing
$stmtAll = $db->query("SELECT * FROM tbl_scholarship ORDER BY created_at DESC");
$scholarships = $stmtAll->fetchAll();

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
            <li class="admin-nav-item"><a href="manage_scholarships.php" class="admin-nav-link active">🎓 Manage Scholarships</a></li>
            <li class="admin-nav-item"><a href="manage_students.php" class="admin-nav-link">👥 Registered Students</a></li>
            <li class="admin-nav-item"><a href="verify_applications.php" class="admin-nav-link">📑 Verify Applications</a></li>
            <li class="admin-nav-item"><a href="reports.php" class="admin-nav-link">📈 Reports & Analytics</a></li>
            <li class="admin-nav-item"><a href="../logout.php" class="admin-nav-link" style="color: #F87171;">🚪 Logout</a></li>
        </ul>
    </aside>

    <!-- Main Content -->
    <main class="admin-content">
        <div class="container" style="max-width: 100%; padding: 0;">
            
            <?php if (!empty($successMsg)): ?>
                <div class="alert alert-success"><?= sanitize($successMsg) ?></div>
            <?php endif; ?>

            <?php if (!empty($errorMsg)): ?>
                <div class="alert alert-danger"><?= sanitize($errorMsg) ?></div>
            <?php endif; ?>

            <?php if ($action === 'create' || $action === 'edit'): ?>
                <!-- FORM VIEW (ADD / EDIT) -->
                <div class="card" style="padding: 2.25rem;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; border-bottom: 1px solid var(--border-light); padding-bottom: 1rem;">
                        <h3><?= $action === 'edit' ? 'Edit Scholarship Criteria' : 'Define New Scholarship' ?></h3>
                        <a href="manage_scholarships.php" class="btn btn-secondary btn-sm">Cancel</a>
                    </div>

                    <form action="manage_scholarships.php?action=<?= $action ?>&id=<?= $editId ?>" method="POST">
                        <input type="hidden" name="csrf_token" value="<?= $csrf ?>">

                        <div class="grid grid-2">
                            <div class="form-group">
                                <label class="form-label">Scholarship Title <span class="required">*</span></label>
                                <input type="text" name="title" class="form-control" value="<?= sanitize($editItem['title'] ?? '') ?>" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Provider Organization <span class="required">*</span></label>
                                <input type="text" name="provider" class="form-control" value="<?= sanitize($editItem['provider'] ?? '') ?>" required>
                            </div>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Description & Scope <span class="required">*</span></label>
                            <textarea name="description" class="form-control form-textarea" required><?= sanitize($editItem['description'] ?? '') ?></textarea>
                        </div>

                        <div class="grid grid-3">
                            <div class="form-group">
                                <label class="form-label">Grant Amount (₹) <span class="required">*</span></label>
                                <input type="number" name="amount" class="form-control" value="<?= $editItem['amount'] ?? 50000 ?>" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Application Deadline <span class="required">*</span></label>
                                <input type="date" name="last_date" class="form-control" value="<?= $editItem['last_date'] ?? '' ?>" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Status</label>
                                <select name="status" class="form-select">
                                    <option value="Active" <?= ($editItem['status'] ?? '') === 'Active' ? 'selected' : '' ?>>Active</option>
                                    <option value="Inactive" <?= ($editItem['status'] ?? '') === 'Inactive' ? 'selected' : '' ?>>Inactive</option>
                                </select>
                            </div>
                        </div>

                        <h4 style="margin: 1.5rem 0 1rem; color: var(--secondary); border-top: 1px solid var(--border-light); padding-top: 1rem;">
                            Rule-Based Eligibility Parameters
                        </h4>

                        <div class="grid grid-3">
                            <div class="form-group">
                                <label class="form-label">Category Requirement</label>
                                <input type="text" name="category_required" class="form-control" value="<?= sanitize($editItem['category_required'] ?? 'ALL') ?>" placeholder="ALL or OBC,SC,ST">
                                <div class="input-help">Use 'ALL' or comma-separated categories</div>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Max Family Income (₹)</label>
                                <input type="number" name="max_income" class="form-control" value="<?= $editItem['max_income'] ?? 0 ?>" placeholder="0 for no restriction">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Min Marks Cutoff (%)</label>
                                <input type="number" name="min_marks" class="form-control" value="<?= $editItem['min_marks'] ?? 0 ?>" step="0.1">
                            </div>
                        </div>

                        <div class="grid grid-3">
                            <div class="form-group">
                                <label class="form-label">Eligible Courses</label>
                                <input type="text" name="eligible_course" class="form-control" value="<?= sanitize($editItem['eligible_course'] ?? 'ALL') ?>" placeholder="ALL or BCA,B.Tech Computer Science">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Applicable State</label>
                                <input type="text" name="state_applicable" class="form-control" value="<?= sanitize($editItem['state_applicable'] ?? 'ALL') ?>" placeholder="ALL or Maharashtra">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Gender Restriction</label>
                                <select name="gender_applicable" class="form-select">
                                    <option value="ALL" <?= ($editItem['gender_applicable'] ?? '') === 'ALL' ? 'selected' : '' ?>>All Genders</option>
                                    <option value="Female" <?= ($editItem['gender_applicable'] ?? '') === 'Female' ? 'selected' : '' ?>>Female Only</option>
                                    <option value="Male" <?= ($editItem['gender_applicable'] ?? '') === 'Male' ? 'selected' : '' ?>>Male Only</option>
                                </select>
                            </div>
                        </div>

                        <div class="mt-4">
                            <button type="submit" class="btn btn-primary btn-lg">Save Scholarship Criteria</button>
                        </div>
                    </form>
                </div>

            <?php else: ?>
                <!-- LIST VIEW -->
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                    <div>
                        <h2>Catalog Management</h2>
                        <p class="text-sm">Manage eligibility rules, deadlines, and active visibility.</p>
                    </div>
                    <a href="manage_scholarships.php?action=create" class="btn btn-primary">+ Add New Scholarship</a>
                </div>

                <div class="card" style="padding: 0;">
                    <div class="table-responsive" style="border: none;">
                        <table class="table admin-data-table">
                            <thead>
                                <tr>
                                    <th>Title & Provider</th>
                                    <th>Amount</th>
                                    <th>Eligibility Summary</th>
                                    <th>Deadline</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php foreach ($scholarships as $s): ?>
                                    <tr>
                                        <td>
                                            <strong><?= sanitize($s['title']) ?></strong>
                                            <div class="text-xs text-muted"><?= sanitize($s['provider']) ?></div>
                                        </td>
                                        <td><strong><?= formatCurrency($s['amount']) ?></strong></td>
                                        <td class="text-xs">
                                            Cat: <strong><?= sanitize($s['category_required']) ?></strong> | 
                                            Marks: <strong>≥<?= $s['min_marks'] ?>%</strong> | 
                                            Course: <strong><?= sanitize($s['eligible_course']) ?></strong>
                                        </td>
                                        <td><?= formatDate($s['last_date']) ?></td>
                                        <td>
                                            <span class="badge <?= $s['status'] === 'Active' ? 'badge-success' : 'badge-neutral' ?>">
                                                <?= $s['status'] ?>
                                            </span>
                                        </td>
                                        <td>
                                            <div style="display: flex; gap: 0.5rem;">
                                                <a href="manage_scholarships.php?action=edit&id=<?= $s['scholarship_id'] ?>" class="btn btn-secondary btn-sm">Edit</a>
                                                <a href="manage_scholarships.php?action=delete&id=<?= $s['scholarship_id'] ?>" class="btn btn-danger btn-sm" onclick="return confirm('Delete this scholarship?');">Delete</a>
                                            </div>
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

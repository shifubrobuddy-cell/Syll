<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Student In-App Notifications & Alerts Center
 * File: student/notifications.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

requireStudentAuth();

$pageTitle = "Notifications";
$baseUrl = "../";

$db = getDB();
$student = getLoggedInStudent($db);

// Handle Mark All Read action
if (isset($_POST['mark_all_read'])) {
    $upd = $db->prepare("UPDATE tbl_notification SET is_read = 1 WHERE student_id = ?");
    $upd->execute([$student['student_id']]);
    header("Location: notifications.php");
    exit;
}

$stmt = $db->prepare("SELECT * FROM tbl_notification WHERE student_id = ? ORDER BY created_at DESC");
$stmt->execute([$student['student_id']]);
$notifications = $stmt->fetchAll();

include __DIR__ . '/../includes/header.php';
?>

<main class="main-content">
    <div class="container container-narrow">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
            <div>
                <h2>In-App Alerts & Notifications</h2>
                <p>System recommendations, verification updates, and department notes.</p>
            </div>
            <?php if (!empty($notifications)): ?>
                <form action="notifications.php" method="POST">
                    <button type="submit" name="mark_all_read" value="1" class="btn btn-secondary btn-sm">
                        ✓ Mark All as Read
                    </button>
                </form>
            <?php endif; ?>
        </div>

        <?php if (!empty($notifications)): ?>
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <?php foreach ($notifications as $n): ?>
                    <div class="card" style="padding: 1.25rem; background-color: <?= $n['is_read'] ? 'var(--surface)' : 'var(--accent-subtle)' ?>; border-left: 4px solid <?= $n['is_read'] ? 'var(--border)' : 'var(--accent)' ?>;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; margin-bottom: 0.35rem;">
                            <div style="display: flex; align-items: center; gap: 0.5rem;">
                                <span class="badge <?= $n['is_read'] ? 'badge-neutral' : 'badge-accent' ?>">
                                    <?= sanitize($n['type']) ?>
                                </span>
                                <h4 style="font-size: 1.05rem; margin: 0; color: var(--primary);">
                                    <?= sanitize($n['title']) ?>
                                </h4>
                            </div>
                            <span class="text-xs text-muted" style="white-space: nowrap;">
                                <?= formatDate($n['created_at'], 'd M Y, H:i') ?>
                            </span>
                        </div>
                        <p style="font-size: 0.9375rem; color: var(--text-secondary); margin: 0; line-height: 1.5;">
                            <?= nl2br(sanitize($n['message'])) ?>
                        </p>
                    </div>
                <?php endforeach; ?>
            </div>
        <?php else: ?>
            <div class="empty-state">
                <div class="empty-state-icon">🔔</div>
                <div class="empty-state-title">You're all caught up</div>
                <p class="text-sm">No notifications currently pending in your inbox.</p>
            </div>
        <?php endif; ?>
    </div>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

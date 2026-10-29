<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Scholarship Application Submission & Secure Document Uploader
 * File: student/apply.php
 */

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

requireStudentAuth();

$scholarshipId = (int)($_GET['id'] ?? 0);
if ($scholarshipId <= 0) {
    header("Location: scholarships.php");
    exit;
}

$db = getDB();
$student = getLoggedInStudent($db);

// Fetch scholarship
$stmtSch = $db->prepare("SELECT * FROM tbl_scholarship WHERE scholarship_id = ? AND status = 'Active'");
$stmtSch->execute([$scholarshipId]);
$scholarship = $stmtSch->fetch();

if (!$scholarship) {
    die("Scholarship not found or no longer active.");
}

// Check for duplicate application
$stmtCheck = $db->prepare("SELECT * FROM tbl_application WHERE student_id = ? AND scholarship_id = ?");
$stmtCheck->execute([$student['student_id'], $scholarshipId]);
$existingApp = $stmtCheck->fetch();

if ($existingApp) {
    header("Location: application_status.php?id=" . $existingApp['application_id']);
    exit;
}

$pageTitle = "Apply: " . $scholarship['title'];
$baseUrl = "../";
$errorMsg = "";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $csrfToken = $_POST['csrf_token'] ?? '';
    if (!verifyCSRFToken($csrfToken)) {
        $errorMsg = "Security token mismatch. Please re-submit.";
    } elseif (empty($_POST['declaration_confirmed'])) {
        $errorMsg = "You must confirm the truthfulness declaration before submitting.";
    } else {
        // Document upload processing
        $uploadDir = __DIR__ . '/../uploads/documents/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        $allowedExts = ['pdf', 'jpg', 'jpeg', 'png'];

        try {
            $db->beginTransaction();

            // 1. Create Application Record
            $insApp = $db->prepare("
                INSERT INTO tbl_application (student_id, scholarship_id, applied_date, status, remarks)
                VALUES (?, ?, NOW(), 'Applied', NULL)
            ");
            $insApp->execute([$student['student_id'], $scholarshipId]);
            $applicationId = (int)$db->lastInsertId();

            // 2. Handle File Uploads (Marksheet, Income Certificate, ID Proof)
            $docTypes = [
                'marksheet' => 'Marksheet',
                'income_certificate' => 'Income Certificate',
                'id_proof' => 'ID Proof'
            ];

            foreach ($docTypes as $inputKey => $docTypeName) {
                if (isset($_FILES[$inputKey]) && $_FILES[$inputKey]['error'] === UPLOAD_ERR_OK) {
                    $fileTmp = $_FILES[$inputKey]['tmp_name'];
                    $fileName = $_FILES[$inputKey]['name'];
                    $fileSize = $_FILES[$inputKey]['size'];
                    $fileExt = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

                    // MIME validation using finfo
                    $finfo = finfo_open(FILEINFO_MIME_TYPE);
                    $mimeType = finfo_file($finfo, $fileTmp);
                    finfo_close($finfo);

                    if (!in_array($mimeType, $allowedTypes, true) || !in_array($fileExt, $allowedExts, true)) {
                        throw new Exception("Invalid file type for {$docTypeName}. Only PDF, JPG, and PNG are allowed.");
                    }

                    if ($fileSize > 5 * 1024 * 1024) {
                        throw new Exception("File for {$docTypeName} exceeds maximum 5MB limit.");
                    }

                    // Generate secure randomized filename
                    $storedName = 'DOC_' . $applicationId . '_' . strtoupper(str_replace(' ', '_', $docTypeName)) . '_' . bin2hex(random_bytes(6)) . '.' . $fileExt;
                    $targetPath = $uploadDir . $storedName;
                    $relativeDbPath = 'uploads/documents/' . $storedName;

                    if (move_uploaded_file($fileTmp, $targetPath)) {
                        $insDoc = $db->prepare("
                            INSERT INTO tbl_documents (application_id, document_type, original_filename, stored_filename, file_path, file_size_kb, mime_type, uploaded_on)
                            VALUES (?, ?, ?, ?, ?, ?, ?, NOW())
                        ");
                        $insDoc->execute([
                            $applicationId,
                            $docTypeName,
                            $fileName,
                            $storedName,
                            $relativeDbPath,
                            round($fileSize / 1024),
                            $mimeType
                        ]);
                    } else {
                        throw new Exception("Failed to move uploaded document: {$docTypeName}");
                    }
                }
            }

            // 3. Dispatch Notification
            createNotification(
                $db,
                $student['student_id'],
                "Application Submitted Successfully",
                "Your application for '{$scholarship['title']}' has been received and is registered under Application #APP-{$applicationId}.",
                "Application Update"
            );

            $db->commit();

            $_SESSION['flash_success'] = "Your scholarship application has been successfully submitted!";
            header("Location: application_status.php?id=" . $applicationId);
            exit;

        } catch (Exception $e) {
            $db->rollBack();
            $errorMsg = "Submission Error: " . $e->getMessage();
        }
    }
}

$match = calculateScholarshipMatch($student, $scholarship);
$csrf = generateCSRFToken();
include __DIR__ . '/../includes/header.php';
?>

<main class="main-content">
    <div class="container container-narrow">
        <div style="margin-bottom: 1.5rem;">
            <a href="scholarship_details.php?id=<?= $scholarshipId ?>" class="btn btn-secondary btn-sm">← Back to Scholarship Details</a>
        </div>

        <div class="card" style="padding: 2.5rem;">
            <div class="card-header" style="margin-bottom: 2rem;">
                <div>
                    <span class="badge badge-accent mb-1">Scholarship Application Dossier</span>
                    <h2 style="font-size: 1.85rem; margin-bottom: 0.25rem;"><?= sanitize($scholarship['title']) ?></h2>
                    <div class="text-sm text-secondary">Provider: <?= sanitize($scholarship['provider']) ?> • Award: <strong><?= formatCurrency($scholarship['amount']) ?></strong></div>
                </div>
                <div class="match-score-badge"><?= $match['match_score'] ?>% MATCH</div>
            </div>

            <?php if (!empty($errorMsg)): ?>
                <div class="alert alert-danger"><?= sanitize($errorMsg) ?></div>
            <?php endif; ?>

            <form action="apply.php?id=<?= $scholarshipId ?>" method="POST" enctype="multipart/form-data" id="scholarshipApplyForm">
                <input type="hidden" name="csrf_token" value="<?= $csrf ?>">

                <!-- 1. Pre-filled Profile Verification -->
                <h4 style="margin-bottom: 1rem; color: var(--primary);">1. Verified Student Profile</h4>
                <div style="background-color: var(--surface-subtle); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 1.25rem; margin-bottom: 2rem;">
                    <div class="grid grid-3" style="font-size: 0.875rem; gap: 1rem;">
                        <div>
                            <span class="text-muted">Applicant Name:</span><br>
                            <strong><?= sanitize($student['full_name']) ?></strong>
                        </div>
                        <div>
                            <span class="text-muted">Social Category:</span><br>
                            <strong><?= sanitize($student['category']) ?></strong>
                        </div>
                        <div>
                            <span class="text-muted">Current Course:</span><br>
                            <strong><?= sanitize($student['course']) ?></strong>
                        </div>
                        <div>
                            <span class="text-muted">Marks Percentage:</span><br>
                            <strong><?= sanitize($student['marks_percentage']) ?>%</strong>
                        </div>
                        <div>
                            <span class="text-muted">Annual Income:</span><br>
                            <strong><?= formatCurrency($student['annual_income']) ?></strong>
                        </div>
                        <div>
                            <span class="text-muted">Home Domicile:</span><br>
                            <strong><?= sanitize($student['state']) ?></strong>
                        </div>
                    </div>
                    <div class="mt-2 text-xs text-muted" style="border-top: 1px solid var(--border-light); padding-top: 0.5rem;">
                        To modify any of these values, please update your <a href="profile.php" style="color: var(--secondary); font-weight: 600;">Student Profile</a> before applying.
                    </div>
                </div>

                <!-- 2. Required Supporting Documents Upload -->
                <h4 style="margin-bottom: 0.5rem; color: var(--primary);">2. Upload Required Documents</h4>
                <p class="text-sm mb-3">Upload clear, legible copies (PDF, JPG, PNG - Maximum 5MB each).</p>

                <div style="display: flex; flex-direction: column; gap: 1.25rem; margin-bottom: 2rem;">
                    <!-- Marksheet -->
                    <div class="form-group">
                        <label class="form-label">Academic Marksheet / Transcript <span class="required">*</span></label>
                        <input type="file" id="marksheetFile" name="marksheet" accept=".pdf,.jpg,.jpeg,.png" style="display: none;" required>
                        <div class="file-dropzone" data-target="marksheetFile">
                            <div class="dropzone-icon">📄</div>
                            <div class="dropzone-text">Click or drag & drop Marksheet here</div>
                            <div class="dropzone-subtext">PDF, JPG, or PNG up to 5MB</div>
                        </div>
                    </div>

                    <!-- Income Certificate -->
                    <div class="form-group">
                        <label class="form-label">Income Certificate / ITR Acknowledgement <span class="required">*</span></label>
                        <input type="file" id="incomeFile" name="income_certificate" accept=".pdf,.jpg,.jpeg,.png" style="display: none;" required>
                        <div class="file-dropzone" data-target="incomeFile">
                            <div class="dropzone-icon">📜</div>
                            <div class="dropzone-text">Click or drag & drop Income Certificate</div>
                            <div class="dropzone-subtext">Must be issued within current financial year</div>
                        </div>
                    </div>

                    <!-- Identity Proof -->
                    <div class="form-group">
                        <label class="form-label">Government ID Proof (Aadhaar / Voter ID / College ID) <span class="required">*</span></label>
                        <input type="file" id="idProofFile" name="id_proof" accept=".pdf,.jpg,.jpeg,.png" style="display: none;" required>
                        <div class="file-dropzone" data-target="idProofFile">
                            <div class="dropzone-icon">🪪</div>
                            <div class="dropzone-text">Click or drag & drop Government Photo ID</div>
                            <div class="dropzone-subtext">PDF, JPG, or PNG format</div>
                        </div>
                    </div>
                </div>

                <!-- 3. Legal Declaration Checkbox -->
                <div class="form-check" style="background-color: var(--surface-subtle); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border); margin-bottom: 2rem;">
                    <input type="checkbox" id="declaration_confirmed" name="declaration_confirmed" value="1" required>
                    <label for="declaration_confirmed" style="font-size: 0.875rem; color: var(--text-primary); cursor: pointer;">
                        I hereby declare that all academic marks, income statements, and uploaded credentials provided are true and accurate. Any false representation may lead to immediate disqualification.
                    </label>
                </div>

                <div style="display: flex; gap: 1rem;">
                    <button type="submit" class="btn btn-primary btn-lg btn-block" style="font-size: 1.1rem; padding: 1rem;">
                        Submit Official Application Dossier
                    </button>
                </div>
            </form>
        </div>
    </div>
</main>

<?php include __DIR__ . '/../includes/footer.php'; ?>

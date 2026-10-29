<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Dynamic Data Export Engine (Real CSV & JSON Stream)
 * File: export.php
 */

require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/includes/auth.php';
require_once __DIR__ . '/includes/functions.php';

requireAdminAuth();

$type = $_GET['type'] ?? 'applications_csv';
$db = getDB();

if ($type === 'applications_csv') {
    // Generate Real CSV
    $stmt = $db->query("
        SELECT a.application_id, s.full_name as student_name, s.email as student_email, s.category, s.course, s.marks_percentage,
               sch.title as scholarship_title, sch.amount, a.applied_date, a.status, a.remarks
        FROM tbl_application a
        JOIN tbl_student s ON a.student_id = s.student_id
        JOIN tbl_scholarship sch ON a.scholarship_id = sch.scholarship_id
        ORDER BY a.applied_date DESC
    ");
    $rows = $stmt->fetchAll();

    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="scholarship_applications_' . date('Y-m-d_His') . '.csv"');

    $output = fopen('php://output', 'w');
    // Output headers
    fputcsv($output, ['Application ID', 'Student Name', 'Student Email', 'Category', 'Course', 'Marks %', 'Scholarship Title', 'Amount (INR)', 'Applied Date', 'Status', 'Remarks']);

    foreach ($rows as $row) {
        fputcsv($output, [
            'APP-' . str_pad($row['application_id'], 4, '0', STR_PAD_LEFT),
            $row['student_name'],
            $row['student_email'],
            $row['category'],
            $row['course'],
            $row['marks_percentage'],
            $row['scholarship_title'],
            $row['amount'],
            $row['applied_date'],
            $row['status'],
            $row['remarks'] ?? ''
        ]);
    }
    fclose($output);
    exit;

} elseif ($type === 'applications_json') {
    // Generate Real JSON
    $stmt = $db->query("
        SELECT a.application_id, s.full_name as student_name, s.email as student_email, s.category, s.course, s.marks_percentage,
               sch.title as scholarship_title, sch.amount, a.applied_date, a.status, a.remarks
        FROM tbl_application a
        JOIN tbl_student s ON a.student_id = s.student_id
        JOIN tbl_scholarship sch ON a.scholarship_id = sch.scholarship_id
        ORDER BY a.applied_date DESC
    ");
    $rows = $stmt->fetchAll();

    header('Content-Type: application/json; charset=utf-8');
    header('Content-Disposition: attachment; filename="scholarship_applications_' . date('Y-m-d_His') . '.json"');

    echo json_encode([
        'system' => 'Scholarship Recommendation System',
        'export_timestamp' => date('c'),
        'total_records' => count($rows),
        'data' => $rows
    ], JSON_PRETTY_PRINT);
    exit;
} else {
    die("Invalid export format requested.");
}
?>

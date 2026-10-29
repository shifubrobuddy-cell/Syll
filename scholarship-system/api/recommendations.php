<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Recommendation Engine JSON API Endpoint
 * File: api/recommendations.php
 */

header('Content-Type: application/json');

require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../includes/auth.php';
require_once __DIR__ . '/../includes/functions.php';

if (!isStudentLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

$db = getDB();
$student = getLoggedInStudent($db);

$stmt = $db->query("SELECT * FROM tbl_scholarship WHERE status = 'Active' ORDER BY last_date ASC");
$allScholarships = $stmt->fetchAll();

$results = [];
foreach ($allScholarships as $sch) {
    $match = calculateScholarshipMatch($student, $sch);
    $results[] = [
        'scholarship_id' => $sch['scholarship_id'],
        'title' => $sch['title'],
        'provider' => $sch['provider'],
        'amount' => (float)$sch['amount'],
        'last_date' => $sch['last_date'],
        'match_score' => $match['match_score'],
        'is_eligible' => $match['is_eligible'],
        'rank_tier' => $match['rank_tier'],
        'breakdown' => $match['breakdown']
    ];
}

echo json_encode([
    'status' => 'success',
    'student' => [
        'name' => $student['full_name'],
        'course' => $student['course'],
        'category' => $student['category']
    ],
    'recommendations' => $results
]);
?>

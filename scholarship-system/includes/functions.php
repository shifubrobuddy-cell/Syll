<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Core Business Logic, Rule-Based Recommendation Engine & Helpers
 * File: includes/functions.php
 */

/**
 * Sanitize output for HTML context (prevent XSS)
 */
function sanitize(?string $data): string {
    return htmlspecialchars(trim((string)$data), ENT_QUOTES, 'UTF-8');
}

/**
 * Format currency into standard Indian Rupee presentation (e.g. ₹50,000)
 */
function formatCurrency(float|int|string $amount): string {
    return '₹' . number_format((float)$amount, 0, '.', ',');
}

/**
 * Format date for clean UI display
 */
function formatDate(?string $dateStr, string $format = 'd M Y'): string {
    if (empty($dateStr)) return 'N/A';
    return date($format, strtotime($dateStr));
}

/**
 * RULE-BASED RECOMMENDATION ENGINE
 * 
 * Evaluates a student profile against scholarship criteria.
 * Mathematical Score Distribution (Max: 100%):
 * - Category Match (20 pts): 'ALL' or exact match in list
 * - Income Requirement (20 pts): Max income is 0.00 (open) or student_income <= max_income
 * - Academic Marks (20 pts): student_marks >= min_marks (or 10 pts if within 5%)
 * - Course Eligibility (20 pts): 'ALL' or student_course in allowed courses
 * - State Domicile (20 pts): 'ALL' or student_state matches
 * 
 * Returns detailed scoring and transparent criteria breakdown.
 */
function calculateScholarshipMatch(array $student, array $scholarship): array {
    $score = 0;
    $breakdown = [];
    $isEligible = true;

    // 1. Category Check (Weight: 20%)
    $reqCategory = trim((string)($scholarship['category_required'] ?? 'ALL'));
    $studentCategory = trim((string)($student['category'] ?? ''));
    
    if (strtoupper($reqCategory) === 'ALL') {
        $score += 20;
        $breakdown['category'] = [
            'status' => true,
            'label' => 'Category',
            'points' => 20,
            'reason' => 'Open to all categories (Student: ' . $studentCategory . ')'
        ];
    } else {
        $allowedCategories = array_map('trim', explode(',', $reqCategory));
        if (in_array($studentCategory, $allowedCategories, true)) {
            $score += 20;
            $breakdown['category'] = [
                'status' => true,
                'label' => 'Category',
                'points' => 20,
                'reason' => 'Matches required category: ' . $studentCategory
            ];
        } else {
            $isEligible = false;
            $breakdown['category'] = [
                'status' => false,
                'label' => 'Category',
                'points' => 0,
                'reason' => 'Requires ' . $reqCategory . ' (Student is ' . $studentCategory . ')'
            ];
        }
    }

    // 2. Income Requirement (Weight: 20%)
    $maxIncome = (float)($scholarship['max_income'] ?? 0);
    $studentIncome = (float)($student['annual_income'] ?? 0);

    if ($maxIncome <= 0) {
        $score += 20;
        $breakdown['income'] = [
            'status' => true,
            'label' => 'Annual Income',
            'points' => 20,
            'reason' => 'No income ceiling restriction'
        ];
    } else {
        if ($studentIncome <= $maxIncome) {
            $score += 20;
            $breakdown['income'] = [
                'status' => true,
                'label' => 'Annual Income',
                'points' => 20,
                'reason' => 'Income (' . formatCurrency($studentIncome) . ') within maximum limit (' . formatCurrency($maxIncome) . ')'
            ];
        } else {
            $isEligible = false;
            $breakdown['income'] = [
                'status' => false,
                'label' => 'Annual Income',
                'points' => 0,
                'reason' => 'Income (' . formatCurrency($studentIncome) . ') exceeds ceiling (' . formatCurrency($maxIncome) . ')'
            ];
        }
    }

    // 3. Academic Marks (Weight: 20%)
    $minMarks = (float)($scholarship['min_marks'] ?? 0);
    $studentMarks = (float)($student['marks_percentage'] ?? 0);

    if ($studentMarks >= $minMarks) {
        $score += 20;
        $breakdown['marks'] = [
            'status' => true,
            'label' => 'Academic Marks',
            'points' => 20,
            'reason' => 'Marks (' . $studentMarks . '%) meet/exceed requirement (' . $minMarks . '%)'
        ];
    } elseif ($studentMarks >= ($minMarks - 5)) {
        // Partial points for near-match
        $score += 10;
        $isEligible = false;
        $breakdown['marks'] = [
            'status' => false,
            'label' => 'Academic Marks',
            'points' => 10,
            'reason' => 'Marks (' . $studentMarks . '%) slightly below minimum requirement (' . $minMarks . '%)'
        ];
    } else {
        $isEligible = false;
        $breakdown['marks'] = [
            'status' => false,
            'label' => 'Academic Marks',
            'points' => 0,
            'reason' => 'Marks (' . $studentMarks . '%) do not meet minimum cutoff (' . $minMarks . '%)'
        ];
    }

    // 4. Course Eligibility (Weight: 20%)
    $reqCourse = trim((string)($scholarship['eligible_course'] ?? 'ALL'));
    $studentCourse = trim((string)($student['course'] ?? ''));

    if (strtoupper($reqCourse) === 'ALL') {
        $score += 20;
        $breakdown['course'] = [
            'status' => true,
            'label' => 'Course Stream',
            'points' => 20,
            'reason' => 'Open to all academic streams (Student: ' . $studentCourse . ')'
        ];
    } else {
        $allowedCourses = array_map('trim', explode(',', $reqCourse));
        $courseMatched = false;
        foreach ($allowedCourses as $ac) {
            if (strcasecmp($ac, $studentCourse) === 0 || stripos($studentCourse, $ac) !== false || stripos($ac, $studentCourse) !== false) {
                $courseMatched = true;
                break;
            }
        }
        if ($courseMatched) {
            $score += 20;
            $breakdown['course'] = [
                'status' => true,
                'label' => 'Course Stream',
                'points' => 20,
                'reason' => 'Eligible enrolled course: ' . $studentCourse
            ];
        } else {
            $isEligible = false;
            $breakdown['course'] = [
                'status' => false,
                'label' => 'Course Stream',
                'points' => 0,
                'reason' => 'Restricted to ' . $reqCourse . ' (Student in ' . $studentCourse . ')'
            ];
        }
    }

    // 5. State Domicile (Weight: 20%)
    $reqState = trim((string)($scholarship['state_applicable'] ?? 'ALL'));
    $studentState = trim((string)($student['state'] ?? ''));

    if (strtoupper($reqState) === 'ALL') {
        $score += 20;
        $breakdown['state'] = [
            'status' => true,
            'label' => 'State Domicile',
            'points' => 20,
            'reason' => 'All-India eligibility (Student domicile: ' . $studentState . ')'
        ];
    } else {
        if (strcasecmp($reqState, $studentState) === 0) {
            $score += 20;
            $breakdown['state'] = [
                'status' => true,
                'label' => 'State Domicile',
                'points' => 20,
                'reason' => 'Domicile matched: ' . $studentState
            ];
        } else {
            $isEligible = false;
            $breakdown['state'] = [
                'status' => false,
                'label' => 'State Domicile',
                'points' => 0,
                'reason' => 'Applicable strictly for ' . $reqState . ' residents (Student: ' . $studentState . ')'
            ];
        }
    }

    // Optional Gender check if defined
    $reqGender = trim((string)($scholarship['gender_applicable'] ?? 'ALL'));
    $studentGender = trim((string)($student['gender'] ?? ''));
    if (strtoupper($reqGender) !== 'ALL' && !empty($reqGender)) {
        if (strcasecmp($reqGender, $studentGender) !== 0) {
            $isEligible = false;
            $score = max(0, $score - 20);
            $breakdown['gender'] = [
                'status' => false,
                'label' => 'Gender Requirement',
                'points' => 0,
                'reason' => 'Scholarship exclusive to ' . $reqGender . ' candidates'
            ];
        } else {
            $breakdown['gender'] = [
                'status' => true,
                'label' => 'Gender Requirement',
                'points' => 0,
                'reason' => 'Matches required gender: ' . $studentGender
            ];
        }
    }

    // Determine badge rank
    $rankTier = 'Not Recommended';
    $badgeClass = 'badge-danger';
    if ($score >= 90) {
        $rankTier = 'High Match (Fully Eligible)';
        $badgeClass = 'badge-success';
    } elseif ($score >= 70) {
        $rankTier = 'Moderate Match';
        $badgeClass = 'badge-warning';
    } elseif ($score >= 50) {
        $rankTier = 'Low Match';
        $badgeClass = 'badge-neutral';
    }

    return [
        'match_score' => $score,
        'is_eligible' => $isEligible,
        'rank_tier'   => $rankTier,
        'badge_class' => $badgeClass,
        'breakdown'   => $breakdown
    ];
}

/**
 * Dispatch an in-app notification to a student
 */
function createNotification(PDO $db, int $studentId, string $title, string $message, string $type = 'System'): bool {
    $stmt = $db->prepare("INSERT INTO tbl_notification (student_id, title, message, type, is_read, created_at) VALUES (?, ?, ?, ?, 0, NOW())");
    return $stmt->execute([$studentId, $title, $message, $type]);
}

/**
 * Get count of unread notifications for a student
 */
function getUnreadNotificationCount(PDO $db, int $studentId): int {
    $stmt = $db->prepare("SELECT COUNT(*) FROM tbl_notification WHERE student_id = ? AND is_read = 0");
    $stmt->execute([$studentId]);
    return (int)$stmt->fetchColumn();
}
?>

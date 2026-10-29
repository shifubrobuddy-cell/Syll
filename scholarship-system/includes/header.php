<?php
/**
 * SCHOLARSHIP RECOMMENDATION SYSTEM
 * Shared HTML Head & Asset Loader
 * File: includes/header.php
 */
if (!defined('APP_INIT')) {
    define('APP_INIT', true);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= isset($pageTitle) ? sanitize($pageTitle) . ' | ' : '' ?>Scholarship Recommendation System</title>
    <meta name="description" content="Centralized rule-based scholarship discovery and recommendation platform.">
    
    <!-- Design System CSS (Pure CSS3, Zero Frameworks) -->
    <link rel="stylesheet" href="<?= isset($baseUrl) ? $baseUrl : '' ?>assets/css/style.css">
    <link rel="stylesheet" href="<?= isset($baseUrl) ? $baseUrl : '' ?>assets/css/components.css">
    <link rel="stylesheet" href="<?= isset($baseUrl) ? $baseUrl : '' ?>assets/css/forms.css">
    <link rel="stylesheet" href="<?= isset($baseUrl) ? $baseUrl : '' ?>assets/css/dashboard.css">
    <link rel="stylesheet" href="<?= isset($baseUrl) ? $baseUrl : '' ?>assets/css/responsive.css">
</head>
<body>
<?php include __DIR__ . '/navbar.php'; ?>

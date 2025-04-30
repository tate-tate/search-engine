<?php
session_start();
header('Content-Type: application/json');

// Allow requests from specific origins
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Debugging: Log session state
error_log('Session state in get-user-id.php: ' . print_r($_SESSION, true));

// Check if the user is logged in and the userID is set in the session
if (isset($_SESSION['isLogin']) && $_SESSION['isLogin'] === true && isset($_SESSION['userID'])) {
    echo json_encode([
        'success' => true,
        'userID' => $_SESSION['userID']
    ]);
} else {
    error_log('User is not logged in or userID is missing.');
    echo json_encode([
        'success' => false,
        'error' => 'User is not logged in or userID is missing.'
    ]);
}
?>

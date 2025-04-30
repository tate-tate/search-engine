<?php
session_start();

$origin = 'http://localhost:5173'; // Replace with your frontend's origin
header("Access-Control-Allow-Origin: $origin");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

include 'db.php';

// Validate session userID
if (!isset($_SESSION['userID'])) {
    echo json_encode(['success' => false, 'message' => 'User not logged in.']);
    exit;
}

$sessionUserID = $_SESSION['userID'];

// Retrieve and sanitize input
$id = isset($_POST['id']) ? intval($_POST['id']) : null;
$userID = isset($_POST['userID']) ? intval($_POST['userID']) : null;
$title = isset($_POST['title']) ? filter_var($_POST['title'], FILTER_SANITIZE_STRING) : '';
$link = isset($_POST['link']) ? filter_var($_POST['link'], FILTER_SANITIZE_STRING) : '';

// Ensure the userID matches the session userID
if ($userID !== $sessionUserID) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized action.']);
    exit;
}

// Check if updating or creating a new shortcut
if ($id) {
    // Update existing shortcut
    $stmt = $conn->prepare("UPDATE search_cuts SET title = ?, link = ? WHERE id = ? AND userID = ?");
    $stmt->bind_param("ssii", $title, $link, $id, $sessionUserID);
    $action = "updated";
} else {
    // Create new shortcut
    $stmt = $conn->prepare("INSERT INTO search_cuts (userID, title, link) VALUES (?, ?, ?)");
    $stmt->bind_param("iss", $sessionUserID, $title, $link);
    $action = "created";
}

// Execute query and check if successful
if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'id' => $id ? $id : $conn->insert_id,
        'message' => "Shortcut $action successfully."
    ]);
} else {
    echo json_encode(['success' => false, 'message' => 'Error saving shortcut.']);
}

$stmt->close();
$conn->close();
?>
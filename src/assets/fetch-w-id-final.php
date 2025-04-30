<?php
// Start the session to access user data
session_start();

// Set CORS headers
$origin = 'http://localhost:5173'; // Replace with your frontend's origin
header("Access-Control-Allow-Origin: $origin");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Validate session userID
if (!isset($_SESSION['userID'])) {
    echo json_encode(['success' => false, 'error' => 'User not logged in.']);
    exit;
}

include 'db.php';

$sessionUserID = $_SESSION['userID'];

// Get the profile id from the URL if it exists
$id = isset($_GET['id']) ? $_GET['id'] : null;

// Check if an id was passed in the URL
if ($id) {
    // Prepare the query to fetch the specific profile by id
    $stmt = $conn->prepare("SELECT id, userID, title, link FROM search_cuts WHERE id = ?");
    $stmt->bind_param("i", $id); // "i" specifies the type (integer)

    // Execute the query
    if ($stmt->execute()) {
        // Bind the result variables
        $stmt->bind_result($id, $userID, $title, $link);

        // Fetch the result
        if ($stmt->fetch()) {
            $shortCut = [
                "id" => $id,
                "userID" => $userID,
                "title" => $title,
                "link" => $link,
            ];
            // Return the profile in JSON format
            echo json_encode(['success' => true, 'shortcuts' => [$shortCut]]);
        } else {
            // Return an error message if no profile was found
            echo json_encode(["success" => false, "error" => "Short cuts not found"]);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to fetch shortcuts.']);
    }

    // Close the prepared statement
    $stmt->close();
} else {
    // If no ID is provided, fetch all shortcuts for the logged-in user
    $stmt = $conn->prepare("SELECT id, title, link FROM search_cuts WHERE userID = ?");
    $stmt->bind_param("i", $sessionUserID);

    if ($stmt->execute()) {
        $stmt->bind_result($id, $title, $link);

        $shortcuts = [];
        while ($stmt->fetch()) {
            $shortcuts[] = [
                "id" => $id,
                "title" => $title,
                "link" => $link,
            ];
        }

        echo json_encode(['success' => true, 'shortcuts' => $shortcuts]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Failed to fetch shortcuts.']);
    }

    $stmt->close();
}

$conn->close();
?>
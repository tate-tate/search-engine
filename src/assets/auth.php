<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

include 'db.php';
session_start();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = isset($_POST['action']) ? $_POST['action'] : '';
    // Access and sanitize text fields
    $username = isset($_POST['username']) ? filter_var($_POST['username'], FILTER_SANITIZE_STRING) : '';
    $email = isset($_POST['email']) ? filter_var($_POST['email'], FILTER_VALIDATE_EMAIL) : '';
    $password = isset($_POST['password']) ? filter_var($_POST['password'], FILTER_SANITIZE_STRING) : '';

    // Validate required fields for both login and register
    if (empty($username) || empty($password)) {
        echo json_encode(["error" => "Username and password are required."]);
        exit;
    }

    if ($action === 'register') {
        // Hash the password
        $hashedPassword = md5($password); // Replace with password_hash() if supported
        if (empty($email)) {
            echo json_encode(["error" => "Email is required for registration."]);
            exit;
        }

        if (!$email) {
            echo json_encode(["error" => "Invalid email format."]);
            exit;
        }

        try {
            $stmt = $conn->prepare("INSERT INTO search_users (username, password, email) VALUES (?, ?, ?)");
            $stmt->bind_param("sss", $username, $hashedPassword, $email);

            if ($stmt->execute()) {
                $user_id = $conn->insert_id;

                // Store user information in the session
                $_SESSION['isLogin'] = true;
                $_SESSION['userID'] = $user_id;
                $_SESSION['username'] = $username;

                echo json_encode(["success" => true, "message" => "$username registered successfully."]);
                exit;
            } else {
                echo json_encode(["error" => "Error registering user: " . $stmt->error]);
                exit;
            }
        } catch (mysqli_sql_exception $e) {
            error_log("Error: " . $e->getMessage());
            if ($e->getCode() == 23000) { // Duplicate entry error
                echo json_encode(["error" => "Username or email already exists."]);
            } else {
                echo json_encode(["error" => "Registration failed."]);
            }
            exit;
        }
    } elseif ($action === 'login') {
        try {
            $stmt = $conn->prepare("SELECT id, username, password FROM search_users WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $stmt->bind_result($id, $username, $hashedPassword);

            if ($stmt->fetch()) {
                if (md5($password) == $hashedPassword) { // Replace with password_verify() if supported
                    $_SESSION['isLogin'] = true;
                    $_SESSION['userID'] = $id;

                    echo json_encode([
                        "success" => true,
                        "message" => "$username logged in successfully.",
                        "userID" => $id // Ensure userID is included in the response
                    ]);
                    exit;
                } else {
                    echo json_encode(["error" => "Invalid password."]);
                    exit;
                }
            } else {
                echo json_encode(["error" => "User not found."]);
                exit;
            }
        } catch (mysqli_sql_exception $e) {
            error_log("Error: " . $e->getMessage());
            echo json_encode(["error" => "Database error: " . $e->getMessage()]);
            exit;
        }
    } elseif ($action === 'shortcuts') {
        // Ensure the user is logged in
        if (!isset($_SESSION['isLogin']) || $_SESSION['isLogin'] !== true) {
            echo json_encode(["error" => "User not authenticated."]);
            exit;
        }

        $userID = $_SESSION['userID'];
        $shortcuts = isset($_POST['shortcuts']) ? json_decode($_POST['shortcuts'], true) : null;

        if ($shortcuts === null || !is_array($shortcuts)) {
            echo json_encode(["error" => "Invalid shortcuts data."]);
            exit;
        }

        try {
            // Update shortcuts in the database
            $stmt = $conn->prepare("UPDATE search_users SET shortcuts = ? WHERE id = ?");
            $shortcutsJson = json_encode($shortcuts);
            $stmt->bind_param("si", $shortcutsJson, $userID);

            if ($stmt->execute()) {
                echo json_encode(["success" => true, "message" => "Shortcuts updated successfully."]);
            } else {
                echo json_encode(["error" => "Failed to update shortcuts."]);
            }
        } catch (mysqli_sql_exception $e) {
            error_log("Error: " . $e->getMessage());
            echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        }
        exit;
    } else {
        echo json_encode(["error" => "Invalid action."]);
        exit;
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Check login status
    if (isset($_SESSION['isLogin']) && $_SESSION['isLogin'] === true) {
        echo json_encode(['success' => true, 'userID' => $_SESSION['userID'], 'username' => $_SESSION['username']]);
    } else {
        echo json_encode(['success' => false, 'error' => 'User is not logged in.']);
    }

    if (isset($_GET['action']) && $_GET['action'] === 'shortcuts') {
        // Ensure the user is logged in
        if (!isset($_SESSION['isLogin']) || $_SESSION['isLogin'] !== true) {
            echo json_encode(["error" => "User not authenticated."]);
            exit;
        }

        $userID = $_SESSION['userID'];

        try {
            // Fetch shortcuts from the database
            $stmt = $conn->prepare("SELECT shortcuts FROM search_users WHERE id = ?");
            $stmt->bind_param("i", $userID);
            $stmt->execute();
            $stmt->bind_result($shortcutsJson);

            if ($stmt->fetch()) {
                $shortcuts = json_decode($shortcutsJson, true);
                echo json_encode(["success" => true, "shortcuts" => $shortcuts]);
            } else {
                echo json_encode(["error" => "No shortcuts found."]);
            }
        } catch (mysqli_sql_exception $e) {
            error_log("Error: " . $e->getMessage());
            echo json_encode(["error" => "Database error: " . $e->getMessage()]);
        }
        exit;
    }
} else {
    // Handle unsupported methods
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed.']);
}
?>
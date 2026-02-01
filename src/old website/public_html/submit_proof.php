<?php
require_once("resources/connection_build.php");
require_once("resources/check_login.php");
require_once("resources/function.php")

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $taskId = intval($_POST['task_id']);

    if (isset($_FILES['screenshot']) && $_FILES['screenshot']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = 'Media/Completed Task/Media/';
        $originalName = basename($_FILES['screenshot']['name']);
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        $newFileName = 'proof_' . time() . '_' . rand(1000,9999) . '.' . $extension;
        $targetPath = $uploadDir . $newFileName;

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true); 
        }

        if (move_uploaded_file($_FILES['screenshot']['tmp_name'], $targetPath)) {
            // Save to DB
            $stmt = $conn->prepare("INSERT INTO completed_whatsapp_task (task_id, file_path, uploaded_at) VALUES (?, ?, NOW())");
            $stmt->bind_param("is", $taskId, $targetPath);
            if ($stmt->execute()) {
                echo "Proof submitted successfully.";
            } else {
                echo "Failed to save to database.";
            }
            $stmt->close();
        } else {
            echo "Failed to move uploaded file.";
        }
    } else {
        echo "Invalid file upload.";
    }
} else {
    echo "Invalid request method.";
}
?>

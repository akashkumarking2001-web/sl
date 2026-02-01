<?php
require_once("../resources/connection_build.php");
require_once("../resources/check_login.php");

header('Content-Type: application/json');

$response = ["success" => false, "message" => ""];

if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST['approve_payment'])) {
    $task_id     = intval($_POST['task_id']);
    $task_type   = $_POST['task_type'];
    $agent_id    = $_POST['agent_id'];
    $task_amount = $_POST['task_amount'];

    if ($task_type == "whatsapp") {
        $table = "completed_whatsapp_task";
    } elseif ($task_type == "app") {
        $table = "completed_app_task";
    } else {
        echo json_encode(["success" => false, "message" => "Invalid Task Type"]);
        exit;
    }

    // Step 1: Update task payment status
    $updateSql = "UPDATE $table 
                  SET payment_status = 1 
                  WHERE agent_id = '$agent_id' AND task_id = '$task_id'";
                  
    // Step 2: Update wallet
    $updateSql2 = "UPDATE `agent_income` 
                   SET wallet = wallet + '$task_amount'  
                   WHERE agent_id = '$agent_id'";

    if (mysqli_query($conn, $updateSql)) {
        // Step 3: Insert into income table
        $insertincomeSql = "INSERT INTO task_income (agent_id, task_id, task_type, amount, created_at) 
                            VALUES ('$agent_id', '$task_id', '$task_type', '$task_amount', NOW())";

        if (mysqli_query($conn, $updateSql2) && mysqli_query($conn, $insertincomeSql)) {
            $response["success"] = true;
            $response["message"] = "✅ Payment Approved";
        } else {
            $response["message"] = "Failed to update wallet or income";
        }
    } else {
        $response["message"] = "Database Error: " . mysqli_error($conn);
    }
}

echo json_encode($response);

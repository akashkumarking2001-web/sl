<?php
require_once("resources/connection_build.php");
require_once("resources/check_login.php");
require_once("resources/function.php");
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <title>Task</title>

    <?php require_once("resources/header_links.php"); ?>
    <style>
        .popup-message {
            position: fixed;
            top: 20px;
            right: 20px;
            min-width: 250px;
            z-index: 9999;
            display: none;
        }
    </style>
</head>

<body>

<?php
require_once("resources/header.php");
require_once("resources/sidebar.php");
?>

<main id="main" class="main">
    <div class="pagetitle">
        <h1>Task</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                <li class="breadcrumb-item active">Task</li>
            </ol>
        </nav>
        <!-- Popup placeholder -->
        <div id="taskAlert" class="popup-message alert text-center"></div>
    </div>

     <section class="section dashboard">
            <!-- Nav tabs -->
            <ul class="nav nav-tabs" id="dashboardTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="whatsapp-tab" data-bs-toggle="tab" data-bs-target="#whatsapp-tab-pane" type="button" role="tab" aria-controls="whatsapp-tab-pane" aria-selected="true">
                       <i class="bi bi-whatsapp  fs-5" style="color: green;"></i>
                        Whatsapp Task
                    </button>

                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="app-tab" data-bs-toggle="tab" data-bs-target="#app-tab-pane" type="button" role="tab" aria-controls="app-tab-pane" aria-selected="false">
                     <i class="bi bi-file-earmark-arrow-down fs-5" style="color:blue;"></i>
                    App Task
                    </button>
                </li>
            </ul>

            <!-- Tab panes -->
            <div class="tab-content">
                   <!-- Whatsapp panel -->
                <div class="tab-pane fade show active" id="whatsapp-tab-pane" role="tabpanel" aria-labelledby="whatsapp-tab">
                     <?php
                        $task_query = mysqli_query($conn, "SELECT * FROM `whatsapp_tasks`"); // Fetch all WhatsApp tasks
                        if (mysqli_num_rows($task_query) > 0) {
                            $taskCount = 1;
                            while ($task = mysqli_fetch_assoc($task_query)) {
                                $taskId = $task['task_id'];
                                $taskHead = $task['task_head'];
                                $taskDesc = $task['task_desc'];
                                $task_amount = $task['task_amount'];
                                $taskList = explode(',', $task['task_do_list']); // assuming a comma-separated list
                                $fileUrl = $task['file_url'];
                                $collapseId = "whatsappTask" . $taskId;
                        ?>

                        <div class="card mt-3">
                            <div class="card-header" data-bs-toggle="collapse" data-bs-target="#<?= $collapseId ?>" aria-expanded="false" aria-controls="<?= $collapseId ?>">
                                <div class="d-flex justify-content-between align-items-center">
                                    <strong>Task <?= $taskCount ?>: <?= htmlspecialchars($taskHead) ?></strong>
                                     <strong>Task Amount: Rs.<?= $task_amount ?></strong>
                                    <?php
                                        // Fetch all submissions by this agent for this task
                                        $query = "SELECT * FROM `completed_whatsapp_task` WHERE agent_id = $my_id AND task_id = $taskId ORDER BY id DESC"; // assuming `id` is auto-incremented
                                        $result = mysqli_query($conn, $query);

                                        // Get number of submissions
                                        $count = mysqli_num_rows($result);

                                        // Set defaults
                                        $iconClass = "bi-check-circle-fill ";
                                        $message = "";
                                        $lastSubmittedTime = "N/A";

                                        if ($count == 0) {
                                            $iconClass .= "text-danger"; // red
                                            $message = "Not yet completed";
                                        } elseif ($count == 1) {
                                            $iconClass .= "text-warning"; // yellow
                                            $message = "1 proof submitted";
                                        } else {
                                            $iconClass .= "text-success"; // green
                                            $message = "Completed";
                                        }

                                        if ($count > 0) {
                                            $latest = mysqli_fetch_assoc($result);
                                            $lastSubmittedTime = $latest['uploaded_at']; 
                                        }
                                        ?>

                                        <!-- Output -->
                                        <i class="bi <?php echo $iconClass; ?>"><?php echo $message; ?></i> 
                                </div>
                            </div>

                            <div id="<?= $collapseId ?>" class="collapse">
                                <div class="card-body">
                                    <p><?= nl2br(htmlspecialchars($taskDesc)) ?></p>
                                    <ul>
                                        <?php foreach ($taskList as $item): ?>
                                            <li><?= htmlspecialchars(trim($item)) ?></li>
                                        <?php endforeach; ?>
                                    </ul>

                                 <?php if (!empty($fileUrl)): ?>
                                    <?php $filename = basename($fileUrl); ?>
                                   <a href="download.php?file=<?=$fileUrl?>" class="btn btn-primary mb-3">Download File</a>
                                <?php endif; ?>

                                 <!-- Upload Screenshot -->
                                <form method="POST" enctype="multipart/form-data" class="mb-3 d-flex align-items-center gap-2" style="flex-wrap: wrap;">
                                    <input type="hidden" name="submission_count" value="<?php echo $count; ?>">
                                    <input type="hidden" name="last_submitted_time" value="<?php echo htmlspecialchars($lastSubmittedTime); ?>">
                                    <input type="hidden" name="task_id" value="<?= $taskId ?>">
                                    <label for="screenshotUpload<?= $taskId ?>" class="form-label mb-0">Upload Screenshot</label>
                                    <input class="form-control" required type="file" id="screenshotUpload<?= $taskId ?>" name="screenshot" accept="image/*" style="max-width: 300px;" required>
                                    <button type="submit" name="submit_proof" class="btn btn-success">Submit Proof</button>
                                </form>
                                </div>
                            </div>
                        </div>

                        <?php
                                $taskCount++;
                            }
                        } else {
                            echo '<p>No WhatsApp tasks found.</p>';
                        }
                        ?>
                </div>
            </div>
                   <!-- App panel -->
                <div class="tab-pane fade" id="app-tab-pane" role="tabpanel" aria-labelledby="app-tab">
                    <?php
                        $task_query = mysqli_query($conn, "SELECT * FROM `app_task`"); // Fetch all WhatsApp tasks

                        if (mysqli_num_rows($task_query) > 0) {
                            $taskCount = 1;
                            while ($task = mysqli_fetch_assoc($task_query)) {
                                $taskId = $task['id'];
                                $taskHead = $task['task_head'];
                                $taskDesc = $task['task_desc'];
                                $task_amount = $task['task_amount'];
                                $taskList = explode(',', $task['task_do_list']);
                                $guid=$task['optional_url_1']; 
                                $fileUrl = $task['file_url'];
                                $proof_type=$task['proof_type'];
                                $collapseId = "appTask" . $taskId;
                        ?>

                        <div class="card mt-3">
                            <div class="card-header" data-bs-toggle="collapse" data-bs-target="#<?= $collapseId ?>" aria-expanded="false" aria-controls="<?= $collapseId ?>">
                                <div class="d-flex justify-content-between align-items-center">
                                    <strong>Task <?= $taskCount ?>: <?= htmlspecialchars($taskHead) ?></strong>
                                     <strong>Task Amount: Rs.<?= $task_amount ?></strong>
                                    <?php
                                        // Fetch all submissions by this agent for this task
                                        $query = "SELECT * FROM `completed_app_task` WHERE agent_id = $my_id AND task_id = $taskId ORDER BY id DESC"; // assuming `id` is auto-incremented
                                        $result = mysqli_query($conn, $query);

                                        // Get number of submissions
                                        $count = mysqli_num_rows($result);

                                        // Set defaults
                                        $iconClass = "bi-check-circle-fill ";
                                        $message = "";
                                        $lastSubmittedTime = "N/A";

                                        if ($count == 0) {
                                            $iconClass .= "text-danger"; // red
                                            $message = "Not yet completed";
                                        } 
                                        else {
                                            $iconClass .= "text-success"; // green
                                            $message = "Completed";
                                        }
                                        ?>

                                        <!-- Output -->
                                        <i class="bi <?php echo $iconClass; ?>"><?php echo $message; ?></i> 
                                </div>
                            </div>

                            <div id="<?= $collapseId ?>" class="collapse">
                                <div class="card-body">
                                    <p><?= nl2br(htmlspecialchars($taskDesc)) ?></p>
                                    <ul>
                                        <?php foreach ($taskList as $item): ?>
                                            <li><?= htmlspecialchars(trim($item)) ?></li>
                                        <?php endforeach; ?>
                                    </ul>

                               <?php if (!empty($guid)): ?>
                                    <a href="<?php echo $guid; ?>" class="btn btn-primary mb-3">Installation Guide</a>
                                <?php endif; ?>


                                 <?php if (!empty($fileUrl)): ?>
                                    <?php $filename = basename($fileUrl); ?>
                                    <a href="download.php?file=<?= $fileUrl?>" class="btn btn-primary mb-3">Download File</a>
                                <?php endif; ?>
                                <?php if ($proof_type == 1): ?>
                                    <!-- Only Screenshot Upload -->
                                    <form method="POST" enctype="multipart/form-data">
                                        <div class="mb-3 d-flex align-items-center gap-2">
                                            <label for="screenshotUpload<?= $taskId ?>" class="form-label mb-0">Upload Screenshot</label>
                                            <input class="form-control" required type="file" id="screenshotUpload<?= $taskId ?>" name="screenshot" accept="image/*" style="max-width: 300px;">
                                            <input type="hidden" name="task_id" value="<?= $taskId ?>">
                                            <input type="hidden" name="proof_type" value="1">
                                            <button type="submit" name="app_submit_proof" class="btn btn-success">Submit Proof</button>
                                        </div>
                                    </form>

                                <?php elseif ($proof_type == 2): ?>
                                    <!-- User ID + Screenshot Upload -->
                                    <form method="POST" enctype="multipart/form-data">
                                        <div class="d-flex align-items-center gap-3 mb-3" style="flex-wrap: wrap;">
                                            <!-- User ID Input -->
                                            <div>
                                                <label for="userId<?= $taskId ?>" class="form-label mb-0">User ID</label>
                                                <input class="form-control" type="text" id="userId<?= $taskId ?>" name="userId" required placeholder="Enter your User ID" style="max-width: 200px;">
                                            </div>
                                            <!-- Screenshot Upload -->
                                            <div>
                                                <label for="screenshotUpload<?= $taskId ?>" class="form-label mb-1">Screenshot</label>
                                                <input class="form-control" required type="file" id="screenshotUpload<?= $taskId ?>" name="screenshot" accept="image/*" style="max-width: 200px;">
                                            </div>
                                            <!-- Hidden Inputs -->
                                            <input type="hidden" name="task_id" value="<?= $taskId ?>">
                                            <input type="hidden" name="proof_type" value="2">
                                            <!-- Submit Button -->
                                            <div class="mt-4">
                                                <button type="submit" name="app_submit_proof" class="btn btn-success">Submit Proof</button>
                                            </div>
                                        </div>
                                    </form>
                                <?php endif; ?>
                                </div>
                            </div>
                        </div>

                        <?php
                                $taskCount++;
                            }
                        } else {
                            echo '<p>No App tasks found.</p>';
                        }
                        ?>
                </div>
              </div>
            </div>
        </section>
</main>

<?php
require_once("resources/footer.php");
require_once("resources/footer_links.php");
?>

<script>
function showPopup(message, type="success") {
    const popup = document.getElementById('taskAlert');
    popup.className = "popup-message alert alert-" + type;
    popup.innerHTML = message;
    popup.style.display = "block";
    setTimeout(() => {
        popup.style.display = "none";
    }, 2000);
}
</script>

<?php
// ================= WHATSAPP PROOF SUBMISSION ==================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['submit_proof'])) {
    $taskId = mysqli_real_escape_string($conn, $_POST['task_id']);
    $submitedCount = mysqli_real_escape_string($conn, $_POST['submission_count']);
    $lastSubmittedAt = mysqli_real_escape_string($conn, $_POST['last_submitted_time']);
    $uploadDir = "Media/Completed Task/Whatsapp/";

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    date_default_timezone_set('Asia/Kolkata');
    $currentTime = time();
    $lastSubmittedTime = strtotime($lastSubmittedAt);

    if ($submitedCount == 1) {
        $timeDiff = $currentTime - $lastSubmittedTime;
        if ($timeDiff < 43200) {
            echo "<script>showPopup('⏳ Please wait at least 12 hours before submitting again.','warning');</script>";
            exit;
        }
    }

    $fileUrl = '';
    $agent_id = $my_id;

    if (isset($_FILES["screenshot"]) && $_FILES["screenshot"]["error"] === 0) {
        $fileName = basename($_FILES["screenshot"]["name"]);
        $targetFilePath = $uploadDir . time() . "_" . $fileName;
        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
        $allowedTypes = ["jpg", "jpeg", "png", "gif", "webp"];

        if (in_array($fileType, $allowedTypes)) {
            if (move_uploaded_file($_FILES["screenshot"]["tmp_name"], $targetFilePath)) {
                $fileUrl = $targetFilePath;
            } else {
                echo "<script>showPopup('❌ Failed to upload file.','danger');</script>";
                exit;
            }
        } else {
            echo "<script>showPopup('❌ Invalid file type. Only JPG, PNG, GIF, WEBP allowed.','danger');</script>";
            exit;
        }
    } else {
        echo "<script>showPopup('❌ No file selected or upload error.','danger');</script>";
        exit;
    }

    $insertSql = "INSERT INTO completed_whatsapp_task (task_id, agent_id, file_path, uploaded_at) 
                  VALUES ('$taskId', '$agent_id', '$fileUrl', NOW())";

    if (mysqli_query($conn, $insertSql)) {
        echo "<script>
                showPopup('✅ Proof submitted successfully!','success');
                setTimeout(() => { window.location.href = window.location.href; }, 2000);
              </script>";
        exit;
    } else {
        echo "<script>showPopup('❌ Database Error: " . mysqli_error($conn) . "','danger');</script>";
        exit;
    }
}
?>

<?php
// ================= APP PROOF SUBMISSION ==================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['app_submit_proof'])) {
    $taskId = mysqli_real_escape_string($conn, $_POST['task_id']);
    $proofType = $_POST['proof_type'];
    $uploadDir = "Media/Completed Task/App/";
    $fileUrl = '';
    $agent_id = $my_id;
    $user_id = ($proofType == 2 && !empty($_POST['userId'])) ? mysqli_real_escape_string($conn, $_POST['userId']) : '';

    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    if (isset($_FILES["screenshot"]) && $_FILES["screenshot"]["error"] === 0) {
        $fileName = basename($_FILES["screenshot"]["name"]);
        $targetFilePath = $uploadDir . time() . "_" . $fileName;
        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
        $allowedTypes = ["jpg", "jpeg", "png", "gif", "webp"];

        if (in_array($fileType, $allowedTypes)) {
            if (move_uploaded_file($_FILES["screenshot"]["tmp_name"], $targetFilePath)) {
                $fileUrl = $targetFilePath;
            } else {
                echo "<script>showPopup('❌ Failed to upload file.','danger');</script>";
                exit;
            }
        } else {
            echo "<script>showPopup('❌ Invalid file type. Only JPG, PNG, GIF, WEBP allowed.','danger');</script>";
            exit;
        }
    } else {
        echo "<script>showPopup('❌ No file selected or upload error.','danger');</script>";
        exit;
    }

    $insertSql = "INSERT INTO completed_app_task (task_id, agent_id, user_id, file_path, uploaded_at) 
                  VALUES ('$taskId', '$agent_id', '$user_id', '$fileUrl', NOW())";

    if (mysqli_query($conn, $insertSql)) {
        echo "<script>
                showPopup('✅ Proof submitted successfully!','success');
                setTimeout(() => { window.location.href = window.location.href; }, 2000);
              </script>";
        exit;
    } else {
        echo "<script>showPopup('❌ Database Error: " . mysqli_error($conn) . "','danger');</script>";
        exit;
    }
}
?>

</body>
</html>

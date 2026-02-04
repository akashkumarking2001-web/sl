<?php
require_once("../resources/connection_build.php");
require_once("../resources/check_login.php");
require_once("../resources/function.php")
    ?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <title>Task Management</title>

    <?php require_once("../resources/header_links.php"); ?>
</head>

<body>

    <?php
    require_once("resources/header.php");
    // ======= Sidebar =======
    require_once("resources/sidebar.php");
    ?>
    <main id="main" class="main">

        <div class="pagetitle">
            <h1>Task Management</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item active">Task Management</li>
                     <li class="breadcrumb-item active">Add Task</li>
                </ol>
            </nav>
        </div><!-- End Page Title -->
        <section class="section dashboard">
            <!-- Nav tabs -->
            <ul class="nav nav-tabs" id="dashboardTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="whatsapp-tab" data-bs-toggle="tab" data-bs-target="#whatsapp-tab-pane" type="button" role="tab" aria-controls="whatsapp-tab-pane" aria-selected="true">
                        <i class="bi bi-whatsapp fs-5" style="color: green;"></i>
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
                <!-- Whatsapp Task Panel -->
                <div class="tab-pane fade show active" id="whatsapp-tab-pane" role="tabpanel" aria-labelledby="whatsapp-tab">
                    <div class="container mt-5">
                        <form id="createWhatsappTaskForm" method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="form_type" value="whatsapp">
                            <div class="mb-3">
                                <label for="taskTitle" class="form-label">Task Title</label>
                                <input type="text" class="form-control" name="taskTitle" id="taskTitle" placeholder="e.g., Promote Product on WhatsApp" required>
                            </div>
                            <div class="mb-3">
                                <label for="taskDescription" class="form-label">Task Description</label>
                                <textarea class="form-control" name="taskDescription" id="taskDescription" rows="4" placeholder="Describe what the user should do..." required></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="taskRequirements" class="form-label">Requirements (# separated)</label>
                                <input type="text" class="form-control" name="taskRequirements" id="taskRequirements" placeholder="e.g., Minimum 10 shares # Use official tracking link # Upload screenshot as proof" required>
                            </div>
                            <div class="mb-3">
                                <label for="uploadMedia" class="form-label">Upload Media (Image or Video)</label>
                                <input class="form-control" type="file" name="uploadMedia" id="uploadMedia" accept="image/*,video/*" required>
                            </div>
							<div class="mb-3">
                                <label for="payment" class="form-label">Task Amount</label>
                                <input class="form-control" type="number" name="payment" id="payment"required>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary">Create Task</button>
                            </div>
                        </form>
                    </div>
                    <div class="container mt-5">
                            <table class="table table-bordered table-striped table-hover">
                             <?php
                                // Fetch all submissions by this agent for this task
                                $query = "SELECT *
                                            FROM whatsapp_tasks;"; 
                                $result = mysqli_query($conn, $query);
                                if (!$result) {
                                    die("Query Failed: " . mysqli_error($conn));
                                }
                            ?>
                                <thead class="thead-dark">
                                    <tr>
                                        <th>Task ID</th>
                                        <th>Task Name</th>
                                         <th>Task Amount</th>
                                        <th>Posted On</th>
                                        <th>Delete</th>
                                    </tr>
                                </thead>
                                 <tbody>
                                    <?php if (mysqli_num_rows($result) > 0): ?>
                                        <?php while ($row = mysqli_fetch_assoc($result)): ?>
                                            <tr>
                                                <td><?php echo htmlspecialchars($row['task_id']); ?></td>
                                                <td><?php echo htmlspecialchars($row['task_head']); ?></td>
                                                <td><?php echo htmlspecialchars($row['task_amount']); ?></td>
                                                <td><?php echo htmlspecialchars($row['Created_at']); ?></td>
                                                <td>
                                                    <form method="post" onsubmit="return confirm('Are you sure you want to delete this task?');">
                                                        <input type="hidden" name="delete_task_id" value="<?php echo $row['task_id']; ?>">
                                                        <input type="hidden" name="delete_task_file" value="<?php echo $row['file_url']; ?>">
                                                        <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                                                    </form>
                                                </td>
                                            </tr>
                                        <?php endwhile; ?>
                                    <?php else: ?>
                                        <tr><td colspan="4" class="text-center">No tasks found.</td></tr>
                                    <?php endif; ?>
                                </tbody>
                        </table>
                    </div>

                </div>

              <!-- App Task Panel -->
                <div class="tab-pane fade" id="app-tab-pane" role="tabpanel" aria-labelledby="app-tab">
                    <div class="container mt-5">
                        <form method="POST" enctype="multipart/form-data">
                            <input type="hidden" name="form_type" value="app_task">
                            <div class="mb-3">
                                <label for="appTaskTitle" class="form-label">Task Title</label>
                                <input type="text" class="form-control" id="appTaskTitle" name="appTaskTitle" placeholder="e.g. Promote Product on WhatsApp" required>
                            </div>

                            <div class="mb-3">
                                <label for="appTaskDescription" class="form-label">Task Description</label>
                                <textarea class="form-control" id="appTaskDescription" name="appTaskDescription" rows="4" placeholder="Describe the task details..." required></textarea>
                            </div>

                            <div class="mb-3">
                                <label for="appTaskRequirements" class="form-label">Requirements (# separated)</label>
                                <input type="text" class="form-control" id="appTaskRequirements" name="appTaskRequirements" placeholder="e.g., Minimum 10 shares # Use official tracking link # Upload screenshot as proof" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Optional Links/Buttons</label>
                                <input type="text" class="form-control mb-2" name="appOptionalURL1" placeholder="e.g. Installation Guide URL">
                                <input type="text" class="form-control mb-2" name="appOptionalURL2" placeholder="e.g. App Download URL">
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Upload APK (or ZIP/RAR)</label>
                                <input type="file" class="form-control mb-2" id="appApkFile" name="appApkFile">
                            </div>
							
							<div class="mb-3">
                                <label for="payment" class="form-label">Task Amount</label>
                                <input class="form-control" type="number" name="payment" id="payment"required>
                            </div>

                            <div class="mb-3">
                                <label for="appProofType" class="form-label">Allowed Proof Types</label>
                                <div>
                                    <label><input type="radio" name="appProofType" value="1"> Screenshot Upload</label><br>
                                    <label><input type="radio" name="appProofType" value="2"> User ID & Screenshot Upload</label>
                                </div>
                            </div>

                            <button type="submit" class="btn btn-success">Post Task</button>
                        </form>
                    </div>

                    <div class="container mt-5">
                        <table class="table table-bordered table-striped">
                             <?php
                                // Fetch all submissions by this agent for this task
                                $query = "SELECT *
                                            FROM app_task;"; 
                                $result = mysqli_query($conn, $query);
                                if (!$result) {
                                    die("Query Failed: " . mysqli_error($conn));
                                }
                            ?>
                            <thead class="thead-dark">
                                <tr>
                                    <th>TaskId</th>
                                    <th>TaskName</th>
                                    <th>TaskAmount</th>
                                    <th>PostedOn</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (mysqli_num_rows($result) > 0): ?>
                                    <?php while ($row = mysqli_fetch_assoc($result)): ?>
                                        <tr>
                                            <td><?php echo htmlspecialchars($row['id']); ?></td>
                                            <td><?php echo htmlspecialchars($row['task_head']); ?></td>
                                            <td><?php echo htmlspecialchars($row['task_amount']); ?></td>
                                            <td><?php echo htmlspecialchars($row['created_at']); ?></td>
                                            <td>
                                               <form method="post" onsubmit="return confirm('Are you sure you want to delete this task?');">
                                                        <input type="hidden" name="delete_app_task_id" value="<?php echo $row['id']; ?>">
                                                        <input type="hidden" name="delete_app_task_file" value="<?php echo $row['file_url']; ?>">
                                                        <button type="submit" class="btn btn-danger btn-sm">Delete</button>
                                                    </form>
                                            </td>
                                        </tr>
                                    <?php endwhile; ?>
                                <?php else: ?>
                                    <tr><td colspan="5" class="text-center">No tasks found.</td></tr>
                                <?php endif; ?>
                        </table>
                    </div>

                </div>

                <?php
                if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $formType = $_POST['form_type'] ?? '';

                if ($formType === "whatsapp" && isset($_FILES["uploadMedia"])) {
                     $title = mysqli_real_escape_string($conn, $_POST['taskTitle']);
                        $description = mysqli_real_escape_string($conn, $_POST['taskDescription']);
                        $requirements = mysqli_real_escape_string($conn, $_POST['taskRequirements']);
						$task_amount = mysqli_real_escape_string($conn, $_POST['payment']);

                        $uploadDir = "../Media/whatsapp_task/";
                        if (!is_dir($uploadDir)) {
                            mkdir($uploadDir, 0777, true);
                        }

                        $fileName = basename($_FILES["uploadMedia"]["name"]);
                        $targetFilePath = $uploadDir . time() . "_" . $fileName;
                        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
                        $allowedTypes = ["jpg", "jpeg", "png", "gif", "mp4", "mov", "avi", "webp"];

                        if (in_array($fileType, $allowedTypes)) {
                            if (move_uploaded_file($_FILES["uploadMedia"]["tmp_name"], $targetFilePath)) {
                                $insertSql = "INSERT INTO whatsapp_tasks (task_head, task_desc, task_do_list, file_url,task_amount) 
                                            VALUES ('$title', '$description', '$requirements', '$targetFilePath','$task_amount')";
                                if (mysqli_query($conn, $insertSql)) {
                                    echo "<div id='taskAlert' class='alert alert-success text-center mt-3 fade show'>Task Created successfully...!</div>
                                            <script>
                                                setTimeout(function () {
                                                    const alertBox = document.getElementById('taskAlert');
                                                    if (alertBox) {
                                                        alertBox.classList.remove('show');
                                                        alertBox.classList.add('fade');
                                                        alertBox.style.display = 'none';
                                                    }
                                                }, 2000);
                                            </script>";
                                    echo '<script>window.location.href = "task_management.php";</script>';
                                    exit();

                                } else {
                                    echo "<div class='alert alert-danger text-center mt-3 fade show'>Database error: " . mysqli_error($conn) . "</div>
                                            <script>
                                                setTimeout(function () {
                                                    const alertBox = document.getElementById('taskAlert');
                                                    if (alertBox) {
                                                        alertBox.classList.remove('show');
                                                        alertBox.classList.add('fade');
                                                        alertBox.style.display = 'none';
                                                    }
                                                }, 2000);
                                            </script>";
                                }
                            } else {
                                echo "<div class='alert alert-danger text-center mt-3 fade show'>Error uploading the file.</div>
                                            <script>
                                                setTimeout(function () {
                                                    const alertBox = document.getElementById('taskAlert');
                                                    if (alertBox) {
                                                        alertBox.classList.remove('show');
                                                        alertBox.classList.add('fade');
                                                        alertBox.style.display = 'none';
                                                    }
                                                }, 2000);
                                            </script>";
                            }
                        } else {
                            echo "<div class='alert alert-danger text-center mt-3 fade show'>Invalid file type. Allowed: jpg, jpeg, png, gif, mp4, mov, avi, webp.</div>
                                            <script>
                                                setTimeout(function () {
                                                    const alertBox = document.getElementById('taskAlert');
                                                    if (alertBox) {
                                                        alertBox.classList.remove('show');
                                                        alertBox.classList.add('fade');
                                                        alertBox.style.display = 'none';
                                                    }
                                                }, 2000);
                                            </script>";
                        }
                } elseif ($formType === "app_task") {
                     $title = mysqli_real_escape_string($conn, $_POST['appTaskTitle']);
                    $description = mysqli_real_escape_string($conn, $_POST['appTaskDescription']);
                    $requirements = mysqli_real_escape_string($conn, $_POST['appTaskRequirements']);
                    $proofType = mysqli_real_escape_string($conn, $_POST['appProofType'] ?? '');
                    $optionalURL1 = mysqli_real_escape_string($conn, $_POST['appOptionalURL1'] ?? '');
                    $optionalURL2 = mysqli_real_escape_string($conn, $_POST['appOptionalURL2'] ?? '');
					$task_amount = mysqli_real_escape_string($conn, $_POST['payment']);

                    // File upload handling
                    $uploadDir = "../Media/app_task/";
                    if (!is_dir($uploadDir)) {
                        mkdir($uploadDir, 0777, true);
                    }

                    $fileUrl = '';
                    if (isset($_FILES["appApkFile"]) && $_FILES["appApkFile"]["error"] == 0) {
                        $fileName = basename($_FILES["appApkFile"]["name"]);
                        $targetFilePath = $uploadDir . time() . "_" . $fileName;
                        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
                        $allowedTypes = ["apk", "zip", "rar"];

                        if (in_array($fileType, $allowedTypes)) {
                            if (move_uploaded_file($_FILES["appApkFile"]["tmp_name"], $targetFilePath)) {
                                $fileUrl = $targetFilePath;
                            } else {
                                echo "<div class='alert alert-danger'>Failed to upload file.</div>";
                                exit;
                            }
                        } else {
                            echo "<div class='alert alert-danger'>Invalid file type. Only APK, ZIP, RAR allowed.</div>";
                            exit;
                        }
                    }

                    // Insert into database
                    $insertSql = "INSERT INTO app_task 
                        (task_head, task_desc, task_do_list, optional_url_1, optional_url_2, proof_type, file_url,task_amount) 
                        VALUES 
                        ('$title', '$description', '$requirements', '$optionalURL1', '$optionalURL2', '$proofType', '$fileUrl','$task_amount')";

                    if (mysqli_query($conn, $insertSql)) {
                        echo "<div id='taskAlert' class='alert alert-success text-center mt-3 fade show'>Task created successfully!</div>
                        <script>
                            setTimeout(function () {
                                const alertBox = document.getElementById('taskAlert');
                                if (alertBox) {
                                    alertBox.classList.remove('show');
                                    alertBox.classList.add('fade');
                                    alertBox.style.display = 'none';
                                }
                            }, 2000);
                        </script>";
                        echo '<script>window.location.href = "task_management.php";</script>';
                        exit();
                    } else {
                        echo "<div class='alert alert-danger text-center mt-3 fade show'>Database Error: " . mysqli_error($conn) . "</div>";
                    }
                }
            }
            ?>

            </div>
        </section>
    </main><!-- End #main -->

    <?php
    require_once("../resources/footer.php");
    require_once("../resources/footer_links.php");
    ?>

<?php
// Handle delete request
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_task_id'])) {
    $taskIdToDelete = intval($_POST['delete_task_id']);

    // First, get the file path from the database
    $query = "SELECT task_file FROM whatsapp_tasks WHERE task_id = $taskIdToDelete";
    $result = mysqli_query($conn, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        $taskFilePath = $row['task_file'];
        $targetFile = substr($taskFilePath, 3);
       
        if (file_exists($targetFile)) {
            if (!unlink($targetFile)) {
                echo "<div class='alert alert-warning'>Failed to delete file: $taskFileToDelete</div>";
            }
        } else {
            echo "<div class='alert alert-info'>File does not exist: $taskFileToDelete</div>";
        }
    }

    // Now delete the task from the database
    $deleteQuery = "DELETE FROM whatsapp_tasks WHERE task_id = $taskIdToDelete";
    $deleteResult = mysqli_query($conn, $deleteQuery);

    if (!$deleteResult) {
        echo "<div class='alert alert-danger'>Delete failed: " . mysqli_error($conn) . "</div>";
    } else {
        echo "<div class='alert alert-success'>Task deleted successfully.$targetFile</div>";
    }
}


if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_app_task_id'], $_POST['delete_app_task_file'])) {
    $taskIdToDelete = intval($_POST['delete_app_task_id']);
    $taskFileToDelete = $_POST['delete_app_task_file']; 
    $targetFile = substr($taskFileToDelete, 3);


    if (file_exists($targetFile)) {
        if (!unlink($targetFile)) {
            echo "<div class='alert alert-warning'>Failed to delete file: $taskFileToDelete</div>";
        }
    } else {
        echo "<div class='alert alert-info'>File does not exist: $taskFileToDelete</div>";
    }

    // Now delete the task from the database
    $deleteQuery = "DELETE FROM app_task WHERE task_id = $taskIdToDelete";
    $deleteResult = mysqli_query($conn, $deleteQuery);

    if (!$deleteResult) {
        echo "<div class='alert alert-danger'>Delete failed: " . mysqli_error($conn) . "</div>";
    } else {
        echo "<div class='alert alert-success'>Task deleted successfully.</div>";
    }
}

?>

</body>

</html>
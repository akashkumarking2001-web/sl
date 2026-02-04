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
            <h1>Ads Management</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item active">Ads Management</li>
                     <li class="breadcrumb-item active">Add</li>
                </ol>
            </nav>
        </div><!-- End Page Title -->
        <section class="section dashboard">
            <!-- Nav tabs -->
            <ul class="nav nav-tabs" id="dashboardTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="ads-tab" data-bs-toggle="tab" data-bs-target="#ads-tab-pane" type="button" role="tab" aria-controls="ads-tab-pane" aria-selected="true">
                       <i class="bi bi-camera-video"></i>
                        Create Ads Task
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="manage_ads-tab" data-bs-toggle="tab" data-bs-target="#manage-ads-tab-pane" type="button" role="tab" aria-controls="manage_ads-tab-pane" aria-selected="false">
                       <i class="bi bi-camera-video" style="color: red;"></i>
                        Manage Ads
                    </button>
                </li>
            </ul>

            <!-- Tab panes -->
            <div class="tab-content">
                <!-- ads Task Panel -->
                <div class="tab-pane fade show active" id="ads-tab-pane" role="tabpanel" aria-labelledby="ads-tab">
                    <div class="container mt-5">
                        <form id="createWhatsappTaskForm" method="POST" enctype="multipart/form-data">
                            <div class="mb-3">
                                <label for="taskTitle" class="form-label">Ads Title</label>
                                <input type="text" class="form-control" name="taskTitle" id="taskTitle" placeholder="e.g., Promote Product on WhatsApp" required>
                            </div>
                            <div class="mb-3">
                                <label for="taskDescription" class="form-label">Ads Given By</label>
                               <input type="text" class="form-control" name="taskDescription" id="taskDescription" rows="4" placeholder="Describe what the user should do..." required>
                            </div>
                            <div class="mb-3">
                                <label for="uploadMedia" class="form-label">Upload Media (Image or Video)</label>
                                <input class="form-control" type="file" name="uploadMedia" id="uploadMedia" accept="image/*,video/*" required>
                            </div>
                            <div class="text-center">
                                <button type="submit" class="btn btn-primary">Post</button>
                            </div>
                        </form>
                    </div>
                </div>
                <?php
                    // Process the form if submitted
                    if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_FILES["uploadMedia"])) {
                        $title = mysqli_real_escape_string($conn, $_POST['taskTitle']);
                        $description = mysqli_real_escape_string($conn, $_POST['taskDescription']);

                        $uploadDir = "../Media/Ads_Management/";
                        if (!is_dir($uploadDir)) {
                            mkdir($uploadDir, 0777, true);
                        }

                        $fileName = basename($_FILES["uploadMedia"]["name"]);
                        $targetFilePath = $uploadDir . time() . "_" . $fileName;
                        $fileType = strtolower(pathinfo($targetFilePath, PATHINFO_EXTENSION));
                        $allowedTypes = ["jpg", "jpeg", "png", "gif", "mp4", "mov", "avi", "webp"];

                        if (in_array($fileType, $allowedTypes)) {
                            if (move_uploaded_file($_FILES["uploadMedia"]["tmp_name"], $targetFilePath)) {
                                $insertSql = "INSERT INTO ads_management (ads_head, ads_comp, file_url) 
                                            VALUES ('$title', '$description','$targetFilePath')";
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
                                    echo '<script>window.location.href = "ads_management.php";</script>';
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
                    }
                ?>


              <!-- App Task Panel -->
                <div class="tab-pane fade" id="manage-ads-tab-pane" role="tabpanel" aria-labelledby="manage-ads-tab">
                   <div class="container mt-5">
                        <table class="table table-bordered table-striped">
                            <thead class="thead-dark">
                                <tr>
                                    <th>Id</th>
                                    <th>Advadisment Name</th>
                                    <th>Given Vendor</th>
                                    <th>PostedOn</th>
                                    <th>View</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                     <?php
                // Check for delete_id GET param and show alert
                if (isset($_GET['delete_id'])) {
                    $deleteId = intval($_GET['delete_id']);
                    echo "<script>alert('Are you sure? Want to delete.');</script>";
                      
                    $deleteSql = "DELETE FROM `ads_management` WHERE id = $deleteId;";
                    $result= mysqli_query($conn, $deleteSql);
                    echo '<script>window.location.href = "ads_management.php?tab=manage-ads";</script>';
                  exit();
                }

                // Then display your table rows
                $selectSql = "SELECT * FROM `ads_management` ORDER BY `created_at` DESC;";
                $result = mysqli_query($conn, $selectSql);

                if (mysqli_num_rows($result) > 0) {
                    while ($row = mysqli_fetch_assoc($result)) {
                        echo "<tr>";
                        echo "<td>W" . str_pad($row["id"], 3, "0", STR_PAD_LEFT) . "</td>";
                        echo "<td>" . $row["ads_head"] . "</td>";
                        echo "<td>" . $row["ads_comp"] . "</td>";
                        echo "<td>" . $row["created_at"] . "</td>";
                        echo "<td><a href='" . $row["file_url"] . "' target='_blank'>View File</a></td>";
                        // Change Delete button to a link that reloads page with delete_id param
                        echo "<td><a href='?delete_id=" . $row["id"] . "' class='btn btn-danger btn-sm'>Delete</a></td>";
                        echo "</tr>";
                    }
                } else {
                    echo "<tr><td colspan='6'>No tasks found</td></tr>";
                }

                mysqli_close($conn);
                ?>

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </main><!-- End #main -->

    <?php
    require_once("../resources/footer.php");
    require_once("../resources/footer_links.php");
    ?>

</body>
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const activeTab = params.get("tab");

    if (activeTab === "manage-ads") {
      // Bootstrap 5: find the tab trigger that opens this tab pane
      const tabTrigger = document.querySelector('[data-bs-target="#manage-ads-tab-pane"]');

      if (tabTrigger) {
        // Create and show the tab
        const tab = new bootstrap.Tab(tabTrigger);
        tab.show();
      }
    }
  });
</script>

</html>
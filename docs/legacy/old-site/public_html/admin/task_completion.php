<?php
require_once("../resources/connection_build.php");
require_once("../resources/check_login.php");
require_once("../resources/function.php");
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <title>Task Management</title>

    <?php require_once("../resources/header_links.php"); ?>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
</head>

<body>

    <?php
    require_once("resources/header.php");
    require_once("resources/sidebar.php");
    ?>
    <main id="main" class="main">

        <div class="pagetitle">
            <h1>Task Management</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item active">Task Management</li>
                </ol>
            </nav>
        </div><!-- End Page Title -->

        <section class="section dashboard">
            <!-- Nav tabs -->
            <ul class="nav nav-tabs" id="dashboardTabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="whatsapp-comp-tab" data-bs-toggle="tab" data-bs-target="#whatsapp-comp-tab-pane" type="button" role="tab">
                        <i class="bi bi-file-earmark-arrow-down fs-5" style="color:blue;"></i>
                        Whatsapp Task Completion
                    </button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="app-comp-tab" data-bs-toggle="tab" data-bs-target="#app-comp-tab-pane" type="button" role="tab">
                        <i class="bi bi-file-earmark-arrow-down fs-5" style="color:blue;"></i>
                        App Task Completion
                    </button>
                </li>
            </ul>

            <!-- Tab panes -->
            <div class="tab-content">
                <!-- WhatsApp Task Completion Panel -->
                <div class="tab-pane fade show active" id="whatsapp-comp-tab-pane" role="tabpanel">
                    <div class="container mt-5">
                        <table class="table table-bordered table-striped">
                            <?php
                            $query = "SELECT wt.task_id, wt.task_head, wt.task_amount, wt.Created_at,
                                             COUNT(DISTINCT cwt.agent_id) AS num_completions
                                      FROM whatsapp_tasks wt
                                      LEFT JOIN completed_whatsapp_task cwt 
                                             ON cwt.task_id = wt.task_id
                                      GROUP BY wt.task_id, wt.task_head, wt.task_amount, wt.Created_at";
                            $result = mysqli_query($conn, $query);
                            ?>
                            <thead class="thead-dark">
                                <tr>
                                    <th>TaskId</th>
                                    <th>TaskName</th>
                                    <th>TaskAmount</th>
                                    <th>PostedOn</th>
                                    <th>NumberOfCompletions</th>
                                    <th>ViewCompletedUsers</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (mysqli_num_rows($result) > 0): ?>
                                    <?php while ($row = mysqli_fetch_assoc($result)): ?>
                                        <tr>
                                            <td><?= htmlspecialchars($row['task_id']); ?></td>
                                            <td><?= htmlspecialchars($row['task_head']); ?></td>
                                            <td><?= htmlspecialchars($row['task_amount']); ?></td>
                                            <td><?= htmlspecialchars($row['Created_at']); ?></td>
                                            <td><?= htmlspecialchars($row['num_completions']); ?></td>
                                            <td>
                                                <button class="btn btn-primary btn-sm view-users" 
                                                        data-task-id="<?= $row['task_id']; ?>" 
                                                        data-task-type="whatsapp">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    <?php endwhile; ?>
                                <?php else: ?>
                                    <tr><td colspan="6" class="text-center">No tasks found.</td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- App Task Completion Panel -->
                <div class="tab-pane fade" id="app-comp-tab-pane" role="tabpanel">
                    <div class="container mt-5">
                        <table class="table table-bordered table-striped">
                            <?php
                            $query = "SELECT wt.id, wt.task_head, wt.task_amount, wt.Created_at,
                                             COUNT(DISTINCT cwt.agent_id) AS num_completions
                                      FROM app_task wt
                                      LEFT JOIN completed_app_task cwt 
                                             ON cwt.task_id = wt.id
                                      GROUP BY wt.id, wt.task_head, wt.task_amount, wt.Created_at";
                            $result = mysqli_query($conn, $query);
                            ?>
                            <thead class="thead-dark">
                                <tr>
                                    <th>TaskId</th>
                                    <th>TaskName</th>
                                    <th>TaskAmount</th>
                                    <th>PostedOn</th>
                                    <th>NumberOfCompletions</th>
                                    <th>ViewCompletedUsers</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if (mysqli_num_rows($result) > 0): ?>
                                    <?php while ($row = mysqli_fetch_assoc($result)): ?>
                                        <tr>
                                            <td><?= htmlspecialchars($row['id']); ?></td>
                                            <td><?= htmlspecialchars($row['task_head']); ?></td>
                                            <td><?= htmlspecialchars($row['task_amount']); ?></td>
                                            <td><?= htmlspecialchars($row['Created_at']); ?></td>
                                            <td><?= htmlspecialchars($row['num_completions']); ?></td>
                                            <td>
                                                <button class="btn btn-primary btn-sm view-users" 
                                                        data-task-id="<?= $row['id']; ?>" 
                                                        data-task-type="app">
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    <?php endwhile; ?>
                                <?php else: ?>
                                    <tr><td colspan="6" class="text-center">No tasks found.</td></tr>
                                <?php endif; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    </main><!-- End #main -->

    <!-- Full Page Modal -->
    <div class="modal fade" id="completedUsersModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Completed Users</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div id="completedUsersContent" class="table-responsive">
                        <p class="text-center">Loading...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <?php
    require_once("../resources/footer.php");
    require_once("../resources/footer_links.php");
    ?>

    <script>
        $(document).ready(function () {
            $(".view-users").on("click", function () {
                var taskId = $(this).data("task-id");
                var taskType = $(this).data("task-type");

                $("#completedUsersContent").html("<p class='text-center'>Loading...</p>");
                $("#completedUsersModal").modal("show");

                $.ajax({
                    url: "load_completed_users.php",
                    type: "GET",
                    data: { task_id: taskId, task_type: taskType },
                    success: function (response) {
                        $("#completedUsersContent").html(response);
                    },
                    error: function () {
                        $("#completedUsersContent").html("<p class='text-danger text-center'>Failed to load data.</p>");
                    }
                });
            });
        });
    </script>

</body>
</html>

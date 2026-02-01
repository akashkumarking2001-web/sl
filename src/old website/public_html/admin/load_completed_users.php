<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once("../resources/connection_build.php");
require_once("../resources/check_login.php");

// --- Fetch Task Data ---
if (!isset($_GET['task_id']) || !isset($_GET['task_type'])) {
    die("<p class='text-danger'>Invalid Request</p>");
}

$task_id = intval($_GET['task_id']);
$task_type = $_GET['task_type'];

// Pick correct table
if ($task_type == "whatsapp") {
    $table = "completed_whatsapp_task";
    $table2 = "whatsapp_tasks";
    $query = "
   SELECT cwt.task_id, wt.task_head, wt.task_amount, cwt.agent_id, cwt.payment_status, 
          GROUP_CONCAT(cwt.file_path ORDER BY cwt.uploaded_at SEPARATOR ',') AS file_paths, 
          GROUP_CONCAT(cwt.uploaded_at ORDER BY cwt.uploaded_at SEPARATOR ',') AS uploaded_times 
   FROM $table cwt
   INNER JOIN $table2 wt ON cwt.task_id = wt.task_id 
   WHERE cwt.task_id = $task_id 
   GROUP BY cwt.task_id, cwt.agent_id 
   ORDER BY cwt.payment_status ASC, cwt.uploaded_at ASC;
";
} elseif ($task_type == "app") {
    $table = "completed_app_task";
    $table2 = "app_task";
    $query = "
   SELECT cwt.task_id, wt.task_head, wt.task_amount, cwt.agent_id, cwt.payment_status, 
          GROUP_CONCAT(cwt.file_path ORDER BY cwt.uploaded_at SEPARATOR ',') AS file_paths, 
          GROUP_CONCAT(cwt.uploaded_at ORDER BY cwt.uploaded_at SEPARATOR ',') AS uploaded_times 
   FROM $table cwt
   INNER JOIN $table2 wt ON cwt.task_id = wt.id 
   WHERE cwt.task_id = $task_id 
   GROUP BY cwt.task_id, cwt.agent_id 
   ORDER BY cwt.payment_status ASC, cwt.uploaded_at ASC;
";
} else {
    die("<p class='text-danger'>Invalid Task Type</p>");
}

$result = mysqli_query($conn, $query);
$num_rows = mysqli_num_rows($result);
?>

<!-- Table Section -->
<div id="taskTableWrapper">
    <table class="table table-bordered table-striped">
        <thead>
            <tr>
                <th>Task Name</th>
                <th>Task amount</th>
                <th>Agent ID</th>
                <th>Files</th>
                <th>Uploaded Times</th>
                <th>Payment</th>
            </tr>
        </thead>
        <tbody>
            <?php if ($num_rows > 0): ?>
                <?php while ($row = mysqli_fetch_assoc($result)): ?>
                    <?php 
                        $filePaths = explode(",", $row['file_paths']);
                        $uploadTimes = explode(",", $row['uploaded_times']);

                        // Apply validation only if whatsapp
                        $valid_submission = true;
                        if ($task_type == "whatsapp") {
                            $valid_submission = (count($filePaths) == 2 && count($uploadTimes) == 2);
                        }
                    ?>
                    <tr>
                        <td><?= htmlspecialchars($row['task_head']); ?></td>
                        <td><?= htmlspecialchars($row['task_amount']); ?></td>
                        <td><?= htmlspecialchars($row['agent_id']); ?></td>
                        <td>
                            <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
                                <?php foreach ($filePaths as $index => $path): ?>
                                    <?php 
                                        $filePath = "../" . htmlspecialchars($path);
                                        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
                                    ?>
                                    <div style="flex:0 0 auto;">
                                        <?php if (in_array($ext, ['jpg','jpeg','png','gif','webp'])): ?>
                                            <img src="<?= $filePath ?>" 
                                                 alt="Uploaded File" 
                                                 style="max-width:150px; max-height:100px; object-fit:cover;">
                                        <?php elseif ($ext == 'pdf'): ?>
                                            <iframe src="<?= $filePath ?>" 
                                                    style="width:150px; height:100px; border:none;"></iframe>
                                        <?php else: ?>
                                            <a href="<?= $filePath ?>" target="_blank">View File</a>
                                        <?php endif; ?>
                                    </div>
                                <?php endforeach; ?>
                            </div>
                        </td>
                        <td>
                            <?php foreach ($uploadTimes as $time): ?>
                                <div><?= htmlspecialchars($time); ?></div>
                            <?php endforeach; ?>
                        </td>
                        <td>
                            <?php if ($row['payment_status'] == 0): ?>
                                <?php if ($valid_submission): ?>
                                    <!-- Enable Approve button -->
                                    <button type="button" 
                                            class="btn btn-primary btn-sm approve-btn"
                                            data-task-id="<?= $row['task_id']; ?>"
                                            data-task-type="<?= $task_type; ?>"
                                            data-task-amount="<?= $row['task_amount']; ?>"
                                            data-agent-id="<?= $row['agent_id']; ?>">
                                        Approve Payment
                                    </button>
                                <?php else: ?>
                                    <!-- Disabled Pending Button -->
                                    <button type="button" class="btn btn-secondary btn-sm" disabled>
                                        Submission Pending
                                    </button>
                                <?php endif; ?>
                            <?php else: ?>
                                <span class="badge bg-success">Payment Approved</span>
                            <?php endif; ?>
                        </td>
                    </tr>
                <?php endwhile; ?>
            <?php else: ?>
                <tr><td colspan="6" class="text-center">No users found.</td></tr>
            <?php endif; ?>
        </tbody>
    </table>
</div>

<script>
// Handle Approve Payment with AJAX
document.querySelectorAll('.approve-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        let task_id = this.getAttribute('data-task-id');
        let task_type = this.getAttribute('data-task-type');
        let agent_id = this.getAttribute('data-agent-id');
        let task_amount = this.getAttribute('data-task-amount');
        let currentBtn = this;

        fetch("approve_payment.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: "approve_payment=1&task_id=" + task_id + "&task_type=" + task_type + "&agent_id=" + agent_id + "&task_amount=" + task_amount
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                // ✅ Show success popup
                let popup = document.createElement('div');
                popup.innerHTML = data.message;
                popup.style.position = 'fixed';
                popup.style.top = '50%';
                popup.style.left = '50%';
                popup.style.transform = 'translate(-50%, -50%)';
                popup.style.background = '#28a745';
                popup.style.color = '#fff';
                popup.style.padding = '12px 20px';
                popup.style.borderRadius = '8px';
                popup.style.fontSize = '16px';
                popup.style.zIndex = '9999';
                document.body.appendChild(popup);

                setTimeout(() => { popup.remove(); }, 1000);

                // ✅ Update button -> show Payment Approved badge
                currentBtn.outerHTML = '<span class="badge bg-success">Payment Approved</span>';
            } else {
                alert("❌ " + data.message);
            }
        })
        .catch(err => console.error(err));
    });
});
</script>

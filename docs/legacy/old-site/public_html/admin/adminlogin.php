<?php
session_start();

$error = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $agent_id = trim($_POST['username']);
    $agent_password = trim($_POST['password']);

    // Fixed login details
    $valid_id   = "214748";
    $valid_pass = "admin222";

    // You can hash password if needed (for now just plain check)
    $hash_pass = $valid_pass; 

    if ($agent_id == $valid_id) {
        if ($agent_password == $hash_pass) {
            $_SESSION['sess_id'] = session_id();
            $_SESSION['my_id']   = $agent_id;
            $_SESSION['pass']    = $agent_password;

            header("Location: ./index.php");
            exit();
        } else {
            $_SESSION['error'] = "not_valid";
            header("Location: ./adminlogin.php");
            exit();
        }
    } else {
        $_SESSION['error'] = "not_valid";
        header("Location: ./adminlogin.php");
        exit();
    }
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Admin Login</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex justify-content-center align-items-center vh-100">

<div class="card shadow p-4" style="width: 350px; border-radius: 15px;">
    <h4 class="text-center mb-3">🔐 Admin Login</h4>

    <?php if (isset($_SESSION['error']) && $_SESSION['error'] == "not_valid"): ?>
        <div class="alert alert-danger text-center py-2">Invalid Username or Password!</div>
        <?php unset($_SESSION['error']); ?>
    <?php endif; ?>

    <form method="post" action="">
        <div class="mb-3">
            <label class="form-label">Username</label>
            <input type="text" name="username" class="form-control" placeholder="Enter Username" required>
        </div>

        <div class="mb-3">
            <label class="form-label">Password</label>
            <input type="password" name="password" class="form-control" placeholder="Enter Password" required>
        </div>

        <button type="submit" class="btn btn-primary w-100">Login</button>
    </form>
</div>

</body>
</html>

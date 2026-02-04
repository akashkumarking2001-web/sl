<?php
require_once("resources/connection_build.php");
require_once("resources/check_login.php");
require_once("resources/function.php")
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <title>More Income</title>
    <style>
        #more_income_form:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
  }
    </style>
    <?php require_once("resources/header_links.php"); ?>
</head>
<body>

    <?php
    require_once("resources/header.php");
    // ======= Sidebar =======
    require_once("resources/sidebar.php");
    ?>
    <main id="main" class="main">

        <div class="pagetitle">
            <h1>Apply For More Income</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item active">More Income</li>
                </ol>
            </nav>
        </div><!-- End Page Title -->

        <section class="section dashboard">
            <div class="container d-flex justify-content-center align-items-center">
                <form method="POST" action="" class="w-100 w-sm-100 w-md-75 w-lg-50 p-4 shadow-lg rounded-4 bg-blue border" id="more_income_form">
                    <div class="row mb-3">
                        <div class="col-12">
                            <label for="inputUserID" class="form-label">UserID</label>
                            <input type="text" class="form-control" required id="UserID" name="UserID" pattern="[0-9]{6}" placeholder="3T-UserID">
                            <div id="userIDError" class="text-danger mt-1" style="display: none;"></div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-12">
                            <label for="inputName" class="form-label">Name</label>
                            <input type="text" class="form-control" id="UserName" required name="UserName" placeholder="User Name">
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-12">
                            <label for="inputMobile" class="form-label">Mobile</label>
                            <input type="number" class="form-control" id="MobileNumber" required name="MobileNumber" pattern="[0-9]{10}" placeholder="Mobile Number">
                        </div>
                        </div>
                        <div class="row mb-3">
                        <div class="col-12">
                            <label for="inputDescription" class="form-label">Description</label>
                            <input type="text" class="form-control" id="Description" required name="Description" placeholder="Task You Need">
                        </div>
                        </div>
                        <div class="row mb-3">
                        <div class="col-12 d-flex justify-content-center">
                            <button type="submit" class="btn btn-primary">Submit</button>
                        </div>
                    </div>
                </form>
            </div>
        </section>

    </main><!-- End #main -->
    <?php
        if ($_SERVER['REQUEST_METHOD'] == 'POST') {
            // Sanitize input
            $userID = mysqli_real_escape_string($conn, $_POST['UserID']);
            $userName = mysqli_real_escape_string($conn, $_POST['UserName']);
            $mobile = mysqli_real_escape_string($conn, $_POST['MobileNumber']);
            $description_request = mysqli_real_escape_string($conn, $_POST['Description']);

            if (check_valid_user_id($userID)) {
                $insertSql = "INSERT INTO more_income_requests (agent_id, agent_name, mobile, description_request) VALUES ('$userID', '$userName', '$mobile', '$description_request')";
                if (mysqli_query($conn, $insertSql)) {
                    echo "<div class='alert alert-success text-center'>Application submitted successfully! We will get back you soon...!</div>";
                } else {
                    echo "<div class='alert alert-danger text-center'>Error: " . mysqli_error($conn) . "</div>";
                }
            } 
            else {
            $errorMessage = "User does not exist.!";
            echo "<script>
                const errorDiv = document.getElementById('userIDError');
                if (errorDiv) {
                    errorDiv.textContent = '" . addslashes($errorMessage) . "';
                    errorDiv.style.display = 'block';
                }
            </script>";
        }
        }

    ?>
    <?php
    
    require_once("resources/footer.php");
    require_once("resources/footer_links.php");
    ?>

</body>

</html>
<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <title>Register</title>
    <?php require_once("./resources/header_links.php"); ?>
</head>

<body style="background-image: url('./assets/img/back.jpg');">

    <main>
        <div class="container">

            <section class="section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4">
                <div class="container">
                    <div class="row justify-content-center">
                        <div class="col-lg-4 col-md-6 d-flex flex-column align-items-center justify-content-center">

                            <div class="d-flex justify-content-center py-4">
                                <a href="index.php" class="logo d-flex align-items-center w-auto">
                                    <img src="assets/img/logo.png" alt="">
                                    <span class="d-none d-lg-block">MoneyWorld</span>
                                </a>
                            </div><!-- End Logo -->

                            <div class="card mb-3">

                                <div class="card-body">

                                    <div class="pt-4 pb-2">
                                        <h5 class="card-title text-center pb-0 fs-4">Create an Account</h5>
                                        <p class="text-center small">Enter your personal details to create account</p>
                                    </div>

                                    <?php
                                    if (isset($_SESSION['error']) && !isset($_SESSION['reg'])) {
                                    ?>
                                        <div class="alert alert-danger">
                                            <?php
                                            if ($_SESSION['error'] == 'SPS') {
                                                echo "Sponser ID not Valid";
                                            } elseif ($_SESSION['error'] == 'Mobile') {
                                                echo "Mobile Number is already used";
                                            } elseif ($_SESSION['error'] == 'Email') {
                                                echo "Email already used";
                                            } else {
                                                echo "Something went Wrong Try again";
                                            }
                                            ?>
                                        </div>
                                    <?php
                                        unset($_SESSION['error']);
                                    }
                                    elseif (isset($_SESSION['reg'])) {
                                    ?>
                                        <div class="alert alert-success">
                                        Your registration successful 
                                        Please verify your email ID and upgrade the packages to enjoy your life
                                        <br>
                                        <?php
                                            echo "Agent ID : 3T{$_SESSION['agent_id']} <br> Name : {$_SESSION['Name']} <br> Gmail ID : {$_SESSION['email']}";
                                        ?>
                                        <br>
                                        kindly request must join the official telegram channel to get updates immediately <a href="https://t.me/TTTMONEYWOULDOFFICIAL">Click here</a>
                                            <?php        
                                            unset($_SESSION['agent_id']);
                                            unset($_SESSION['Name']);
                                            unset($_SESSION['email']);
                                            ?>
                                        </div>
                                    <?php
                                        unset($_SESSION['reg']);
                                        unset($_SESSION['error']);
                                    }
                                    ?>
                                   

                                    <form class="row g-3 needs-validation" action="request_handler.php" method="post" novalidate>
                                        <div class="col-12">
                                            <!-- <label for="yourName" class="form-label">Sponsor ID</label> -->
                                            <div class="input-group has-validation">
                                                <span class="input-group-text" id="inputGroupPrepend">3T</span>
                                                <input type="text" class="form-control" placeholder="Sponsor ID" name="sps_id" id="sps_id" value="<?php if(isset($_GET['sps_id'])) { echo($_GET['sps_id']); } ?>" pattern="[0-9]{6}" >
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <!-- <label for="yourEmail" class="form-label">Your Name</label> -->
                                            <input type="text" class="form-control" placeholder="Your Name" name="username" required>
                                            <div class="invalid-feedback">Please enter name.</div>
                                        </div>

                                        <div class="col-12">
                                            <!-- <label for="yourEmail" class="form-label">Your Name</label> -->
                                            <input type="email" name="user_email" class="form-control" placeholder="Your Email" id="yourEmail" required>
                                            <div class="invalid-feedback">Please enter a valid Email adddress!</div>
                                        </div>

                                        <div class="col-12">
                                            <!-- <label for="yourUsername" class="form-label">Mobile</label> -->
                                            <div class="input-group has-validation">
                                                <input type="phone" name="user_mob" placeholder="Mobile" class="form-control" required>
                                                <div class="invalid-feedback">Please choose a username.</div>
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <!-- <label for="yourPassword" class="form-label">Password</label> -->
                                            <input type="password" class="form-control" placeholder="Password" name="user_password" required>
                                            <div class="invalid-feedback">Please enter your password!</div>
                                        </div>

                                        <div class="col-12">
                                            <div class="form-check">
                                                <input class="form-check-input" name="terms" type="checkbox" value="" id="acceptTerms" required>
                                                <label class="form-check-label" for="acceptTerms">I agree and accept the <a href="conditions.php">terms and conditions</a></label>
                                                <div class="invalid-feedback">You must agree before submitting.</div>
                                            </div>
                                        </div>
                                        <div class="col-12">
                                            <button class="btn btn-primary w-100" type="submit" name="register_btn">Create Account</button>
                                        </div>
                                        <div class="col-12">
                                            <p class="small mb-0">Already have an account? <a href="login.php">Log in</a></p>
                                        </div>
                                    </form>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </section>

        </div>
    </main><!-- End #main -->

    <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>

    <!-- Vendor JS Files -->
    <script src="assets/vendor/apexcharts/apexcharts.min.js"></script>
    <script src="assets/vendor/bootstrap/js/bootstrap.bundle.min.js"></script>
    <script src="assets/vendor/chart.js/chart.min.js"></script>
    <script src="assets/vendor/echarts/echarts.min.js"></script>
    <script src="assets/vendor/quill/quill.min.js"></script>
    <script src="assets/vendor/simple-datatables/simple-datatables.js"></script>
    <script src="assets/vendor/tinymce/tinymce.min.js"></script>
    <script src="assets/vendor/php-email-form/validate.js"></script>

    <!-- Template Main JS File -->
    <script src="assets/js/main.js"></script>

</body>

</html>
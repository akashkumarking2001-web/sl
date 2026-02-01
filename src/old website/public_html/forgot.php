<?php
session_start();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <title>Forgot Password</title>

    <?php
    require_once("resources/header_links.php");
    ?>
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
                                    <img src="assets/img/logo.png" alt="AS">
                                    <span class="d-none d-lg-block">MoneyWorld</span>
                                </a>
                            </div><!-- End Logo -->

                            <div class="card mb-3">

                                <div class="card-body">

                                    <div class="pt-4 pb-2">
                                        <h5 class="card-title text-center pb-0 fs-4">Login to Your Account</h5>
                                        <p class="text-center small">Enter your agentID & password to login</p>
                                    </div>

                                    <?php
                                    if (isset($_SESSION['error'])) {
                                    ?>
                                        <div class="alert alert-primary alert-dismissible fade show" role="alert">
                                            <?php
                                            if ($_SESSION['error'] == 'mail_send') {
                                                echo "Mail send successfully check your mail";
                                            } else {
                                                echo "Email Invalid";
                                            }
                                            ?>
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
                                    <?php
                                        unset($_SESSION['error']);
                                    }
                                    ?>
                                    <form class="row g-3 needs-validation" action="request_handler.php" method="post" novalidate>

                                        <div class="col-12">
                                            <label for="yourUsername" class="form-label">EMail ID</label>
                                            <div class="input-group has-validation">
                                                <input type="email" class="form-control" id="yourUsername" name="email" required>
                                                <div class="invalid-feedback">Please enter your EMail ID.</div>
                                            </div>
                                        </div>

                                        <div class="col-12">
                                            <button class="btn btn-primary w-100" name="forgot_btn" type="submit">Forgot Password</button>
                                        </div>
                                        <div class="col-12">
                                            <p class="small mb-0">Don't have account? <a href="register.php">Create an account</a></p>
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

    <?php require_once("resources/footer_links.php"); ?>
</body>

</html>
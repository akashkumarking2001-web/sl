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

    <title>Withdrawal</title>

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
            <h1>Withdrawal</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item">Wallet</li>
                    <li class="breadcrumb-item active">Withdrawal</li>
                </ol>
            </nav>
        </div><!-- End Page Title -->

        <section class="section dashboard">
            <div class="row">
                <div class="col-lg-6">

                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">INR Withdrawal</h5>
                            <?php
                            if (isset($_SESSION['status'])) {
                                if ($_SESSION['status'] == 4) {
                            ?>
                                    <div class="alert alert-primary bg-primary text-light border-0 alert-dismissible fade show" role="alert">
                                        Your withdrawal success payment received within 10 minutes or maximum 7 days
                                        <a style="color: orange;" href="withdrawal_history.php">click hear</a> to track.
                                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                <?php
                                } elseif ($_SESSION['status'] == 5) {
                                ?>
                                    <div class="alert alert-primary bg-primary text-light border-0 alert-dismissible fade show" role="alert">
                                        <a href="./profile.php" class="alert-link">click here</a>. add your bank details.
                                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                <?php
                                } else {
                                ?>
                                    <div class="alert alert-primary bg-danger text-light border-0 alert-dismissible fade show" role="alert">
                                        WITHDRAWAL ON PROCESS..Try Again Later...
                                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                            <?php
                                }

                                unset($_SESSION['status']);
                            }
                            ?>
                             Withdrawal Form 
                            <form action="request_handler.php" method="POST">
                                <div class="row mb-3">
                                    <label for="inputEmail3" class="col-sm-4 col-form-label">Agent ID</label>
                                    <div class="input-group col-sm-10">
                                        <span class="input-group-text" id="inputGroupPrepend">3T</span>
                                        <input type="text" id="yourUsername" name="user_id" value="<?php echo $my_id; ?>" class="form-control" readonly>
                                    </div>
                                </div>
                                <?php
                                $amount = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$my_id'"));
                                ?>
                                <div class="row mb-3">
                                    <label for="inputEmail3" class="col-sm-5 col-form-label">Balance</label>
                                    <div class="col-sm-12">
                                        <input type="text" class="form-control" id="inputEmail" value="<?php echo $amount['wallet'];?>.00" readonly>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="inputPassword3" class="col-sm-8 col-form-label">Withdrawal Amount</label>
                                    <div class="col-sm-12">
                                        <input type="number" class="form-control" id="inputPassword" name="amount" min="200" step="100" max="10000" class="form-control" required>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button type="submit" class="btn btn-primary" name="withdrawal_btn">Submit</button>
                                    <button type="reset" class="btn btn-secondary">Reset</button>
                                </div>
                            </form><!-- End Horizontal Form -->
                            <p>Minimum Withdrawal 200Rs <br> 24×7 withdrawal available <br> Monday - Sunday <br> Your withdrawal payment received within 10 minutes or maximum 7 working days</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6">

                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">USDT Withdrawal 1USDT = 85INR</h5>
                             Withdrawal Form 
                            <form action="request_handler.php" method="POST">
                                <div class="row mb-3">
                                    <label for="inputEmail3" class="col-sm-4 col-form-label">Agent ID</label>
                                    <div class="input-group col-sm-10">
                                        <span class="input-group-text" id="inputGroupPrepend">3T</span>
                                        <input type="text" id="yourUsername" name="user_id" value="<?php echo $my_id; ?>" class="form-control" readonly>
                                    </div>
                                </div>
                                <?php
                                $amount = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$my_id'"));
                                $amt = $amount['wallet']/85;
                                ?>
                                <div class="row mb-3">
                                    <label for="inputEmail3" class="col-sm-5 col-form-label">Balance</label>
                                    <div class="col-sm-12">
                                        <input type="text" class="form-control" id="inputEmail" value="<?php echo $amt; ?> USDT" readonly>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="inputPassword3" class="col-sm-8 col-form-label">Withdrawal Amount</label>
                                    <div class="col-sm-12">
                                        <input type="number" class="form-control" id="inputPassword" name="amount" min="10" step="1" max="100" class="form-control" required>
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button type="submit" class="btn btn-primary" name="usdt_withdrawal">Submit</button>
                                    <button type="reset" class="btn btn-secondary">Reset</button>
                                </div>
                            </form><!-- End Horizontal Form -->
                            <p>Minimum Withdrawal 10 USDT <br> 24×7 withdrawal available <br> Monday - Sunday <br> Your withdrawal payment received within 10 minutes or maximum 7 working days</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </main><!-- End #main -->

    <?php
    require_once("resources/footer.php");
    require_once("resources/footer_links.php");
    ?>

</body>

</html>
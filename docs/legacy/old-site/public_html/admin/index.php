<?php
require_once("../resources/connection_build.php");
require_once("../resources/check_login_agent.php");
require_once("../resources/function.php")
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <title>Dashboard</title>

    <?php require_once("../resources/header_links.php"); ?>
</head>

<body>

    <?php require_once("resources/header.php"); ?>
    <!-- ======= Sidebar ======= -->
    <?php require_once("resources/sidebar.php"); ?>
    <main id="main" class="main">

        <div class="pagetitle">
            <h1>Dashboard</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item active">Dashboard</li>
                </ol>
            </nav>
        </div><!-- End Page Title -->

        <section class="section dashboard">
            <div class="row">
                <!-- Left side columns -->
                <div class="col-lg-12">
                    <div class="row">
                        <!-- totel registration Card -->
                        <?php
                        $agent_coungt_data = mysqli_fetch_array(mysqli_query($conn, "SELECT count(agent_id) total_agent FROM `agent`"));
                        ?>
                        <div class="col-xxl-4 col-md-4">
                            <div class="card info-card sales-card">
                                <div class="card-body">
                                    <h5 class="card-title">Registration <span>| Totel</span></h5>

                                    <div class="d-flex align-items-center">
                                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i class="bi bi-people"></i>
                                        </div>
                                        <div class="ps-3">
                                            <h6><?php echo $agent_coungt_data['total_agent'] ?></h6>
                                            <span class="text-success small pt-1 fw-bold">Users</span> <span class="text-muted small pt-2 ps-1"></span>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- totel active agent Card -->
                        <?php
                            $agent_coungt_data = mysqli_fetch_array(mysqli_query($conn, "SELECT count(agent_id) total_agent FROM `agent` WHERE `status` = '1'"));
                        ?>
                        <div class="col-xxl-4 col-md-4">
                            <div class="card info-card revenue-card">
                                <div class="card-body">
                                    <h5 class="card-title">Agent <span>| Active</span></h5>

                                    <div class="d-flex align-items-center">
                                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i class="bi bi-people"></i>
                                        </div>
                                        <div class="ps-3">
                                            <h6><?php echo $agent_coungt_data['total_agent'] ?></h6>
                                            <span class="text-success small pt-1 fw-bold">Agent</span> <span class="text-muted small pt-2 ps-1"></span>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <!-- totel inactive agent Card -->
                        <?php
                            $agent_coungt_data = mysqli_fetch_array(mysqli_query($conn, "SELECT count(agent_id) total_agent FROM `agent` WHERE `status` = '0'"));
                        ?>
                        <div class="col-xxl-4 col-md-4">
                            <div class="card info-card customers-card">

                                <div class="card-body">
                                    <h5 class="card-title">User <span>| Inactive</span></h5>

                                    <div class="d-flex align-items-center">
                                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i class="bi bi-people"></i>
                                        </div>
                                        <div class="ps-3">
                                            <h6><?php echo $agent_coungt_data['total_agent'] ?></h6>
                                            <span class="text-danger small pt-1 fw-bold">User</span> <span class="text-muted small pt-2 ps-1"></span>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        
                        <!-- balance Card -->
                        <?php
                            $agent_coungt_data_w = mysqli_fetch_array(mysqli_query($conn, "SELECT SUM(wallet) wallet FROM `agent_income`"));
                        ?>
                        <div class="col-xxl-4 col-md-4">
                            <div class="card info-card revenue-card">
                                <div class="card-body">
                                    <h5 class="card-title">Wallet <span>| balance</span></h5>

                                    <div class="d-flex align-items-center">
                                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i class="bi bi-currency-dollar"></i>
                                        </div>
                                        <div class="ps-3">
                                            <h6>₹<?php echo $agent_coungt_data_w['wallet']; ?></h6>
                                            <span class="text-success small pt-1 fw-bold">Amount</span> <span class="text-muted small pt-2 ps-1"></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- totel income Card -->
                        <?php
                            $income_data = mysqli_fetch_array(mysqli_query($conn, "SELECT SUM(amt) income FROM `wallet_history` WHERE `status` = '0' and `desp` != 'Wallet Recharge'"));
                        ?>
                        <div class="col-xxl-4 col-md-4">
                            <div class="card info-card revenue-card">
                                <div class="card-body">
                                    <h5 class="card-title">Income <span>| totel</span></h5>

                                    <div class="d-flex align-items-center">
                                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i class="bi bi-currency-dollar"></i>
                                        </div>
                                        <div class="ps-3">
                                            <h6>₹<?php echo $income_data['income'] ?></h6>
                                            <span class="text-success small pt-1 fw-bold">Amount</span> <span class="text-muted small pt-2 ps-1"></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- referral income Card -->
                        <?php
                            $ref_income_data = mysqli_fetch_array(mysqli_query($conn, "SELECT sum(amt) ref_income FROM `wallet_history` WHERE `desp` = 'Referral Income'"));
                        ?>
                        <div class="col-xxl-4 col-md-4">
                            <div class="card info-card revenue-card">
                                <div class="card-body">
                                    <h5 class="card-title">Income <span>| referral</span></h5>

                                    <div class="d-flex align-items-center">
                                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i class="bi bi-currency-dollar"></i>
                                        </div>
                                        <div class="ps-3">
                                            <h6>₹<?php echo $ref_income_data['ref_income'] ?></h6>
                                            <span class="text-success small pt-1 fw-bold">Amount</span> <span class="text-muted small pt-2 ps-1"></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- level income Card -->
                        <?php
                            $level_coungt_data = mysqli_fetch_array(mysqli_query($conn, "SELECT SUM(amt) level_income FROM `wallet_history` WHERE `desp` = 'Level Income'"));
                        ?>
                        <div class="col-xxl-4 col-md-4">
                            <div class="card info-card revenue-card">
                                <div class="card-body">
                                    <h5 class="card-title">Income <span>| level</span></h5>

                                    <div class="d-flex align-items-center">
                                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i class="bi bi-currency-dollar"></i>
                                        </div>
                                        <div class="ps-3">
                                            <h6>₹<?php echo $level_coungt_data['level_income'] ?></h6>
                                            <span class="text-success small pt-1 fw-bold">Amount</span> <span class="text-muted small pt-2 ps-1"></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- autopool income Card -->
                        <?php
                            $matrix_coungt_data = mysqli_fetch_array(mysqli_query($conn, "SELECT SUM(amt) matrix_income FROM `wallet_history` WHERE `desp` = 'Global Income'"));
                        ?>
                        <div class="col-xxl-4 col-md-4">
                            <div class="card info-card revenue-card">
                                <div class="card-body">
                                    <h5 class="card-title">Income <span>| Global</span></h5>

                                    <div class="d-flex align-items-center">
                                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i class="bi bi-currency-dollar"></i>
                                        </div>
                                        <div class="ps-3">
                                            <h6>₹<?php echo $matrix_coungt_data['matrix_income'] ?></h6>
                                            <span class="text-success small pt-1 fw-bold">Amount</span> <span class="text-muted small pt-2 ps-1"></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- withdrawal Card -->
                        <?php
                            $withdraw_data = mysqli_fetch_array(mysqli_query($conn, "SELECT SUM(amt) withdraw FROM `wallet_history` WHERE `status` = '1'"));
                        ?>
                        <div class="col-xxl-4 col-md-4">
                            <div class="card info-card customers-card">

                                <div class="card-body">
                                    <h5 class="card-title">Withdrawal <span>| totel</span></h5>

                                    <div class="d-flex align-items-center">
                                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i class="bi bi-currency-dollar"></i>
                                        </div>
                                        <div class="ps-3">
                                            <h6>₹<?php echo $withdraw_data['withdraw'] ?></h6>
                                            <span class="text-danger small pt-1 fw-bold">Amount</span> <span class="text-muted small pt-2 ps-1"></span>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>


            </div>
        </section>

    </main><!-- End #main -->

    <!-- ======= Footer ======= -->
    <?php 
    require_once("../resources/footer.php");
    require_once("../resources/footer_links.php");
    ?>

</body>

</html>
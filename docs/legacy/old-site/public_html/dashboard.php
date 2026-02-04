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

    <title>Dashboard</title>

    <?php require_once("resources/header_links.php"); ?>
</head>
<style>
.card {
  border-radius: 20px !important;
  overflow: hidden;
  background: linear-gradient(135deg, #7b2ff7, #00c6ff); /* Purple to Blue gradient */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease; /* Smooth transition */
}

.card:hover {
  background: linear-gradient(135deg, #9d50bb, #00c9ff); /* Brighter gradient on hover */
  transform: translateY(-5px); /* Subtle lift */
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15); /* Deeper shadow */
}
.card-title{
    color: black;
}
</style>


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
                        $agent_coungt_data = mysqli_fetch_array(mysqli_query($conn, "SELECT count(agent_id) total_agent FROM `agent` WHERE `sponsor_id` = '$my_id'"));
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
                                            <span class="text-black small pt-1 fw-bold">Users</span> <span class="text-black small pt-2 ps-1"></span>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- totel active agent Card -->
                        <?php
                        $agent_coungt_data = mysqli_fetch_array(mysqli_query($conn, "SELECT count(agent_id) total_agent FROM `agent` WHERE `sponsor_id` = '$my_id' && `status` = '1'"));
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
                                            <span class="text-black small pt-1 fw-bold">Agent</span> <span class="text-black small pt-2 ps-1"></span>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <!-- totel inactive agent Card -->
                        <?php
                        $agent_coungt_data = mysqli_fetch_array(mysqli_query($conn, "SELECT count(agent_id) total_agent FROM `agent` WHERE `sponsor_id` = '$my_id' && `status` = '0'"));
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
                                            <span class="text-danger small pt-1 fw-bold">User</span> <span class="text-black small pt-2 ps-1"></span>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>

                        <!-- balance Card -->
                        <?php
                        $agent_coungt_data_w = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id` = '$my_id'"));
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
                                            <span class="text-black small pt-1 fw-bold">Amount</span> <span class="text-black small pt-2 ps-1">$<?php echo $agent_coungt_data_w['wallet']/85; ?></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- auto upgrade Card -->
                        <?php
                        $upgrade = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id` = '$my_id'"));
                        ?>
                        <div class="col-xxl-4 col-md-4">
                            <div class="card info-card revenue-card">
                                <div class="card-body">
                                    <h5 class="card-title">AutoUpgrade <span>| balance</span></h5>

                                    <div class="d-flex align-items-center">
                                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i class="bi bi-currency-dollar"></i>
                                        </div>
                                        <div class="ps-3">
                                            <h6>₹<?php echo $upgrade['upgrade_amt']; ?></h6>
                                            <span class="text-black small pt-1 fw-bold">Amount</span> <span class="text-black small pt-2 ps-1">$<?php echo $upgrade['upgrade_amt']/85; ?></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- totel income Card -->
                        <?php
                        $income_data = mysqli_fetch_array(mysqli_query($conn, "SELECT SUM(amt) income FROM `wallet_history` WHERE `agent_id` = '$my_id' && `status` = '0' && `desp`!='Wallet Recharge'"));
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
                                            <span class="text-black small pt-1 fw-bold">Amount</span> <span class="text-black small pt-2 ps-1">$<?php echo $income_data['income']/85 ?></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                        
                         <!-- Task income Card -->
                         <?php
                        $task_income_data = mysqli_fetch_array(mysqli_query($conn, "select SUM(amount) as total_amount from  `task_income` WHERE agent_id=$my_id"));
                        ?>
                        <div class="col-xxl-4 col-md-4">
                            <div class="card info-card revenue-card">
                                <div class="card-body">
                                    <h5 class="card-title">Task Income <span>| totel</span></h5>

                                    <div class="d-flex align-items-center">
                                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i class="bi bi-currency-dollar"></i>
                                        </div>
                                        <div class="ps-3">
                                            <h6>₹<?php echo $task_income_data['total_amount']; ?></h6>
                                            <span class="text-black small pt-1 fw-bold">Amount</span> 
                                            <span class="text-black small pt-2 ps-1">$<?php echo number_format($task_income_data['total_amount'] / 85, 2); ?></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- referral income Card -->
                        <?php
                        $ref_income_data = mysqli_fetch_array(mysqli_query($conn, "SELECT sum(amt) ref_income FROM `wallet_history` WHERE `agent_id` = '$my_id' && `desp` = 'Referral Income'"));
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
                                            <h6>₹<?php echo $ref_income_data['ref_income']; ?></h6>
                                            <span class="text-black small pt-1 fw-bold">Amount</span> <span class="text-black small pt-2 ps-1">$<?php echo $ref_income_data['ref_income'] / 85; ?></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- level income Card -->
                        <?php
                        $level_coungt_data = mysqli_fetch_array(mysqli_query($conn, "SELECT SUM(amt) level_income FROM `wallet_history` WHERE `agent_id` = '$my_id' && `desp` = 'Level Income'"));
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
                                            <h6>₹<?php echo $level_coungt_data['level_income'];?></h6>
                                            <span class="text-black small pt-1 fw-bold">Amount</span> <span class="text-black small pt-2 ps-1">$<?php echo $level_coungt_data['level_income'] / 85; ?></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- autopool income Card -->
                        <?php
                        $matrix_coungt_data = mysqli_fetch_array(mysqli_query($conn, "SELECT SUM(amt) matrix_income FROM `wallet_history` WHERE `agent_id` = '$my_id' && `desp` = 'Global Income'"));
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
                                            <h6>₹<?php echo $matrix_coungt_data['matrix_income']; ?></h6>
                                            <span class="text-black small pt-1 fw-bold">Amount</span> <span class="text-black small pt-2 ps-1">$<?php echo $matrix_coungt_data['matrix_income']/85; ?></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        
                        <!-- spill over Card -->
                        <?php
                        $spill_data = mysqli_fetch_array(mysqli_query($conn, "SELECT SUM(amt) spill_income FROM `wallet_history` WHERE `agent_id` = '$my_id' && `desp` = 'Spillover Income'"));
                        ?>
                        <div class="col-xxl-4 col-md-4">
                            <div class="card info-card revenue-card">
                                <div class="card-body">
                                    <h5 class="card-title">Income <span>| Spill Over</span></h5>

                                    <div class="d-flex align-items-center">
                                        <div class="card-icon rounded-circle d-flex align-items-center justify-content-center">
                                            <i class="bi bi-currency-dollar"></i>
                                        </div>
                                        <div class="ps-3">
                                            <h6>₹<?php echo $spill_data['spill_income']; ?></h6>
                                            <span class="text-black small pt-1 fw-bold">Amount</span> <span class="text-black small pt-2 ps-1">$<?php echo $spill_data['spill_income']/85; ?></span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <!-- withdrawal Card -->
                        <?php
                        $withdraw_data = mysqli_fetch_array(mysqli_query($conn, "SELECT SUM(amt) withdraw FROM `wallet_history` WHERE `agent_id` = '$my_id' && `status` = '1' && `desp`!='Package Active'"));
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
                                            <span class="text-black small pt-1 fw-bold">Amount</span> <span class="text-black small pt-2 ps-1">$<?php echo $withdraw_data['withdraw'] / 85; ?></span>

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
    require_once("resources/footer.php");
    require_once("resources/footer_links.php");
    ?>

</body>

</html>
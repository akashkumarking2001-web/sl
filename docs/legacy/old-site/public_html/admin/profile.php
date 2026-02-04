<?php
require_once("../resources/connection_build.php");
require_once("../resources/check_login_agent.php");
require_once("../resources/function.php");

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

    <?php
    require_once("resources/header.php");
    // ======= Sidebar =======
    require_once("resources/sidebar.php");
    ?>
    <main id="main" class="main">

        <div class="pagetitle">
            <h1>Profile</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item active">Profile</li>
                </ol>
            </nav>
        </div><!-- End Page Title -->

        <section class="section dashboard">
            <div class="row">
                <div class="col-xl-4">
                    <?php
                    $name = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$my_id'"));
                    if ($name['package'] == "b-silver") {
                        $package = 'BASIC SILVER';
                    } elseif ($name['package'] == "b-gold") {
                        $package = 'BASIC GOLD';
                    } elseif ($name['package'] == "b-diamond") {
                        $package = 'BASIC DIAMOND';
                    } elseif ($name['package'] == "b-platinum") {
                        $package = 'BASIC PLATINUM';
                    } elseif ($name['package'] == "p-silver") {
                        $package = 'PRIMIUM SILVER';
                    } elseif ($name['package'] == "p-gold") {
                        $package = 'PRIMIUM GOLD';
                    } elseif ($name['package'] == "p-diamond") {
                        $package = 'PRIMIUM DIAMOND';
                    } else {
                        $package = 'NONE';
                    }
                    ?>
                    <?php
                    if (isset($_SESSION['status'])) {
                        if ($_SESSION['status'] == 4) {
                    ?>
                            <div class="alert alert-primary bg-primary text-light border-0 alert-dismissible fade show" role="alert">
                                <i class="bi bi-check-circle-fill"></i> Updated
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        <?php
                        } elseif ($_SESSION['status'] == 5) {
                        ?>
                            <div class="alert alert-danger bg-danger text-light border-0 alert-dismissible fade show" role="alert">
                                Password doesn't match
                                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                    <?php
                        }
                        unset($_SESSION['status']);
                    }
                    ?>

                    <div class="card">
                        <div class="card-body profile-card pt-4 d-flex flex-column align-items-center">

                            <img style="width: 150px;" src="../assets/img/profile-img.png" alt="Profile" class="rounded-circle">
                            <h2><?php echo $name['agent_name'] ?></h2>
                        </div>
                    </div>

                </div>

                <div class="col-xl-8">

                    <div class="card">
                        <div class="card-body pt-3">
                            <!-- Bordered Tabs -->
                            <ul class="nav nav-tabs nav-tabs-bordered">

                                <li class="nav-item">
                                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#profile-overview">Overview</button>
                                </li>

                                <li class="nav-item">
                                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-edit">Edit Profile</button>
                                </li>

                                <li class="nav-item">
                                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#bank-detail">Bank Datails</button>
                                </li>

                                <li class="nav-item">
                                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#profile-change-password">Change Password</button>
                                </li>

                            </ul>
                            <div class="tab-content pt-2">
                                <?php
                                $detail = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$my_id'"))
                                ?>

                                <div class="tab-pane fade show active profile-overview" id="profile-overview">
                                    <h5 class="card-title">Profile Details</h5>

                                    <div class="row">
                                        <div class="col-lg-3 col-md-4 label ">ID</div>
                                        <div class="col-lg-9 col-md-8"><?php echo $detail['agent_id'] ?></div>
                                    </div>

                                    <div class="row">
                                        <div class="col-lg-3 col-md-4 label">Sponsor ID</div>
                                        <div class="col-lg-9 col-md-8"><?php echo $detail['sponsor_id'] ?></div>
                                    </div>

                                    <div class="row">
                                        <div class="col-lg-3 col-md-4 label">Name</div>
                                        <div class="col-lg-9 col-md-8"><?php echo $detail['agent_name'] ?></div>
                                    </div>

                                    <div class="row">
                                        <div class="col-lg-3 col-md-4 label">Mobile NO</div>
                                        <div class="col-lg-9 col-md-8"><?php echo $detail['agent_mobile'] ?></div>
                                    </div>

                                    <div class="row">
                                        <div class="col-lg-3 col-md-4 label">Address</div>
                                        <div class="col-lg-9 col-md-8"><?php echo $detail['address'] ?></div>
                                    </div>
                                </div>

                                <div class="tab-pane fade profile-edit pt-3" id="profile-edit">

                                    <!-- Profile Edit Form -->
                                    <form action="../request_handler.php" method="post">

                                        <div class="row mb-3">
                                            <label for="fullName" class="col-md-4 col-lg-3 col-form-label">ID</label>
                                            <div class="col-md-8 col-lg-9">
                                                <input type="text" class="form-control" name="agent_id" id="fullName" value="<?php echo $detail['agent_id'] ?>" readonly>
                                            </div>
                                        </div>

                                        <div class="row mb-3">
                                            <label for="about" class="col-md-4 col-lg-3 col-form-label">Sponsor ID</label>
                                            <div class="col-md-8 col-lg-9">
                                                <input type="text" class="form-control" id="fullName" value="<?php echo $detail['sponsor_id'] ?>" readonly>
                                            </div>
                                        </div>

                                        <div class="row mb-3">
                                            <label for="company" class="col-md-4 col-lg-3 col-form-label">Name</label>
                                            <div class="col-md-8 col-lg-9">
                                                <input type="text" class="form-control" id="fullName" value="<?php echo $detail['agent_name'] ?>" readonly>
                                            </div>
                                        </div>

                                        <div class="row mb-3">
                                            <label for="Job" class="col-md-4 col-lg-3 col-form-label">Mobile No</label>
                                            <div class="col-md-8 col-lg-9">
                                                <input type="mobile" class="form-control" id="fullName" value="<?php echo $detail['agent_mobile'] ?>" readonly>
                                            </div>
                                        </div>

                                        <div class="row mb-3">
                                            <label for="Country" class="col-md-4 col-lg-3 col-form-label">Address</label>
                                            <div class="col-md-8 col-lg-9">
                                                <input name="address" type="text" class="form-control" id="Country" value="<?php echo $detail['address'] ?>">
                                            </div>
                                        </div>

                                        <div class="text-center">
                                            <button type="submit" name="profile_update_basic" class="btn btn-primary">Save Changes</button>
                                        </div>
                                    </form><!-- End Profile Edit Form -->

                                </div>
                                
                                <div class="tab-pane fade profile-edit pt-3" id="bank-detail">
                                    <?php 
                                        $bank = mysqli_fetch_array(mysqli_query($conn,"SELECT * FROM `bank_account` WHERE `agent_id`='$my_id'"));
                                    ?>

                                    <!-- bank Edit Form -->
                                    <form action="../request_handler.php" method="post">

                                        <div class="row mb-3">
                                            <label for="fullName" class="col-md-4 col-lg-3 col-form-label">ID</label>
                                            <div class="col-md-8 col-lg-9">
                                                <input type="text" class="form-control" name="agent_id" id="fullName" value="<?php echo $bank['agent_id'] ?>" readonly>
                                            </div>
                                        </div>

                                        <div class="row mb-3">
                                            <label for="about" class="col-md-4 col-lg-3 col-form-label">account holder name</label>
                                            <div class="col-md-8 col-lg-9">
                                                <input type="text" name="acc_holder" class="form-control" id="fullName" value="<?php echo $bank['account_holder'] ?>" >
                                            </div>
                                        </div>

                                        <div class="row mb-3">
                                            <label for="company" class="col-md-4 col-lg-3 col-form-label">Account Number</label>
                                            <div class="col-md-8 col-lg-9">
                                                <input type="text" class="form-control" name="acc_num" id="fullName" value="<?php echo $bank['account_number'] ?>" >
                                            </div>
                                        </div>

                                        <div class="row mb-3">
                                            <label for="Job" class="col-md-4 col-lg-3 col-form-label">IFSC code</label>
                                            <div class="col-md-8 col-lg-9">
                                                <input type="mobile" class="form-control" id="fullName" name="ifsc_code" value="<?php echo $bank['IFSC_code'] ?>">
                                            </div>
                                        </div>

                                        <div class="row mb-3">
                                            <label for="Country" class="col-md-4 col-lg-3 col-form-label">UBI ID</label>
                                            <div class="col-md-8 col-lg-9">
                                                <input name="bank_name" type="text" class="form-control" id="Country" value="<?php echo $bank['bank_name'] ?>">
                                            </div>
                                        </div>

                                        <div class="row mb-3">
                                            <label for="Country" class="col-md-4 col-lg-3 col-form-label">USDT</label>
                                            <div class="col-md-8 col-lg-9">
                                                <input name="usdt" type="text" class="form-control" id="Country" value="<?php echo $bank['usdt'] ?>">
                                            </div>
                                        </div>

                                        <div class="text-center">
                                            <button type="submit" name="bank_detail_update" class="btn btn-primary">Save Changes</button>
                                        </div>
                                    </form><!-- End Profile Edit Form -->

                                </div>

                                <div class="tab-pane fade pt-3" id="profile-change-password">
                                    <!-- Change Password Form -->
                                    <form action="../request_handler.php" method="post">
                                        <div class="row mb-3">
                                            <label for="newPassword" class="col-md-4 col-lg-3 col-form-label">New Password</label>
                                            <div class="col-md-8 col-lg-9">
                                                <input type="text" name="agent_id" value="<?php echo $my_id ?> " hidden>
                                                <input name="newpassword" type="password" class="form-control" id="newPassword">
                                            </div>
                                        </div>

                                        <div class="row mb-3">
                                            <label for="renewPassword" class="col-md-4 col-lg-3 col-form-label">Re-enter New Password</label>
                                            <div class="col-md-8 col-lg-9">
                                                <input name="renewpassword" type="password" class="form-control" id="renewPassword">
                                            </div>
                                        </div>

                                        <div class="text-center">
                                            <button type="submit" name="profile_update_password" class="btn btn-primary">Change Password</button>
                                        </div>
                                    </form><!-- End Change Password Form -->

                                </div>

                            </div><!-- End Bordered Tabs -->

                        </div>
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

</html>
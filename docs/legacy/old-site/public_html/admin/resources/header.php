<header id="header" class="header fixed-top d-flex align-items-center">

    <div class="d-flex align-items-center justify-content-between">
        <a href="../index.php" class="logo d-flex align-items-center">
            <img src="assets/img/logo.png" alt="">
            <span class="d-none d-lg-block">MoneyWorld</span>
        </a>
        <i class="bi bi-list toggle-sidebar-btn"></i>
    </div><!-- End Logo -->

    <nav class="header-nav ms-auto">
        <ul class="d-flex align-items-center">


            <li class="nav-item dropdown">

                <?php 
                    $tot_data = mysqli_fetch_array(mysqli_query($conn, "SELECT count(desp) total_his FROM `wallet_history` WHERE `agent_id` = '$my_id'"));
                ?>
                <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
                    <i class="bi bi-bell"></i>
                    <span class="badge bg-primary badge-number"><?php echo $tot_data['total_his'];?></span>
                </a><!-- End Notification Icon -->

                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                    <li class="dropdown-header">
                        You have <?php echo $tot_data['total_his'];?> new notifications
                        <a href="wallet_history.php"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                    </li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <?php
                    $notification = mysqli_query($conn, "SELECT * FROM `wallet_history` WHERE `agent_id`= '$my_id' ORDER BY `wallet_history`.`date_time` DESC");
                    $a = 0;
                    while ($data = mysqli_fetch_array($notification) and $a<4) {
                    ?>
                        <li class="notification-item">
                            <i class="bi bi-check-circle text-success"></i>
                            <div>
                                <h4><?php echo ($data['status']) ? 'Debit' : 'Credit'; ?></h4>
                                <p><?php echo $data['amt']; ?>Rs <?php echo $data['desp']; ?></p>
                                <p><?php echo $data['date_time']; ?></p>
                            </div>
                        </li>

                        <li>
                            <hr class="dropdown-divider">
                        </li>
                    <?php
                    ++$a;
                    }
                    ?>

                    <li class="dropdown-footer">
                        <a href="wallet_history.php">Show all notifications</a>
                    </li>

                </ul><!-- End Notification Dropdown Items -->

            </li><!-- End Notification Nav -->

            <li class="nav-item dropdown pe-3">

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
                <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                    <img src="assets/img/logo.png" alt="" class="rounded-circle">
                    <span class="d-none d-md-block dropdown-toggle ps-2"><?php echo $name['agent_name']; ?></span>
                </a><!-- End Profile Iamge Icon -->

                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                    <li class="dropdown-header">
                        <h6>3T<?php echo $name['agent_id']; ?></h6>
                        <span>ADMIN</span>
                    </li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>

                    <li>
                        <a class="dropdown-item d-flex align-items-center" href="profile.php">
                            <i class="bi bi-person"></i>
                            <span>My Profile</span>
                        </a>
                    </li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>

                    <li>
                        <a class="dropdown-item d-flex align-items-center" href="profile.php">
                            <i class="bi bi-gear"></i>
                            <span>Account Settings</span>
                        </a>
                    </li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>

                    <li>
                        <form action="../request_handler.php" method="post">
                            <button type="submit" name="logout_btn" class="dropdown-item d-flex align-items-center">
                                <i class="bi bi-box-arrow-right"></i>
                                <span>Sign Out</span>
                            </button>
                        </form>
                    </li>

                </ul><!-- End Profile Dropdown Items -->
            </li><!-- End Profile Nav -->

        </ul>
    </nav><!-- End Icons Navigation -->

</header><!-- End Header -->
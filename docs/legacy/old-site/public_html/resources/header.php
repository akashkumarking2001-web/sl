<style>
    
#header {
  background-color: #1e3a8a !important; 
  border-radius: 0 0 15px 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  color: white !important;
}

#header * {
  color: white !important;
}

/* Account/Profile Dropdown */
.dropdown-menu.profile {
  background-color: #1e3a8a; /* soft white/gray background */
  border: 1px solid #11171fff;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  padding: 10px 0;
  min-width: 220px;
}

/* Dropdown Header */
.dropdown-menu.profile .dropdown-header {
  background-color: #1e3a8a;
  color: white;
  padding: 10px 15px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-weight: bold;
  text-align: center;
}

/* Divider styling */
.dropdown-menu.profile hr.dropdown-divider {
  margin: 5px 0;
  border-top: 1px solid #dbeafe;
}

/* Dropdown items */
.dropdown-menu.profile .dropdown-item {
  padding: 8px 20px;
  font-size: 15px;
  color: #1e3a8a;
  transition: background 0.2s ease;
}

/* Icon inside items */
.dropdown-menu.profile .dropdown-item i {
  margin-right: 10px;
  color: #1e3a8a;
}

/* Hover effect */
.dropdown-menu.profile .dropdown-item:hover {
  background-color: #1e3a8a; /* light blue hover */
  color: #1e3a8a;
  font-weight: 500;
}

.dropdown-menu.profile .dropdown-item:hover i {
  color: #1e3a8a;
}

/* Sign Out Button inside Form */
.dropdown-menu.profile button.dropdown-item {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
}
</style>



<header id="header" class="header fixed-top d-flex align-items-center">

    <div class="d-flex align-items-center justify-content-between">
        <a class="navbar-brand d-flex align-items-center" href="#">
          <img src="./assets/img/logo.png" style="width: 100px; height: 40px; transform: scale(1.1);" class="me-2" />
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
                    <span class="badge bg-primary badge-number"><?php echo $tot_data['total_his']; ?></span>
                </a><!-- End Notification Icon -->

                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow notifications">
                    <li class="dropdown-header">
                        You have <?php echo $tot_data['total_his']; ?> new notifications
                        <a href="wallet_history.php"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                    </li>
                    <li>
                        <hr class="dropdown-divider">
                    </li>
                    <?php
                    $notification = mysqli_query($conn, "SELECT * FROM `wallet_history` WHERE `agent_id`= '$my_id' ORDER BY `wallet_history`.`date_time` DESC");
                    $a = 0;
                    while ($data = mysqli_fetch_array($notification) and $a < 4) {
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
            <li class="nav-item dropdown">

                <?php
                $tot_notify = mysqli_fetch_array(mysqli_query($conn, "SELECT count(message) total_nitify FROM `notify`"));
                $notify = mysqli_query($conn, "SELECT * FROM `notify` ORDER BY `notify`.`date` DESC");
                ?>
                <a class="nav-link nav-icon" href="#" data-bs-toggle="dropdown">
                    <i class="bi bi-chat-left-text"></i>
                    <span class="badge bg-success badge-number"><?php echo $tot_notify['total_nitify']?></span>
                </a><!-- End Messages Icon -->

                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow messages">
                    <li class="dropdown-header">
                        You have <?php echo $tot_notify['total_nitify']?> new messages
                        <a href="#"><span class="badge rounded-pill bg-primary p-2 ms-2">View all</span></a>
                    </li>
                    <?php
                        $a = 0;
                        while ($data = mysqli_fetch_array($notify) and $a < 4) {
                    ?>
                    <li>
                        <hr class="dropdown-divider">
                    </li>

                    <li class="message-item">
                        <a href="#">
                            <img src="assets/img/logo.png" alt="" class="rounded-circle">
                            <div>
                                <h4>ADMIN</h4>
                                <p><?php echo $data['message']?></p>
                                <p><?php echo $data['date']?></p>
                            </div>
                        </a>
                    <?php
                        ++$a;
                    }
                    ?>
                    </li>
                </ul><!-- End Messages Dropdown Items -->

            </li><!-- End Messages Nav -->

            <li class="nav-item dropdown pe-3">

                <?php
                $name = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$my_id'"));
                if ($name['package'] == "b_silver") {
                    $package = 'BASIC SILVER';
                } elseif ($name['package'] == "b_gold") {
                    $package = 'BASIC GOLD';
                } elseif ($name['package'] == "b_diamond") {
                    $package = 'BASIC DIAMOND';
                } elseif ($name['package'] == "b_platinum") {
                    $package = 'BASIC PLATINUM';
                } elseif ($name['package'] == "b_rocking") {
                    $package = 'BASIC ROCKING';
                } elseif ($name['package'] == "p_silver") {
                    $package = 'PRIMIUM SILVER';
                } elseif ($name['package'] == "p_gold") {
                    $package = 'PRIMIUM GOLD';
                } elseif ($name['package'] == "p_diamond") {
                    $package = 'PRIMIUM DIAMOND';
                } elseif ($name['package'] == "p_platinum") {
                    $package = 'PRIMIUM PLATINUM';
                } else {
                    $package = 'NONE';
                }
                ?>
                <a class="nav-link nav-profile d-flex align-items-center pe-0" href="#" data-bs-toggle="dropdown">
                    <img src="<?php echo !empty($name['package']) ? 'assets/img/' . $name['package'] . '.png' : 'https://via.placeholder.com/150'; ?>" alt="" class="rounded-circle">

                    <span class="d-none d-md-block dropdown-toggle ps-2"><?php echo $name['agent_name']; ?></span>
                </a><!-- End Profile Iamge Icon -->

                <ul class="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
                    <li class="dropdown-header">
                        <h6>3T<?php echo $name['agent_id']; ?></h6>
                        <span><?php echo $package ?></span>
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
                        <form action="./request_handler.php" method="post">
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
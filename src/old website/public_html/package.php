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

    <title>Package</title>


    <?php require_once("resources/header_links.php"); ?>
    <link rel="stylesheet" href="assets/css/package_style.css">
</head>

<body>

    <?php
    require_once("resources/header.php");
    // ======= Sidebar =======
    require_once("resources/sidebar.php");
    ?>
    <main id="main" class="main">

        <div class="pagetitle">
            <h1>Package</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                    <li class="breadcrumb-item active">Package</li>
                </ol>
            </nav>
        </div><!-- End Page Title -->

        <section class="section dashboard">
            <div class="row">
                <div class="container">
                    <?php
                    $a = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$my_id'"));
                    ?>
                    <h1 class="d-flex justify-content-center">BASIC PLANS</h1>
                    <div class="row m-t-30">
                        <div class="pricing-table col">
                            <div class="pricing-card">
                                <h3 class="pricing-card-header">Silver</h3>
                                <div class="price"><sup>₹</sup>500<span>.00</span></div>
                                <ul>
                                    <li><strong>$6.6</strong>USDT</li>
                                    <li><strong>100</strong>/refer</li>
                                    <li><strong>20</strong>/level</li>
                                    <li><strong>100</strong>/Auto fill</li>
                                    <li><strong>12</strong>totel levels</li>
                                    <li><strong>...</strong></li>
                                </ul>
                                <button name="silver-pkg-btn" type="button" data-bs-toggle="modal" data-bs-target="#b_silver" class="order-btn">
                                    <?php
                                    if ($a['package'] == "b_silver") {
                                        echo "Active";
                                    } else {
                                        echo "Active Now";
                                    }
                                    ?>
                                </button>
                            </div>

                            <div class="pricing-card">
                                <h3 class="pricing-card-header">Gold</h3>
                                <div class="price"><sup>₹</sup>1000<span>.00</span></div>
                                <ul>
                                    <li><strong>$13.3</strong>USDT</li>
                                    <li><strong>200</strong>/refer</li>
                                    <li><strong>40</strong>for 10 level</li>
                                    <li><strong>80</strong>for 2 level</li>
                                    <li><strong>200</strong>/Auto fill</li>
                                    <li><strong>12</strong>totel levels</li>
                                </ul>
                                <button name="gold-pkg-btn" type="button" data-bs-toggle="modal" data-bs-target="#b_gold" class="order-btn">
                                    <?php
                                    if ($a['package'] == "b_gold") {
                                        echo "Active";
                                    } else {
                                        echo "Active Now";
                                    }
                                    ?>
                                </button>
                            </div>

                            <div class="pricing-card">
                                <h3 class="pricing-card-header">Diamond</h3>
                                <div class="price"><sup>₹</sup>2500<span>.00</span></div>
                                <ul>
                                    <li><strong>$33.3</strong>USDT</li>
                                    <li><strong>500</strong>/refer</li>
                                    <li><strong>125</strong>for 2 level</li>
                                    <li><strong>150</strong>for 2 level</li>
                                    <li><strong>500</strong>/Auto fill</li>
                                    <li><strong>12</strong>totel levels</li>
                                </ul>
                                <button name="diamond-pkg-btn" type="button" data-bs-toggle="modal" data-bs-target="#b_diamond" class="order-btn">
                                    <?php
                                    if ($a['package'] == "b_diamond") {
                                        echo "Active";
                                    } else {
                                        echo "Active Now";
                                    }
                                    ?>
                                </button>
                            </div>

                            <div class="pricing-card">
                                <h3 class="pricing-card-header">Platinum</h3>
                                <div class="price"><sup>₹</sup>6500<span>.00</span></div>
                                <ul>
                                    <li><strong>$86.6</strong>USDT</li>
                                    <li><strong>2500</strong>/refer</li>
                                    <li><strong>170</strong>for 10 level</li>
                                    <li><strong>200</strong>for 2 level</li>
                                    <li><strong>1000</strong>/Auto fill</li>
                                    <li><strong>12</strong>totel levels</li>
                                </ul>
                                <button name="untimate-pkg-btn" type="button" data-bs-toggle="modal" data-bs-target="#b_platinum" class="order-btn">
                                    <?php
                                    if ($a['package'] == "b_platinum") {
                                        echo "Active";
                                    } else {
                                        echo "Active Now";
                                    }
                                    ?>
                                </button>
                            </div>

                            <div class="pricing-card">
                                <h3 class="pricing-card-header">rocking</h3>
                                <div class="price"><sup>₹</sup>10000<span>.00</span></div>
                                <ul>
                                    <li><strong>$133.3</strong>USDT</li>
                                    <li><strong>3400</strong>/refer</li>
                                    <li><strong>260</strong>for 10 level</li>
                                    <li><strong>300</strong>for 2 level</li>
                                    <li><strong>2000</strong>/Auto fill</li>
                                    <li><strong>12</strong>totel levels</li>
                                </ul>
                                <button name="untimate-pkg-btn" type="button" data-bs-toggle="modal" data-bs-target="#b_rocking" class="order-btn">
                                    <?php
                                    if ($a['package'] == "b_rocking") {
                                        echo "Active";
                                    } else {
                                        echo "Active Now";
                                    }
                                    ?>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div class="d-flex justify-content-center">
                        <h1>PRIMIUM PLAN</h1>
                    </div>
                    <div class="row m-t-30">
                        <div class="pricing-table col">
                            <div class="pricing-card">
                                <h3 class="pricing-card-header">Silver</h3>
                                <div class="price"><sup>₹</sup>12500<span>.00</span></div>
                                <ul>
                                    <li><strong>$166.6</strong>USDT</li>
                                    <li><strong>1500</strong>/refer</li>
                                    <li><strong>6000</strong>/Auto fill</li>
                                    <li><strong></strong></li>
                                </ul>
                                <button type="button" data-bs-toggle="modal" data-bs-target="#p_silver" class="order-btn">
                                    <?php
                                    if ($a['package'] == "p_silver") {
                                        echo "Active";
                                    } else {
                                        echo "Active Now";
                                    }
                                    ?>
                                </button>
                            </div>

                            <div class="pricing-card">
                                <h3 class="pricing-card-header">Gold</h3>
                                <div class="price"><sup>₹</sup>55000<span>.00</span></div>
                                <ul>
                                    <li><strong>$733.3</strong>USDT</li>
                                    <li><strong>5000</strong>/refer</li>
                                    <li><strong>28000</strong>/Auto fill</li>
                                    <li><strong></strong></li>
                                </ul>
                                <button type="button" data-bs-toggle="modal" data-bs-target="#p_gold" class="order-btn">
                                    <?php
                                    if ($a['package'] == "p_gold") {
                                        echo "Active";
                                    } else {
                                        echo "Active Now";
                                    }
                                    ?>
                                </button>
                            </div>

                            <div class="pricing-card">
                                <h3 class="pricing-card-header">Diamond</h3>
                                <div class="price"><sup>₹</sup>80000<span>.00</span></div>
                                <ul>
                                    <li><strong>$1066.6</strong>USDT</li>
                                    <li><strong>10000</strong>/refer</li>
                                    <li><strong>40000</strong>/Auto fill</li>
                                    <li><strong></strong></li>
                                </ul>
                                <button type="button" data-bs-toggle="modal" data-bs-target="#p_diamond" class="order-btn">
                                    <?php
                                    if ($a['package'] == "p_diamond") {
                                        echo "Active";
                                    } else {
                                        echo "Active Now";
                                    }
                                    ?>
                                </button>
                            </div>
                            <div class="pricing-card">
                                <h3 class="pricing-card-header">Platinum</h3>
                                <div class="price"><sup>₹</sup>100000<span>.00</span></div>
                                <ul>
                                    <li><strong>$1333.3</strong>USDT</li>
                                    <li><strong>25000</strong>/refer</li>
                                    <li><strong>90000</strong>/Auto fill</li>
                                    <li><strong></strong></li>
                                </ul>
                                <button type="button" data-bs-toggle="modal" data-bs-target="#p_platinum" class="order-btn">
                                    <?php
                                    if ($a['package'] == "p_platinum") {
                                        echo "Active";
                                    } else {
                                        echo "Active Now";
                                    }
                                    ?>
                                </button>
                            </div>
                            <div class="modal fade" id="b_silver" tabindex="-1">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">BASIC SILVER</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body" style="text-align:center">
                                            Are you sure?
                                            <br>
                                            Are you sure to purchase this package
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <form action="request_handler.php" method="post">
                                            <input type="text" class="form-control" id="inputPassword" value="<?php echo $my_id?>" name="user" class="form-control" hidden>
                                                <button type="submit" name="b_silver_btn" class="btn btn-primary">confirm</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal fade" id="b_gold" tabindex="-1">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">BASIC GOLD</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body" style="text-align:center">
                                            Are you sure?
                                            <br>
                                            Are you sure to purchase this package
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <form action="./request_handler.php" method="post">
                                            <input type="text" class="form-control" id="inputPassword" value="<?php echo $my_id?>" name="user" class="form-control" hidden>
                                                <button type="submit" name="b_gold_btn" class="btn btn-primary">confirm</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal fade" id="b_diamond" tabindex="-1">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">BASIC DIAMOND</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body" style="text-align:center">
                                            Are you sure?
                                            <br>
                                            Are you sure to purchase this package
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <form action="./request_handler.php" method="post">
                                            <input type="text" class="form-control" id="inputPassword" value="<?php echo $my_id?>" name="user" class="form-control" hidden>
                                                <button type="submit" name="b_diamond_btn" class="btn btn-primary">confirm</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal fade" id="b_platinum" tabindex="-1">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">BASIC PLATINUM</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body" style="text-align:center">
                                            Are you sure?
                                            <br>
                                            Are you sure to purchase this package
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <form action="./request_handler.php" method="post">
                                            <input type="text" class="form-control" id="inputPassword" value="<?php echo $my_id?>" name="user" class="form-control" hidden>
                                                <button type="submit" name="b_platinum_btn" class="btn btn-primary">confirm</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal fade" id="b_rocking" tabindex="-1">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">BASIC ROCKING</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body" style="text-align:center">
                                            Are you sure?
                                            <br>
                                            Are you sure to purchase this package
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <form action="./request_handler.php" method="post">
                                            <input type="text" class="form-control" id="inputPassword" value="<?php echo $my_id?>" name="user" class="form-control" hidden>
                                                <button type="submit" name="b_rocking_btn" class="btn btn-primary">confirm</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal fade" id="p_silver" tabindex="-1">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">PRIMIUM SILVER</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body" style="text-align:center">
                                            Are you sure?
                                            <br>
                                            Are you sure to purchase this package
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <form action="./request_handler.php" method="post">
                                            <input type="text" class="form-control" id="inputPassword" value="<?php echo $my_id?>" name="user" class="form-control" hidden>
                                                <button type="submit" name="p_silver_btn" class="btn btn-primary">confirm</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal fade" id="p_gold" tabindex="-1">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">PRIMIUM GOLD</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body" style="text-align:center">
                                            Are you sure?
                                            <br>
                                            Are you sure to purchase this package
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <form action="./request_handler.php" method="post">
                                            <input type="text" class="form-control" id="inputPassword" value="<?php echo $my_id?>" name="user" class="form-control" hidden>
                                                <button type="submit" name="p_gold_btn" class="btn btn-primary">confirm</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal fade" id="p_diamond" tabindex="-1">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">PRIMIUM DIAMOND</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body" style="text-align:center">
                                            Are you sure?
                                            <br>
                                            Are you sure to purchase this package
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <form action="request_handler.php" method="post">
                                            <input type="text" class="form-control" id="inputPassword" value="<?php echo $my_id?>" name="user" class="form-control" hidden>
                                                <button type="submit" name="p_diamond_btn" class="btn btn-primary">confirm</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="modal fade" id="p_platinum" tabindex="-1">
                                <div class="modal-dialog modal-dialog-centered">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h5 class="modal-title">PRIMIUM PLATINUM</h5>
                                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                        </div>
                                        <div class="modal-body" style="text-align:center">
                                            Are you sure?
                                            <br>
                                            Are you sure to purchase this package
                                        </div>
                                        <div class="modal-footer">
                                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                            <form action="./request_handler.php" method="post">
                                            <input type="text" class="form-control" id="inputPassword" value="<?php echo $my_id?>" name="user" class="form-control" hidden>
                                                <button type="submit" name="P_platinum_btn" class="btn btn-primary">confirm</button>
                                            </form>
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

    <?php
    require_once("resources/footer.php");
    require_once("resources/footer_links.php");
    ?>

</body>

</html>
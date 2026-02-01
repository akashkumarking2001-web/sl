<?php
error_reporting(0);
function fetch_left_right($side, $agent_id)
{
    global $conn;
    if ($side == 0) {
        $pos = 'left_pos';
    } elseif ($side == 1) {
        $pos = 'mid_pos';
    } else {
        $pos = 'right_pos';
    }
    $data = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `b_gold` WHERE `agent_id`='$agent_id'"));
    return $data[$pos];
}

?>

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

    <title>Tree</title>

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
            <h1>Global Tree</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item active">Global Tree</li>
                </ol>
            </nav>
        </div>

        <section class="section dashboard">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card recent-sales overflow-auto">
                        <div class="card-body">
                            <!-- <h5 class="card-title">Level Income</h5> -->

                            <!-- Table with hoverable rows -->
                            <table class="table table-borderless datatable">
                                <thead>
                                    <tr>
                                        <th scope="col">Level</th>
                                        <th scope="col">Totel Member</th>
                                        <th scope="col">Your Downline</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $agent = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$my_id'"));
                                    $pack = $agent['package'];
                                    $tree = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `$pack` WHERE `agent_id`='$my_id'"));
                                    $level = 0;
                                    if ($pack == 'p_silver' || $pack == 'p_silver' || $pack == 'p_silver') {
                                        $level = 6;
                                    } else {
                                        $level = 8;
                                    }
                                    $a = 0;
                                    while ($a < 8) {
                                    ?>
                                        <tr>
                                            <th scope="row">Level <?php echo ++$a; ?></th>
                                            <td><?php echo pow(3, $a); ?></td>
                                            <?php
                                            if ($a == $tree['level']) {
                                            ?>
                                                <td><?php echo $tree['downline']; ?></td>
                                            <?php } elseif ($a < $tree['level']) { ?>
                                                <td>credited</td>
                                            <?php } ?>
                                        </tr>
                                    <?php
                                    }
                                    ?>

                                </tbody>
                            </table>
                            <!-- End Table with hoverable rows -->

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
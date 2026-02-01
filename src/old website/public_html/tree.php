<?php
require_once("../resources/connection_build.php");
require_once("../resources/check_login.php");
require_once("../resources/function.php")
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <title>Agent</title>

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
            <h1>Referal team</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item active">Referal team List</li>
                </ol>
            </nav>
        </div>

        <section class="section dashboard">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card recent-sales overflow-auto">
                        <div class="card-body">
                            <h5 class="card-title">Active Agent</h5>

                            <!-- Table with hoverable rows -->
                            <table class="table table-borderless datatable">
                                <thead>
                                    <tr>
                                        <th scope="col">Agent Id & Name</th>
                                        <th scope="col">Level 1</th>
                                        <th scope="col">Level 2</th>
                                        <th scope="col">Level 3</th>
                                        <th scope="col">Level 4</th>
                                        <th scope="col">Level 5</th>
                                        <th scope="col">Level 6</th>
                                        <th scope="col">Level 7</th>
                                        <th scope="col">Level 8</th>
                                        <th scope="col">Level 9</th>
                                        <th scope="col">Level 10</th>
                                        <th scope="col">Level 11</th>
                                        <th scope="col">Level 12</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $direct_agent_list_query = mysqli_query($conn, "SELECT * FROM `agent` WHERE `status`='1'");
                                    $a = 0;
                                    ?>
                                    <tr>
                                        <?php
                                        while ($data = mysqli_fetch_array($direct_agent_list_query)) {
                                        ?>
                                            <td><?php echo $data['agent_id'] . "<br>" . $data['agent_name']; ?></td>
                                            <?php
                                            $sponsor_id = get_spons_id($data['agent_id']);
                                            $a = 1;
                                            while ($a <= 12 && $sponsor_id != 0) {
                                                $qurry = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$sponsor_id'"));
                                                $bal = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$sponsor_id'"));
                                            ?>
                                                <td><?php echo $qurry['agent_id'] . "<br>₹" . $bal['wallet']; ?></td>
                                            <?php
                                                $sponsor_id = get_spons_id($sponsor_id);
                                                ++$a;
                                            }
                                            ?>
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
    require_once("../resources/footer.php");
    require_once("../resources/footer_links.php");
    ?>

</body>

</html>
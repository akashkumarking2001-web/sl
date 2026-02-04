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

    <title>Income</title>

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
            <h1>Agent List</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item">Agent</li>
                    <li class="breadcrumb-item active">Spillover List</li>
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
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Level</th>
                                        <th scope="col">totel</th>
                                        <th scope="col">Recived</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $data = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`= '$my_id'"));
                                    ?>
                                        <tr>
                                            <th scope="row">1</th>
                                            <td>Level 1</td>
                                            <td>5</td>
                                            <td><?php if ($data['spilover']<=5 && $data['spilover']>=0){echo $data['spilover'];} elseif($data['spilover']>=0){echo "Filled";} ?></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">2</th>
                                            <td>Level 2</td>
                                            <td>25</td>
                                            <td><?php if ($data['spilover']<=30 && $data['spilover']>=5){echo $data['spilover']-5;} elseif($data['spilover']>=5){echo "Filled";} ?></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">3</th>
                                            <td>Level 3</td>
                                            <td>125</td>
                                            <td><?php if ($data['spilover']<=125 && $data['spilover']>=30){echo $data['spilover']-25;} elseif($data['spilover']>=30){echo "Filled";} ?></td>
                                        </tr>
                                        <tr>
                                            <th scope="row">4</th>
                                            <td>Level 4</td>
                                            <td>625</td>
                                            <td><?php if ($data['spilover'] <= 625 && $data['spilover']>=125) {
                                                echo $data['spilover']-125;
                                            } elseif($data['spilover']>=125) {
                                                echo "";} ?></td>
                                        </tr>
                                </tbody>
                            </table>
                            <!-- End Table with hoverable rows -->

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
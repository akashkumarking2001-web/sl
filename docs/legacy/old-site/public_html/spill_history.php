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
            <h1>Spillover Income</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item">Income</li>
                    <li class="breadcrumb-item active">Spillover Income</li>
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
                                        <th scope="col">Amount</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $direct_agent_list_query = mysqli_query($conn, "SELECT * FROM `wallet_history` WHERE `agent_id`= '$my_id' AND `desp`='Spillover Income' ORDER BY `wallet_history`.`date_time` DESC");
                                    $a = 0;
                                    while ($data = mysqli_fetch_array($direct_agent_list_query)) {
                                    ?>
                                        <tr>
                                            <th scope="row"><?php echo ++$a; ?></th>
                                            <td><?php echo $data['amt']; ?></td>
                                            <td><?php echo ($data['status']) ? 'Debit' : 'Credit'; ?></td>
                                            <td><?php echo $data['desp']; ?></td>
                                            <td><?php echo $data['date_time']; ?></td>
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
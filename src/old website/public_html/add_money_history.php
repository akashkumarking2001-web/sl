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

<body>

    <?php
    require_once("resources/header.php");
    // ======= Sidebar =======
    require_once("resources/sidebar.php");
    ?>
    <main id="main" class="main">

        <div class="pagetitle">
            <h1>Track</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                    <li class="breadcrumb-item active">Track Request</li>
                </ol>
            </nav>
        </div><!-- End Page Title -->

        <section class="section dashboard">
            <div class="row">
                <div class="col-12">
                    <div class="card recent-sales overflow-auto">
                        <div class="card-body">
                            <h5 class="card-title">Track Request <span></span></h5>

                            <table class="table table-borderless datatable">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Payer Name</th>
                                        <th scope="col">Transaction ID</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Added_Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $proof = mysqli_query($conn, "SELECT * FROM `payment_proof` WHERE `agent_id`='$my_id' ORDER BY `payment_proof`.`date` DESC");
                                    $a = 0;
                                    while ($data = mysqli_fetch_array($proof)) {
                                    ?>
                                        <tr>
                                            <td scope="row"><?php echo ++$a; ?></td>
                                            <td><?php echo $data['name']; ?></td>
                                            <td><?php echo $data['transaction_id']; ?></td>
                                            <td><?php echo $data['amount']; echo ($data['usdt'])?'USDT':'INR'; ?></td>
                                            <td><?php echo $data['date']; ?></td>
                                            <td><?php echo $data['added_date']; ?></td>
                                        </tr>
                                    <?php
                                    }
                                    ?>
                                </tbody>
                            </table>

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
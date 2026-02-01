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

    <title>History</title>

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
            <h1>Withdraw History</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item">Wallet</li>
                    <li class="breadcrumb-item active">Withdraw History</li>
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
                                        <th scope="col">Payable Amount</th>
                                        <th scope="col">Deduction</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Request Date</th>
                                        <th scope="col">Approve Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $direct_agent_list_query = mysqli_query($conn, "SELECT * FROM `withdraw_history` WHERE `agent_id`= '$my_id' ORDER BY `withdraw_history`.`req_time` DESC");
                                    $a = 0;
                                    while ($data = mysqli_fetch_array($direct_agent_list_query)) {
                                    ?>
                                        <tr>
                                            <th scope="row"><?php echo ++$a; ?></th>
                                            <td><?php echo $data['amount'];echo ($data['usdt']) ? 'USDT' : 'INR'; ?></td>
                                            <td><?php echo $data['payable_amt'];echo ($data['usdt']) ? 'USDT' : 'INR'; ?></td>
                                            <td><?php echo $data['amount'] - $data['payable_amt'];echo ($data['usdt']) ? 'USDT' : 'INR'; ?></td>
                                            <td><?php echo ($data['status']) ? 'Request Accepted' : 'Pending'; ?></td>
                                            <td><?php echo $data['req_time']; ?></td>
                                            <td><?php echo ($data['status']) ? $data['approve_time'] : 'NA'; ?></td>
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
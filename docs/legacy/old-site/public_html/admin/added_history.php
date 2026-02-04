<?php
require_once("../resources/connection_build.php");
require_once("../resources/check_login_agent.php");
require_once("../resources/function.php")
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <title>History</title>

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
            <h1>Money Added History</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item">Wallet</li>
                    <li class="breadcrumb-item active">Money Added History</li>
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
                                        <th scope="col">#</th>
                                        <th scope="col">Agent ID</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Transection ID</th>
                                        <th scope="col">Date</th>
                                        <th scope="col">Amount</th>
                                        <th scope="col">Proof</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $payment_proof = mysqli_query($conn, "SELECT * FROM `payment_proof` WHERE `status`='1' ORDER BY `payment_proof`.`date` DESC");
                                    $a = 0;
                                    while ($data = mysqli_fetch_array($payment_proof)) {
                                    ?>
                                        <tr>
                                            <th scope="row"><?php echo ++$a; ?></th>
                                            <td><?php echo $data['agent_id']; ?></td>
                                            <td><?php echo $data['name']; ?></td>
                                            <td><?php echo $data['transaction_id']; ?></td>
                                            <td><?php echo $data['date']; ?></td>
                                            <td><?php echo $data['amount']; echo ($data['usdt'])?'USDT':'INR'; ?></td>
                                            <td><a href="../assets/img/payment_proof/<?php echo $data['img_name']; ?>">proof</a></td>
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
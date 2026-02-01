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

    <title>Withdrawal</title>

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
            <h1>Withdrawal</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item">Wallet</li>
                    <li class="breadcrumb-item active">Withdrawal</li>
                </ol>
            </nav>
        </div><!-- End Page Title -->

        <section class="section dashboard">
            <div class="row">
                <div class="col-lg-8">

                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Withdrawal Form</h5>
                            <?php
                            if (isset($_SESSION['status'])) {
                                if ($_SESSION['status'] == 4) {
                            ?>
                                    <div class="alert alert-primary bg-primary text-light border-0 alert-dismissible fade show" role="alert">
                                        WITHDRAWAL SUCCESSFULLY
                                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                                <?php
                                } else {
                                ?>
                                    <div class="alert alert-primary bg-danger text-light border-0 alert-dismissible fade show" role="alert">
                                        Rejected..
                                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="alert" aria-label="Close"></button>
                                    </div>
                            <?php
                                }

                                unset($_SESSION['status']);
                            }
                            ?>
                            <!-- Withdrawal Form -->
                            <form action="../request_handler.php" method="POST">
                                <div class="row mb-3">
                                    <label for="inputEmail3" class="col-sm-2 col-form-label">Agent ID</label>
                                    <div class="input-group col-sm-10">
                                        <span class="input-group-text" id="inputGroupPrepend">3T</span>
                                        <input type="text" id="yourUsername" name="user_id" class="form-control" required>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="inputPassword3" class="col-sm-5 col-form-label">Withdrawal Amount</label>
                                    <div class="col-sm-12">
                                        <input type="text" class="form-control" id="inputPassword" name="amount" min="100" step="100" max="10000" class="form-control" required>
                                    </div>
                                </div>
                                <div class="row mb-3">
                                    <label for="inputPassword3" class="col-sm-5 col-form-label">Reason</label>
                                    <div class="col-sm-12">
                                        <input type="text" class="form-control" id="inputPassword" name="reason" class="form-control">
                                    </div>
                                </div>
                                <div class="text-center">
                                    <button type="submit" class="btn btn-primary" name="withdrawal__btn">Submit</button>
                                    <button type="submit" class="btn btn-danger" name="reject_withdrawal_btn">Reject</button>
                                </div>
                            </form><!-- End Horizontal Form -->

                        </div>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="card recent-sales overflow-auto">
                        <div class="card-body">
                            <!-- <h5 class="card-title">Level Income</h5> -->

                            <!-- Table with hoverable rows -->
                            <table class="table table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Agent ID</th>
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
                                    $direct_agent_list_query = mysqli_query($conn, "SELECT * FROM `withdraw_history` WHERE `status`='0' ORDER BY `withdraw_history`.`req_time` DESC");
                                    $a = 0;
                                    while ($data = mysqli_fetch_array($direct_agent_list_query)) {
                                    ?>
                                        <tr>
                                            <th scope="row"><?php echo ++$a; ?></th>
                                            <td><?php echo $data['agent_id']; ?></td>
                                            <td><?php echo $data['amount']; echo ($data['usdt']) ? 'USDT' : 'INR'; ?></td>
                                            <td><?php echo $data['payable_amt']; echo ($data['usdt']) ? 'USDT' : 'INR'; ?></td>
                                            <td><?php echo $data['amount'] - $data['payable_amt']; echo ($data['usdt']) ? 'USDT' : 'INR'; ?></td>
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
    require_once("../resources/footer.php");
    require_once("../resources/footer_links.php");
    ?>

</body>

</html>
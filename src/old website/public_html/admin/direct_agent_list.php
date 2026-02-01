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

    <title>Dashboard</title>

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
            <h1>Totel Agent</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.html">Home</a></li>
                    <li class="breadcrumb-item">Agent</li>
                    <li class="breadcrumb-item active">Totel Agent</li>
                </ol>
            </nav>
        </div><!-- End Page Title -->

        <section class="section dashboard">
            <div class="row">
                <div class="col-12">
                    <div class="card recent-sales overflow-auto">
                        <div class="card-body">
                            <h5 class="card-title">Agent List <span></span></h5>

                            <table class="table table-borderless datatable">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Agent Id & Name</th>
                                        <th scope="col">Password</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">amount</th>
                                        <th scope="col">Agent Mobile</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <?php
                                    $direct_agent_list_query = mysqli_query($conn, "SELECT * FROM `agent`");
                                    $a = 0;
                                    while ($data = mysqli_fetch_array($direct_agent_list_query)) {
                                        $agent = $data['agent_id'];
                                        $bal = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$agent'"));
                                    ?>
                                        <tr>
                                            <th scope="row"><?php echo ++$a; ?></th>
                                            <td><?php echo $data['agent_id'] . "<br>" . $data['agent_name']; ?></td>
                                            <td><?php echo $data['password']; ?></td>
                                            <td><?php echo ($data['status']) ? 'active' : 'Inactive'; ?></td>
                                            <td>₹<?php echo $bal['wallet']; ?></td>
                                            <td><?php echo $data['agent_mobile']; ?></td>
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
    require_once("../resources/footer.php");
    require_once("../resources/footer_links.php");
    ?>

</body>

</html>
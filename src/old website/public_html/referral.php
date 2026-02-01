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
            <h1>Referral</h1>
            <nav>
                <ol class="breadcrumb">
                    <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                    <li class="breadcrumb-item active">Referral</li>
                </ol>
            </nav>
        </div><!-- End Page Title -->

        <section class="section dashboard">
            <div class="row">
                <div class="ref_card card">
                    <div class="card-body">
                        <img src="assets/img/refer.png" alt="referral">
                        <h3>Affiliate and earn money</h3>
                        <div class="ref_row row">
                            <span id="ref_link">https://3tmoneyworld.in/register.php?sps_id=<?php echo $my_id;?></span>
                            <span id="ref_btn">COPY LINK</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </main><!-- End #main -->

    <script>
        var ref_btn = document.getElementById("ref_btn");
        var ref_link = document.getElementById("ref_link");
        ref_btn.onclick = function(){
            navigator.clipboard.writeText(ref_link.innerHTML);
            ref_btn.innerHTML = "COPIED";
            setTimeout(function(){
                ref_btn.innerHTML = "COPY CODE";
            },3000);
        }
    </script>
    <?php
    require_once("resources/footer.php");
    require_once("resources/footer_links.php");
    ?>

</body>

</html>
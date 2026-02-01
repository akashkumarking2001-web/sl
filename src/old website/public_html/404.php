

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">

    <title>Not Found</title>
    <?php require_once("resources/header_links.php"); ?>
</head>

<body>

    <main>
        <div class="container">

            <section class="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
                <h1>404</h1>
                <h2>The page you are looking for doesn't exist.</h2>
                <a class="btn" href="index.php">Back to home</a>
                <img src="assets/img/not-found.svg" class="img-fluid py-5" alt="Page Not Found">
                
            </section>

        </div>
    </main><!-- End #main -->

    <a href="#" class="back-to-top d-flex align-items-center justify-content-center"><i class="bi bi-arrow-up-short"></i></a>
    <?php
    // require_once("resources/footer.php");
    require_once("resources/footer_links.php");
    ?>

</body>

</html>
<?php
require_once("resources/connection_build.php");
require_once("resources/check_login.php");
require_once("resources/function.php");
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
        <h1>My Courses</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                <li class="breadcrumb-item active">My Courses</li>
            </ol>
        </nav>
    </div><!-- End Page Title -->

    <section class="section dashboard">
        <div class="container">
            <div class="row g-4">
                <?php
                // Fetch courses from DB
                $query = "
                    SELECT c.* 
                    FROM agnt_courses ac
                    INNER JOIN course c ON ac.course_id = c.id
                    WHERE ac.agent_id = $my_id
                    ORDER BY c.id DESC
                ";

                $result = mysqli_query($conn, $query);

                $courses = [];
                while ($row = mysqli_fetch_assoc($result)) {
                    $courses[] = $row;
                }

                if (!empty($courses)) {
                    foreach ($courses as $course) {
                        ?>
                        <div class="col-md-4">
                            <div class="card course-card h-100 shadow-sm">
                                <img src="<?= htmlspecialchars($course['thumbnail']); ?>" 
                                     class="card-img-top" 
                                     alt="<?= htmlspecialchars($course['course_name']); ?>" 
                                     style="height: 200px; object-fit: cover;">
                                <div class="card-body d-flex flex-column">
                                    <h5 class="card-title"><?= htmlspecialchars($course['course_name']); ?></h5>
                                    <p class="card-text"><?= htmlspecialchars(substr($course['description'], 0, 100)) . '...'; ?></p>
                                    <p class="fw-bold text-primary">₹<?= number_format($course['price'], 2); ?></p>
                                    
                                </div>
                            </div>
                        </div>
                        <?php
                    }
                } else {
                    echo "<p class='text-center'>No courses available right now.</p>";
                }
                ?>
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

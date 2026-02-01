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
    <title>Online Courses</title>
    <?php require_once("resources/header_links.php"); ?>
    <!-- Bootstrap Modal CSS/JS already included in header_links.php -->
</head>
<body>

<?php
require_once("resources/header.php");
require_once("resources/sidebar.php");
?>
<main id="main" class="main">

    <div class="pagetitle">
        <h1>My Courses</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                <li class="breadcrumb-item active">Courses</li>
            </ol>
        </nav>
    </div>

<section class="section dashboard">
    <!-- Owned Courses Section -->
    <div class="container mb-5">
        <div class="row g-4">
            <?php
            $owned = mysqli_query($conn, "
               SELECT c.* FROM agnt_courses ac
                JOIN course c ON ac.course_id = c.id
                WHERE ac.agent_id = $my_id
                ORDER BY ac.row_id DESC;
            ");
            if (mysqli_num_rows($owned) > 0) {
                while ($course = mysqli_fetch_assoc($owned)) {
                    ?>
                    <div class="col-md-4">
                        <div class="card course-card h-100 border-success shadow-sm">
                            <img src="<?= htmlspecialchars($course['thumbnail']); ?>" 
                                 class="card-img-top" 
                                 alt="<?= htmlspecialchars($course['course_name']); ?>" 
                                 style="height: 200px; object-fit: cover;">
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title"><?= htmlspecialchars($course['course_name']); ?></h5>
                                <p class="card-text"><?= htmlspecialchars(substr($course['description'], 0, 100)) . '...'; ?></p>
                                <p class="fw-bold text-success">Owned</p>
                                <button 
                                    class="btn btn-success mt-auto w-100 start-course-btn" 
                                    data-bs-toggle="modal" 
                                    data-bs-target="#videoModal" 
                                    data-video="<?= htmlspecialchars($course['video_url']); ?>"
                                    data-title="<?= htmlspecialchars($course['course_name']); ?>">
                                    ▶ Start Learning
                                </button>
                            </div>
                        </div>
                    </div>
                    <?php
                }
            } else {
                echo "<p class='text-center text-muted'>You haven’t purchased any courses yet.</p>";
            }
            ?>
        </div>
    </div>

</section>

</main>

<!-- Video Modal -->
<div class="modal fade" id="videoModal" tabindex="-1" aria-labelledby="videoModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-xl modal-dialog-centered">
    <div class="modal-content rounded-3 shadow-lg">
      <div class="modal-header">
        <h5 class="modal-title" id="videoModalLabel">Course Video</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                onclick="stopVideo()"></button>
      </div>
      <div class="ratio ratio-16x9">
          <video id="courseVideo" class="w-100" controls>
              <source src="" type="video/mp4">
              Your browser does not support HTML5 video.
          </video>
        </div>

    </div>
  </div>
</div>

<script>
document.querySelectorAll('.start-course-btn').forEach(button => {
    button.addEventListener('click', function () {
        let videoUrl = this.getAttribute('data-video');
        let courseTitle = this.getAttribute('data-title');
        document.querySelector('#courseVideo source').src = videoUrl;
        document.getElementById('courseVideo').load(); // reload video
        document.getElementById('videoModalLabel').innerText = courseTitle;
    });
});

function stopVideo() {
    let vid = document.getElementById('courseVideo');
    vid.pause();
    vid.currentTime = 0;
}

</script>

<?php
require_once("resources/footer.php");
require_once("resources/footer_links.php");
?>

</body>
</html>

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
</head>
<body>

<?php
require_once("resources/header.php");
require_once("resources/sidebar.php");
?>

<main id="main" class="main">

    <div class="pagetitle">
        <h1>Online Courses</h1>
        <nav>
            <ol class="breadcrumb">
                <li class="breadcrumb-item"><a href="index.php">Home</a></li>
                <li class="breadcrumb-item active">Online Courses</li>
            </ol>
        </nav>
    </div>

    <section class="section dashboard">

        <div class="container text-center my-4">
            <p class="lead">
                Browse our best online courses and start learning today!
            </p>
        </div>

        <!-- Courses Grid -->
        <div class="container">
            <div class="row g-4">

                <?php
                $result = mysqli_query($conn, "SELECT * FROM course ORDER BY id DESC");

                if (mysqli_num_rows($result) > 0) {
                    while ($course = mysqli_fetch_assoc($result)) {
                ?>
                <div class="col-md-4">
                    <div class="card h-100 shadow-sm">

                        <img src="<?= htmlspecialchars($course['thumbnail']); ?>"
                             class="card-img-top"
                             style="height:200px; object-fit:cover;"
                             alt="<?= htmlspecialchars($course['course_name']); ?>">

                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title">
                                <?= htmlspecialchars($course['course_name']); ?>
                            </h5>

                            <p class="card-text">
                                <?= htmlspecialchars(substr($course['description'], 0, 80)) . '...'; ?>
                            </p>

                            <p class="fw-bold text-primary mb-3">
                                ₹<?= number_format($course['price'], 2); ?>
                            </p>

                            <!-- Buttons -->
                            <div class="row g-2 mt-auto">
                                <div class="col-6">
                                    <button
                                      class="btn btn-outline-primary w-100"
                                      data-bs-toggle="modal"
                                      data-bs-target="#courseModal"
                                      data-id="<?= $course['id']; ?>"
                                      data-name="<?= htmlspecialchars($course['course_name']); ?>"
                                      data-desc="<?= htmlspecialchars($course['description']); ?>"
                                      data-price="<?= number_format($course['price'], 2); ?>"
                                      data-img="<?= htmlspecialchars($course['thumbnail']); ?>">
                                      Details
                                    </button>
                                </div>

                                <div class="col-6">
                                    <a href="course_details.php?id=<?= $course['id']; ?>"
                                       class="btn btn-primary w-100">
                                       Buy Now
                                    </a>
                                </div>
                            </div>

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

</main>

<!-- ===================== MODAL ===================== -->
<div class="modal fade" id="courseModal" tabindex="-1">
  <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content">

      <div class="modal-header">
        <h5 class="modal-title" id="modalTitle"></h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
      </div>

      <div class="modal-body">
        <img id="modalImage" class="img-fluid rounded mb-3" />

        <p id="modalDescription"></p>

        <h5 class="text-primary">
          Price: ₹<span id="modalPrice"></span>
        </h5>
      </div>

      <div class="modal-footer">
        <a id="modalBuyBtn" class="btn btn-success">Buy Now</a>
        <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
      </div>

    </div>
  </div>
</div>
<!-- ================================================= -->

<?php
require_once("resources/footer.php");
require_once("resources/footer_links.php");
?>

<!-- Modal Script -->
<script>
const courseModal = document.getElementById('courseModal')

courseModal.addEventListener('show.bs.modal', function (event) {
  const btn = event.relatedTarget

  document.getElementById('modalTitle').innerText = btn.dataset.name
  document.getElementById('modalDescription').innerText = btn.dataset.desc
  document.getElementById('modalPrice').innerText = btn.dataset.price
  document.getElementById('modalImage').src = btn.dataset.img
  document.getElementById('modalBuyBtn').href =
      "course_details.php?id=" + btn.dataset.id
})
</script>

</body>
</html>

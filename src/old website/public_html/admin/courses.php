<?php
require_once("../resources/connection_build.php");
require_once("../resources/check_login.php");
require_once("../resources/function.php");

// Handle Course Upload
if (isset($_POST['course_upload'])) {
    $course_name = mysqli_real_escape_string($conn, $_POST['course_name']);
    $description = mysqli_real_escape_string($conn, $_POST['description']);
    $price = floatval($_POST['price']);
    $category = mysqli_real_escape_string($conn, $_POST['category']);
    $level = mysqli_real_escape_string($conn, $_POST['level']);
    $duration = mysqli_real_escape_string($conn, $_POST['duration']);
    $package = mysqli_real_escape_string($conn, $_POST['package']);

    // File upload paths
    $upload_dir = '../uploads/courses/';
    $thumb_dir = '../uploads/thumbnails/';

    if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);
    if (!is_dir($thumb_dir)) mkdir($thumb_dir, 0777, true);

    // Upload Course File
    $course_file = $_FILES['course_file']['name'];
    $course_file_tmp = $_FILES['course_file']['tmp_name'];
    $course_file_path = $upload_dir . time() . "_" . basename($course_file);
    move_uploaded_file($course_file_tmp, $course_file_path);

    // Upload Thumbnail
    $thumbnail_file = $_FILES['thumbnail']['name'];
    $thumbnail_tmp = $_FILES['thumbnail']['tmp_name'];
    $thumbnail_path = $thumb_dir . time() . "_" . basename($thumbnail_file);
    move_uploaded_file($thumbnail_tmp, $thumbnail_path);

    // Insert into database
    $insert_query = "INSERT INTO course 
        (course_name, description, price, category, level, duration, package, course_file, thumbnail) 
        VALUES 
        ('$course_name', '$description', '$price', '$category', '$level', '$duration', '$package', '$course_file_path', '$thumbnail_path')";

    if (mysqli_query($conn, $insert_query)) {
        echo "<script>alert('Course uploaded successfully.'); window.location.href='courses.php';</script>";
        exit;
    } else {
        echo "<script>alert('Database insertion failed: " . mysqli_error($conn) . "');</script>";
    }
}

// Handle Delete
if (isset($_GET['delete'])) {
    $id = intval($_GET['delete']);
    mysqli_query($conn, "DELETE FROM course WHERE id = $id");
    echo "<script>alert('Course deleted successfully.'); window.location.href='courses.php';</script>";
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width, initial-scale=1.0" name="viewport">
    <title>Online Courses</title>
    <?php require_once("../resources/header_links.php"); ?>
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
        <div class="row">
            <div class="col-lg-12">

                <!-- Course Upload Form -->
                <div class="card mb-4">
                    <div class="card-body">
                        <h5 class="card-title">Add New Course</h5>
                        <form action="" method="POST" enctype="multipart/form-data">

                            <div class="mb-3">
                                <label class="form-label">Course Name</label>
                                <input type="text" class="form-control" name="course_name" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Description</label>
                                <textarea class="form-control" name="description" rows="3" required></textarea>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Price (₹)</label>
                                <input type="number" class="form-control" name="price" step="0.01" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Category</label>
                                <input type="text" class="form-control" name="category" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Level</label>
                                <select name="level" class="form-control" required>
                                    <option value="">-- Select Level --</option>
                                    <option>Beginner</option>
                                    <option>Intermediate</option>
                                    <option>Advanced</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Duration</label>
                                <input type="text" class="form-control" name="duration" placeholder="e.g., 5 hours or 10 weeks" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Package</label>
                                <select name="package" class="form-control" required>
                                    <option value="">-- Select Package --</option>
                                    <option value="b_silver">Basic Silver</option>
                                    <option value="b_gold">Basic Gold</option>
                                    <option value="b_diamond">Basic Diamond</option>
                                    <option value="b_platinum">Basic Platinum</option>
                                    <option value="p_silver">Premium Silver</option>
                                    <option value="p_gold">Premium Gold</option>
                                    <option value="p_diamond">Premium Diamond</option>
                                </select>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Course File</label>
                                <input type="file" class="form-control" name="course_file" required>
                            </div>

                            <div class="mb-3">
                                <label class="form-label">Thumbnail</label>
                                <input type="file" class="form-control" name="thumbnail" required>
                            </div>

                            <div class="text-center">
                                <button type="submit" class="btn btn-primary" name="course_upload">Upload Course</button>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Course List -->
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Uploaded Courses</h5>
                        <table class="table table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Course</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Level</th>
                                    <th>Duration</th>
                                    <th>Package</th>
                                    <th>Thumbnail</th>
                                    <th>File</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php
                                $a = 0;
                                $result = mysqli_query($conn, "SELECT * FROM course ORDER BY id DESC");
                                while ($row = mysqli_fetch_assoc($result)) {
                                    ?>
                                    <tr>
                                        <td><?= ++$a; ?></td>
                                        <td><?= htmlspecialchars($row['course_name']); ?></td>
                                        <td>₹<?= number_format($row['price'], 2); ?></td>
                                        <td><?= htmlspecialchars($row['category']); ?></td>
                                        <td><?= htmlspecialchars($row['level']); ?></td>
                                        <td><?= htmlspecialchars($row['duration']); ?></td>
                                        <td><?= htmlspecialchars($row['package']); ?></td>
                                        <td><img src="<?= $row['thumbnail']; ?>" width="80"></td>
                                        <td><a href="<?= $row['course_file']; ?>" target="_blank">Download</a></td>
                                        <td>
                                            <a href="?delete=<?= $row['id']; ?>" class="btn btn-danger btn-sm" onclick="return confirm('Delete this course?');">Delete</a>
                                        </td>
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
</main>
<?php
require_once("../resources/footer.php");
require_once("../resources/footer_links.php");
?>
</body>
</html>

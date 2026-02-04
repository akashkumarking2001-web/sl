<?php
require_once("resources/connection_build.php");
require_once("resources/check_login.php");
require_once("resources/function.php");

// --- BACKEND LOGIC: HANDLE IMAGE UPLOAD & UPDATES ---
$upload_message = "";

if (isset($_POST['profile_image_upload'])) {
    $agent_id = mysqli_real_escape_string($conn, $_POST['agent_id']);
    $target_dir = "uploads/profiles/";
    
    if (!is_dir($target_dir)) {
        mkdir($target_dir, 0777, true);
    }

    $file = $_FILES['profile_file'];
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed = array('jpg', 'jpeg', 'png', 'webp');

    if (in_array($ext, $allowed)) {
        if ($file['size'] <= 2000000) { 
            $new_filename = "profile_" . $agent_id . "_" . time() . "." . $ext;
            $destination = $target_dir . $new_filename;

            if (move_uploaded_file($file['tmp_name'], $destination)) {
                $update_sql = "UPDATE `agent` SET `profile_image`='$destination' WHERE `agent_id`='$agent_id'";
                if (mysqli_query($conn, $update_sql)) {
                    $upload_message = "<div class='alert alert-success'>Profile image updated!</div>";
                }
            } else {
                $upload_message = "<div class='alert alert-danger'>Upload failed.</div>";
            }
        } else {
            $upload_message = "<div class='alert alert-danger'>File too large (Max 2MB).</div>";
        }
    } else {
        $upload_message = "<div class='alert alert-danger'>Invalid file type.</div>";
    }
}

// --- RE-FETCH DATA AFTER POTENTIAL UPDATES ---
$agent = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$my_id'"));
$bank  = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `bank_account` WHERE `agent_id`='$my_id'"));

$packageNames = [
    "b_silver"   => "Basic Silver",
    "b_gold"     => "Basic Gold",
    "b_diamond"  => "Basic Diamond",
    "b_platinum" => "Basic Platinum",
    "p_silver"   => "Premium Silver",
    "p_gold"     => "Premium Gold",
    "p_diamond"  => "Premium Diamond",
];
$package = $packageNames[$agent['package']] ?? "None";
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">
  <title>Dashboard - Profile</title>
  <?php require_once("resources/header_links.php"); ?>
  <style>
    body { background-color: #f7f9fc; font-family: "Inter", sans-serif; }
    .profile-card { text-align: center; padding: 30px 20px; }
    .profile-card img {
      width: 120px; height: 120px; border-radius: 50%;
      border: 4px solid #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
      object-fit: cover;
    }
    .profile-card h2 { margin-top: 15px; font-size: 20px; font-weight: 600; }
    .nav-tabs .nav-link { font-weight: 500; padding: 12px 18px; border-radius: 8px 8px 0 0; color: #495057; }
    .nav-tabs .nav-link.active { background: #0d6efd; color: #fff; border-color: #0d6efd; }
    .tab-content { background: #fff; border: 1px solid #dee2e6; border-top: 0; border-radius: 0 0 8px 8px; padding: 25px; }
    .info-row { display: flex; padding: 12px 0; border-bottom: 1px solid #f1f3f5; }
    .info-row .label { flex: 0 0 30%; font-weight: 600; color: #495057; }
    .info-row .value { flex: 1; color: #212529; }
    
    /* Upload Box Styling */
    .upload-box {
      border: 2px dashed #ccc; padding: 20px; border-radius: 10px;
      background: #fafafa; cursor: pointer; transition: 0.3s;
    }
    .upload-box:hover { border-color: #0d6efd; background: #f0f7ff; }
    #profile_file { display: none; }
  </style>
</head>

<body>
  <?php require_once("resources/header.php"); ?>
  <?php require_once("resources/sidebar.php"); ?>

  <main id="main" class="main">
    <div class="pagetitle mb-4">
      <h1 class="fw-bold">Profile</h1>
      <?php echo $upload_message; ?>
      <?php if (isset($_SESSION['status'])): ?>
        <div class="alert alert-info alert-dismissible fade show" role="alert">
          Action Completed. <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
        <?php unset($_SESSION['status']); ?>
      <?php endif; ?>
    </div>

    <section class="section profile">
      <div class="row">
        <div class="col-lg-4">
          <div class="card shadow-sm profile-card">
            <div class="position-relative d-inline-block mx-auto">
              <?php $img = (!empty($agent['profile_image'])) ? $agent['profile_image'] : "assets/img/profile-img.jpg"; ?>
              <img src="<?php echo $img; ?>" alt="Profile">
              <button class="btn btn-primary btn-sm position-absolute bottom-0 end-0 rounded-circle" data-bs-toggle="modal" data-bs-target="#profileImageModal">
                <i class="bi bi-camera-fill"></i>
              </button>
            </div>
            <h2><?php echo htmlspecialchars($agent['agent_name']); ?></h2>
            <h6><?php echo $package; ?></h6>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="card shadow-sm">
            <div class="card-body pt-3">
              <ul class="nav nav-tabs">
                <li class="nav-item"><button class="nav-link active" data-bs-toggle="tab" data-bs-target="#overview">Overview</button></li>
                <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#edit">Edit Profile</button></li>
                <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#bank">Bank Details</button></li>
                <li class="nav-item"><button class="nav-link" data-bs-toggle="tab" data-bs-target="#password">Change Password</button></li>
              </ul>

              <div class="tab-content pt-2">
                <div class="tab-pane fade show active" id="overview">
                  <h5 class="mb-3 fw-semibold">Profile Information</h5>
                  <div class="info-row"><div class="label">ID</div><div class="value"><?php echo $agent['agent_id']; ?></div></div>
                  <div class="info-row"><div class="label">Sponsor ID</div><div class="value"><?php echo $agent['sponsor_id']; ?></div></div>
                  <div class="info-row"><div class="label">Name</div><div class="value"><?php echo $agent['agent_name']; ?></div></div>
                  <div class="info-row"><div class="label">Mobile</div><div class="value"><?php echo $agent['agent_mobile']; ?></div></div>
                  <div class="info-row"><div class="label">Address</div><div class="value"><?php echo $agent['address']; ?></div></div>
                </div>

                <div class="tab-pane fade" id="edit">
                  <form action="request_handler.php" method="post">
                    <input type="hidden" name="agent_id" value="<?php echo $agent['agent_id']; ?>">
                    <div class="mb-3">
                      <label class="form-label">Address</label>
                      <input type="text" class="form-control" name="address" value="<?php echo htmlspecialchars($agent['address']); ?>">
                    </div>
                    <div class="text-end">
                      <button type="submit" name="profile_update_basic" class="btn btn-primary">Save Changes</button>
                    </div>
                  </form>
                </div>

                <div class="tab-pane fade" id="bank">
                  <form action="request_handler.php" method="post">
                    <input type="hidden" name="agent_id" value="<?php echo $bank['agent_id']; ?>">
                    <div class="row g-3">
                      <div class="col-md-6"><label class="form-label">Account Holder</label><input type="text" class="form-control" name="acc_holder" value="<?php echo htmlspecialchars($bank['account_holder']); ?>"></div>
                      <div class="col-md-6"><label class="form-label">Account Number</label><input type="text" class="form-control" name="acc_num" value="<?php echo htmlspecialchars($bank['account_number']); ?>"></div>
                      <div class="col-md-6"><label class="form-label">IFSC Code</label><input type="text" class="form-control" name="ifsc_code" value="<?php echo htmlspecialchars($bank['IFSC_code']); ?>"></div>
                      <div class="col-md-6"><label class="form-label">Bank Name</label><input type="text" class="form-control" name="bank_name" value="<?php echo htmlspecialchars($bank['bank_name']); ?>"></div>
                      <div class="col-md-6"><label class="form-label">USDT Wallet</label><input type="text" class="form-control" name="usdt" value="<?php echo htmlspecialchars($bank['usdt']); ?>"></div>
                    </div>
                    <div class="mt-3 text-end">
                      <button type="submit" name="bank_detail_update" class="btn btn-primary">Save Changes</button>
                    </div>
                  </form>
                </div>

                <div class="tab-pane fade" id="password">
                  <form action="request_handler.php" method="post">
                    <input type="hidden" name="agent_id" value="<?php echo $my_id; ?>">
                    <div class="mb-3">
                      <label class="form-label">New Password</label>
                      <input type="password" class="form-control" name="newpassword" required>
                    </div>
                    <div class="mb-3">
                      <label class="form-label">Confirm Password</label>
                      <input type="password" class="form-control" name="renewpassword" required>
                    </div>
                    <div class="text-end">
                      <button type="submit" name="profile_update_password" class="btn btn-primary">Change Password</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="modal fade" id="profileImageModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <form method="post" enctype="multipart/form-data">
            <div class="modal-header">
              <h5 class="modal-title">Upload Profile Photo</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body text-center">
              <input type="hidden" name="agent_id" value="<?php echo $agent['agent_id']; ?>">
              <label for="profile_file" class="upload-box w-100">
                <i class="bi bi-cloud-arrow-up fs-1 text-primary"></i>
                <p class="mb-0 mt-2">Click to select image file</p>
                <input type="file" name="profile_file" id="profile_file" accept="image/*" onchange="previewImg(this)">
              </label>
              <div id="preview-box" class="mt-3" style="display:none;">
                <img id="img-output" src="" style="width:100px; height:100px; border-radius:50%; object-fit:cover;">
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" name="profile_image_upload" class="btn btn-primary">Upload & Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </main>

  <script>
    function previewImg(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById('preview-box').style.display = 'block';
          document.getElementById('img-output').src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
      }
    }
  </script>

  <?php require_once("resources/footer.php"); ?>
  <?php require_once("resources/footer_links.php"); ?>
</body>
</html>
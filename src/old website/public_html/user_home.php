<?php
require_once("resources/connection_build.php");
require_once("resources/check_login.php");
require_once("resources/function.php");

// Fetch ads from DB
$adsData = [];
$direct_agent_list_query = mysqli_query($conn, "SELECT * FROM `ads_management`");
while ($row = mysqli_fetch_assoc($direct_agent_list_query)) {
    $adsData[] = $row;
}

// Fetch agent details
$detail = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$my_id'"));

// Fetch all agents income details (for wallet chart)
$wallet_agent_ids = [];
$wallets = [];
$upgrades = [];
$wallet_dates = [];
$result = mysqli_query($conn, "SELECT agent_id, wallet, upgrade_amt, created_at FROM `agent_income` WHERE `agent_id`='$my_id' ORDER BY created_at ASC");
while ($row = mysqli_fetch_assoc($result)) {
    $wallet_agent_ids[] = $row['agent_id'];
    $wallets[] = $row['wallet'] !== null ? (float)$row['wallet'] : 0;
    $upgrades[] = $row['upgrade_amt'] !== null ? (float)$row['upgrade_amt'] : 0;
    $wallet_dates[] = $row['created_at'];
}

// User Growth by Month
$user_growth_labels = [];
$user_growth_counts = [];

$growth_query = "
    SELECT DATE_FORMAT(reg_date, '%Y-%m') AS month, COUNT(*) AS total_users
    FROM agent
    WHERE sponsor_id = '$my_id'
    GROUP BY DATE_FORMAT(reg_date, '%Y-%m')
    ORDER BY month ASC
";
$growth_result = mysqli_query($conn, $growth_query);

while ($row = mysqli_fetch_assoc($growth_result)) {
    $user_growth_labels[] = $row['month'];
    $user_growth_counts[] = (int)$row['total_users'];
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<title>3T Dashboard</title>
<?php require_once("resources/header_links.php"); ?>

<style>
    .ads-card {
      background: #fff;
      border: 1px solid #dee2e6;
      border-radius: 0.5rem;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, .075);
      overflow: hidden;
      margin: 1rem auto;
      max-width: 500px;
      position: relative;
    }
    .ad-badge {position: absolute;top: 0.75rem;left: 0.75rem;background: #ff9800;color: white;font-size: 0.75rem;font-weight: bold;padding: 0.25rem 0.5rem;border-radius: 0.25rem;z-index: 10;}
    .ad-content {position: relative;height: 200px;display: flex;align-items: center;justify-content: center;overflow: hidden;}
    .ad-content img,.ad-content video {max-width: 100%;max-height: 100%;object-fit: cover;transition: transform 0.5s ease;}
    .ad-content img:hover,.ad-content video:hover {transform: scale(1.03);}
    .ad-content p {font-size: 1rem;color: #111827;margin: 0;padding: 8px;}
    .fade-in {animation: fadeIn 0.6s ease-in-out;}
    @keyframes fadeIn {from {opacity: 0;transform: translateY(10px);}to {opacity: 1;transform: translateY(0);}}
    .progress-bar {position: absolute;bottom: 0;left: 0;height: 4px;background: #3b82f6;width: 0%;transition: width linear;}
</style>
</head>
<body>
<main id="main" class="main">

<!-- Ad Section -->
<div class="container mt-4">
  <div class="ads-card">
    <a id="adLink" target="_blank" style="display:block; text-decoration:none; color:inherit;">
      <div class="ad-content fade-in" id="adArea"></div>
    </a>
    <div class="progress-bar" id="progressBar"></div>
  </div>
</div>

<!-- Navigation -->
<div class="container mt-4">
  <div class="row text-center mb-4">
    <div class="col-4"><a href="profile.php"><i class="bi bi-person-circle fs-1"></i><div>Profile</div></a></div>
    <div class="col-4"><a href="dashboard.php"><i class="bi bi-wallet2 fs-1"></i><div>Affiliate Wallet</div></a></div>
    <div class="col-4"><a href="mycourses.php"><i class="bi bi-book fs-1"></i><div>My Courses</div></a></div>
  </div>

  <!-- Charts -->
  <div class="row mb-4">
    <div class="col-md-6">
      <div class="card shadow-sm">
        <div class="card-header">Earnings Overview</div>
        <div class="card-body">
          <canvas id="walletChart" height="120"></canvas>
        </div>
      </div>
    </div>
    <div class="col-md-6">
      <div class="card shadow-sm">
        <div class="card-header">User Growth</div>
        <div class="card-body">
          <canvas id="agentChart" height="120"></canvas>
        </div>
      </div>
    </div>
  </div>
</div>
</main>

<!-- Chart.js -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
// Wallet Chart Data
const walletAgentIDs = <?php echo json_encode($wallet_agent_ids); ?>;
const walletData = <?php echo json_encode($wallets); ?>;
const upgradeData = <?php echo json_encode($upgrades); ?>;
const walletDates = <?php echo json_encode($wallet_dates); ?>;

// Earnings Chart
new Chart(document.getElementById('walletChart').getContext('2d'), {
  type: 'bar',
  data: {
    labels: walletAgentIDs,
    datasets: [
      {label: 'Wallet (₹)', data: walletData, backgroundColor: 'rgba(54,162,235,0.6)', borderColor: 'rgba(54,162,235,1)', borderWidth: 1},
      {label: 'Upgrade Amount (₹)', data: upgradeData, backgroundColor: 'rgba(255,99,132,0.6)', borderColor: 'rgba(255,99,132,1)', borderWidth: 1}
    ]
  },
  options: {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            return "Date: " + walletDates[context.dataIndex];
          }
        }
      }
    }
  }
});

// Ads Logic
const adsFromDB = <?php echo json_encode($adsData); ?>;
const ads = adsFromDB.map(ad => {
  const url = ad.file_url;
  const ext = url.split('.').pop().toLowerCase();
  let type = "text";
  if (['mp4','webm','ogg'].includes(ext)) type = "video";
  else if (['jpg','jpeg','png','gif','webp'].includes(ext)) type = "image";
  return {type, src: url, content: ad.ads_head || "Advertisement", link: ad.redirect_url || "#"};
});

let index = 0, timer;
const adArea = document.getElementById("adArea");
const adLink = document.getElementById("adLink");
const progressBar = document.getElementById("progressBar");

function showAd() {
  const currentAd = ads[index];
  adArea.innerHTML = "";
  adLink.href = currentAd.link;

  if (currentAd.type === "image") {
    const img = document.createElement("img");
    img.src = currentAd.src;
    adArea.appendChild(img);
    startProgress(5000);
    timer = setTimeout(nextAd, 5000);
  } else if (currentAd.type === "video") {
    const video = document.createElement("video");
    video.src = currentAd.src;
    video.autoplay = true;
    video.muted = true;
    adArea.appendChild(video);
    video.onloadedmetadata = () => {
      startProgress(video.duration * 1000);
    };
    video.onended = nextAd;
  } else {
    const p = document.createElement("p");
    p.textContent = currentAd.content;
    adArea.appendChild(p);
    startProgress(5000);
    timer = setTimeout(nextAd, 5000);
  }
}

function nextAd() {
  clearTimeout(timer);
  index = (index + 1) % ads.length;
  showAd();
}

function startProgress(duration) {
  progressBar.style.transition = "none";
  progressBar.style.width = "0%";
  setTimeout(() => {
    progressBar.style.transition = `width ${duration}ms linear`;
    progressBar.style.width = "100%";
  }, 50);
}

showAd();

// Agent Growth Chart
const growthLabels = <?php echo json_encode($user_growth_labels); ?>;
const growthCounts = <?php echo json_encode($user_growth_counts); ?>;


new Chart(document.getElementById('agentChart').getContext('2d'), {
  type: 'line', // or 'bar'
  data: {
    labels: growthLabels,
    datasets: [{
      label: 'New Users per Month',
      data: growthCounts,
      fill: true,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
      tension: 1
    }]
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'User Growth by Month',
        font: { size: 18 }
      }
    },
    scales: {
      x: { title: { display: true, text: 'Month' } },
      y: { beginAtZero: true, title: { display: true, text: 'Users' }, stepSize: 1 }
    }
  }
});
</script>

<?php require_once("resources/header.php"); ?>
<?php require_once("resources/sidebar.php"); ?>
<?php require_once("resources/footer.php"); ?>
<?php require_once("resources/footer_links.php"); ?>
</body>
</html>

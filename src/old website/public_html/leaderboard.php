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
  <title>Leaderboard</title>

  <?php require_once("resources/header_links.php"); ?>
  <link rel="stylesheet" href="assets/css/leader.css">

  <style>
    .leaderboard {
      background: #fff;
      border-radius: 20px;
      padding: 25px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, .1);
    }

    .leaderboard h3 {
      font-weight: 600;
      margin-bottom: 20px;
    }

    .leader-tabs ul {
      display: flex;
      gap: 15px;
      list-style: none;
      padding: 0;
    }

    .leader-tabs ul li {
      padding: 8px 16px;
      border-radius: 25px;
      cursor: pointer;
      transition: 0.3s;
      background: #f1f1f1;
    }

    .leader-tabs ul li.active {
      background: #007bff;
      color: #fff;
      font-weight: 600;
    }

    .lboard_mem {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #f9f9f9;
      border-radius: 15px;
      padding: 15px;
      margin-bottom: 12px;
      transition: 0.3s;
    }

    .lboard_mem:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 15px rgba(0, 0, 0, .08);
    }

    .lboard_mem .img img {
      width: 55px;
      height: 55px;
      border-radius: 50%;
    }

    .lboard_mem .name_bar {
      flex: 1;
      margin-left: 15px;
    }

    .name_bar p {
      margin: 0;
      font-weight: 500;
      font-size: 16px;
    }

    .inner_bar {
      height: 8px;
      background: linear-gradient(90deg, #007bff, #00d4ff);
      border-radius: 20px;
      transition: width 0.6s ease-in-out;
    }

    .points {
      font-weight: 600;
      font-size: 16px;
      color: #28a745;
    }

    /* Medal Styling */
    .rank-badge {
      font-size: 22px;
      margin-right: 6px;
    }
  </style>
</head>

<body>

  <?php
  require_once("resources/header.php");
  require_once("resources/sidebar.php");
  ?>

  <main id="main" class="main">
    <div class="pagetitle">
      <h1>Leaderboard</h1>
      <nav>
        <ol class="breadcrumb">
          <li class="breadcrumb-item"><a href="index.php">Home</a></li>
          <li class="breadcrumb-item active">Leaderboard</li>
        </ol>
      </nav>
    </div>

    <section class="section dashboard">
      <div class="leaderboard">
        <h3>Top Performers</h3>
        <div class="leader-tabs">
          <ul>
            <li class="tab-btn active" data-target="total">Total</li>
            <li class="tab-btn" data-target="today">Today</li>
            <li class="tab-btn" data-target="month">This Month</li>
          </ul>
        </div>

        <div class="tab-content">

          <!-- TOTAL -->
          <div class="tab-pane total active">
            <?php
            $totel = mysqli_query($conn, "SELECT agent_id, SUM(amt) as total_amt FROM wallet_history WHERE status='0' GROUP BY agent_id ORDER BY total_amt DESC LIMIT 5");
            $rank = 0;
            $maxVal = 0;
            if ($row = mysqli_fetch_array($totel)) {
              $maxVal = $row['total_amt'];
              mysqli_data_seek($totel, 0); // reset pointer
            }
            while ($data = mysqli_fetch_array($totel)) {
              $agent = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM agent WHERE agent_id='{$data['agent_id']}'"));
              $rank++;
              $badge = ($rank == 1) ? "🥇" : (($rank == 2) ? "🥈" : (($rank == 3) ? "🥉" : "🏅"));
            ?>
              <div class="lboard_mem">
                <div class="img"><img src="assets/img/<?php echo $agent['package']; ?>.png"></div>
                <div class="name_bar">
                  <p><span class="rank-badge"><?= $badge ?></span> <?= $agent['agent_name']; ?></p>
                  <div class="bar_wrap">
                    <div class="inner_bar" style="width: <?= ($data['total_amt'] / $maxVal) * 100 ?>%"></div>
                  </div>
                </div>
                <div class="points">₹<?= $data['total_amt']; ?></div>
              </div>
            <?php } ?>
          </div>

          <!-- TODAY -->
          <div class="tab-pane today" style="display:none;">
            <?php
            $date = date('Y-m-d');
            $today = mysqli_query($conn, "SELECT agent_id, SUM(amt) as total_amt FROM wallet_history WHERE date_time>='$date' and status='0' GROUP BY agent_id ORDER BY total_amt DESC LIMIT 5");
            $rank = 0;
            $maxVal = 0;
            if ($row = mysqli_fetch_array($today)) {
              $maxVal = $row['total_amt'];
              mysqli_data_seek($today, 0);
            }
            while ($data = mysqli_fetch_array($today)) {
              $agent = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM agent WHERE agent_id='{$data['agent_id']}'"));
              $rank++;
              $badge = ($rank == 1) ? "🥇" : (($rank == 2) ? "🥈" : (($rank == 3) ? "🥉" : "🏅"));
            ?>
              <div class="lboard_mem">
                <div class="img"><img src="assets/img/<?php echo $agent['package']; ?>.png"></div>
                <div class="name_bar">
                  <p><span class="rank-badge"><?= $badge ?></span> <?= $agent['agent_name']; ?></p>
                  <div class="bar_wrap">
                    <div class="inner_bar" style="width: <?= ($data['total_amt'] / $maxVal) * 100 ?>%"></div>
                  </div>
                </div>
                <div class="points">₹<?= $data['total_amt']; ?></div>
              </div>
            <?php } ?>
          </div>

          <!-- MONTH -->
          <div class="tab-pane month" style="display:none;">
            <?php
            $date = date('Y-m') . '-01';
            $month = mysqli_query($conn, "SELECT agent_id, SUM(amt) as total_amt FROM wallet_history WHERE date_time>='$date' and status='0' GROUP BY agent_id ORDER BY total_amt DESC LIMIT 5");
            $rank = 0;
            $maxVal = 0;
            if ($row = mysqli_fetch_array($month)) {
              $maxVal = $row['total_amt'];
              mysqli_data_seek($month, 0);
            }
            while ($data = mysqli_fetch_array($month)) {
              $agent = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM agent WHERE agent_id='{$data['agent_id']}'"));
              $rank++;
              $badge = ($rank == 1) ? "🥇" : (($rank == 2) ? "🥈" : (($rank == 3) ? "🥉" : "🏅"));
            ?>
              <div class="lboard_mem">
                <div class="img"><img src="assets/img/<?php echo $agent['package']; ?>.png"></div>
                <div class="name_bar">
                  <p><span class="rank-badge"><?= $badge ?></span> <?= $agent['agent_name']; ?></p>
                  <div class="bar_wrap">
                    <div class="inner_bar" style="width: <?= ($data['total_amt'] / $maxVal) * 100 ?>%"></div>
                  </div>
                </div>
                <div class="points">₹<?= $data['total_amt']; ?></div>
              </div>
            <?php } ?>
          </div>

        </div>
      </div>
    </section>
  </main>

  <?php
  require_once("resources/footer.php");
  require_once("resources/footer_links.php");
  ?>

  <script>
    // Tab Switching
    document.querySelectorAll(".tab-btn").forEach(tab => {
      tab.addEventListener("click", function() {
        document.querySelectorAll(".tab-btn").forEach(btn => btn.classList.remove("active"));
        document.querySelectorAll(".tab-pane").forEach(pane => pane.style.display = "none");

        this.classList.add("active");
        document.querySelector("." + this.dataset.target).style.display = "block";
      });
    });
  </script>
</body>
</html>

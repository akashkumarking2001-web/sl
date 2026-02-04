<?php
require_once("resources/connection_build.php");
// require_once("resources/check_login.php");
require_once("resources/function.php");
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta content="width=device-width, initial-scale=1.0" name="viewport" />
  <title>Skill Learners</title>

  <!-- External Files -->
  <?php require_once("resources/header_links.php"); ?>
  <?php require_once("resources/ad.php"); ?>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;700&display=swap" rel="stylesheet" />

  <!-- Bootstrap CSS -->
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <!-- Bootstrap Icons -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css" />

  <style>
    body {
      margin: 0;
      overflow-x: hidden;
      scroll-behavior: smooth;
      font-family: 'Poppins', sans-serif; 
    }
    .navbar {
      background-color: #1e3a8a !important; 
      border-radius: 0 0 15px 15px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    .navbar .nav-link,
    .navbar-brand {
      color: #fff !important;
    }
    .navbar .nav-link.active {
      font-weight: 600;
    }
    section {
      padding: 60px 0;
    }
    footer {
      margin: 3rem 0 1rem;
      text-align: center;
      font-size: 0.85rem;
      color: #555;
    }
    .footer .bi {
      color: #555;
      transition: color 0.3s;
    }
    .footer .bi:hover {
      color: #007bff;
    }
    section h2 {
  font-size: 2rem;
      position: relative;
      display: inline-block;
    }
    
    section h2::after {
      content: "";
      display: block;
      width: 60px;
      height: 3px;
      background: currentColor;
      margin-top: 8px;
}

    .package-card {
      background: #f8f9fa;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    
    .package-card:hover {
      background: #0d6efd;
      color: #fff;
      transform: translateY(-5px);
    }
    
    .package-card:hover p {
      color: #e9ecef;
    }

  </style>
  
</head>
<body>

<!-- Bootstrap Navbar -->
<nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top px-3 py-2">
  <div class="container">
    <!-- Logo -->
    <a class="navbar-brand d-flex align-items-center" href="#">
      <img src="./assets/img/logo.png"
           style="width: 100px; height: 44px; transform: scale(1.6) translateY(-3px);"
           class="me-2" />
    </a>

    <!-- Toggler -->
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navcol-3" aria-controls="navcol-3" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Navbar links -->
    <div class="collapse navbar-collapse" id="navcol-3">
      <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link active" href="./index.php">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="./index.php#plans">Plans</a></li>
        <li class="nav-item"><a class="nav-link" href="./index.php#tutorial">Tutorial</a></li>
        <li class="nav-item"><a class="nav-link" href="./index.php#about">About</a></li>
        <li class="nav-item"><a class="nav-link" href="./index.php#contact">Contact</a></li>
      </ul>
      <button class="btn btn-primary" onclick="location.href='login.php';">Login/SignUp</button>
    </div>
  </div>
</nav>



<!-- Mission Section -->
<section id="mission" class="py-5 bg-white">
  <div class="container">
    <div class="row align-items-center flex-md-row-reverse">
      <!-- Image -->
      <div class="col-md-6 mb-4 mb-md-0">
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c" 
             alt="Mission" class="img-fluid rounded shadow">
      </div>
      <!-- Text -->
      <div class="col-md-6">
        <h2 class="fw-bold text-success mb-3">About</h2>
        <p class="lead text-muted">
         At Skill Learners, our mission is to help you unlock your potential in the digital world. We offer high-quality video courses created by industry experts in fields like AI and digital marketing and More . These courses provide practical, hands-on skills to advance your career and create new income streams. More than just courses, we are a community that offers support, mentorship, and tools to help you achieve your professional aspirations and financial freedom.
        </p>
      </div>
    </div>
  </div>
</section>


<!-- Vision Section -->
<section id="vision" class="py-5 bg-light">
  <div class="container">
    <div class="row align-items-center">
      <!-- Image -->
      <div class="col-md-6 mb-4 mb-md-0">
        <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" 
             alt="Vision" class="img-fluid rounded shadow">
      </div>
      <!-- Text -->
      <div class="col-md-6">
        <h2 class="fw-bold text-primary mb-3">Our Vision</h2>
        <p class="lead text-muted">
          Our vision is to be a global leader in transforming lives through online education, empowering individuals worldwide to unlock their full potential, thrive in the digital age, and achieve fulfilling lives with financial freedom.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Mission Section -->
<section id="mission" class="py-5 bg-white">
  <div class="container">
    <div class="row align-items-center flex-md-row-reverse">
      <!-- Image -->
      <div class="col-md-6 mb-4 mb-md-0">
        <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c" 
             alt="Mission" class="img-fluid rounded shadow">
      </div>
      <!-- Text -->
      <div class="col-md-6">
        <h2 class="fw-bold text-success mb-3">Our Mission</h2>
        <p class="lead text-muted">
          Our mission is to empower individuals to unlock their full potential and thrive in the digital age through our online courses. We aim to create a supportive community for learning and career growth, providing high-quality education, practical training, and expert guidance.
        </p>
      </div>
    </div>
  </div>
</section>

<!-- Goal Section -->
<section id="goal" class="py-5 bg-light">
  <div class="container">
    <div class="row align-items-center">
      <!-- Image -->
      <div class="col-md-6 mb-4 mb-md-0">
        <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d" 
             alt="Goal" class="img-fluid rounded shadow">
      </div>
      <!-- Text -->
      <div class="col-md-6">
        <h2 class="fw-bold text-danger mb-3">Our Goal</h2>
        <p class="lead text-muted">
          Our main goal is to provide innovative online courses tailored to future technologies and market trends, developing practical skills essential for career advancement and creating income-generating opportunities.
        </p>
      </div>
    </div>
  </div>
</section>




  <!-- Contact & Packages -->
  <section id="contact" class="py-5">
    <div class="container" data-aos="fade-up" data-aos-duration="2000">
      <div class="main-card shadow-lg">

        <div class="row equal-cols g-4">

          <!-- Contact Info -->
          <div class="col-6">
            <h2 class="fw-bold  mb-4" style="color:white">Contact Info</h2>

            <div class="info-item">
              <i class="bi bi-geo-alt"></i>
              <div>
                <h6>Address</h6>
                <p>Tirunelveli</p>
              </div>
            </div>

            <div class="info-item">
              <i class="bi bi-telephone"></i>
              <div>
                <h6>Call Us</h6>
                <p>+91 7200568504</p>
              </div>
            </div>

            <div class="info-item">
              <i class="bi bi-envelope"></i>
              <div>
                <h6>Email Us</h6>
                <p>SkillLearnermoneyworld@gmail.com</p>
              </div>
            </div>

            <div class="info-item">
              <i class="bi bi-clock"></i>
              <div>
                <h6>Open Hours</h6>
                <p>Mon - Sun | 9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>

          <!-- Packages -->
          <div class="col-6">
            <h2 class="fw-bold  mb-4" style="color:white">Our Packages</h2>

            <div class="package-list">
              <h6>Basic</h6>
              <p>Starter features</p>

              <h6>Standard</h6>
              <p>For regular users</p>

              <h6>Advanced</h6>
              <p>Extra features</p>

              <h6>Pro</h6>
              <p>Professional tools</p>

              <h6>Elite</h6>
              <p>All-inclusive plan</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  </section>

  
<!-- Footer -->
<footer class="footer">
  <div class="copyright">
    &copy; 2023 <strong><span>Skill Learnermoneyworld</span></strong>. All rights reserved.
  </div>
  <div class="credits">
    <a href="https://www.instagram.com/Skill Learnermoneyworld"><i class="bi bi-instagram"></i></a>
    <a href="https://www.facebook.com/people/Skill Learner-MONEY-WORLD/100089099331682/?mibextid=ZbWKwL"><i class="bi bi-facebook"></i></a>
    <a href="https://t.me/TTTMONEYWORLDOFFICIAL"><i class="bi bi-telegram"></i></a>
    <a href="https://youtube.com/@Skill Learnermoneyworld"><i class="bi bi-youtube"></i></a>
  </div>
</footer>

<!-- Scripts -->
<?php require_once("resources/footer_links.php"); ?>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>


  <style>
  #contact h6{
      color:white;
  }
   .main-card {
      background-color: #1e3a8a;
      border-radius: 15px;
      padding: clamp(20px, 3vw, 40px);
    }
    .main-card h2 {
      font-size: clamp(18px, 2vw, 28px);
    }
    .info-item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
    }
    .info-item i {
      font-size: 1.5rem;
      margin-right: 12px;
      color: #0d6efd;
    }
    .info-item h6 {
      margin: 0;
      font-size: clamp(12px, 1.5vw, 16px);
      font-weight: 600;
    }
    .info-item p {
      margin: 0;
      font-size: clamp(11px, 1.2vw, 14px);
      color: #adb5bd;
    }
    .package-list h6 {
      font-weight: 600;
      font-size: clamp(12px, 1.5vw, 16px);
      margin-bottom: 4px;
    }
    .package-list p {
      font-size: clamp(11px, 1.2vw, 14px);
      color: #adb5bd;
      margin-bottom: 12px;
    }
    /* Keep columns side by side, stack on small screens */
    @media (max-width: 576px) {
      .row.equal-cols {
        flex-wrap: wrap;
      }
    }
    .row.equal-cols {
      display: flex;
      flex-wrap: nowrap;
    }
    .row.equal-cols > [class*="col-"] {
      flex: 1;
    }
  </style>
  
  
</body>
</html>

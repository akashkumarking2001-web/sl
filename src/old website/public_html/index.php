<?php
require_once("resources/connection_build.php");
// require_once("resources/check_login.php");
require_once("resources/function.php");


$agent_count_data = mysqli_fetch_array(mysqli_query($conn, "SELECT count(agent_id) as total_agent FROM `agent`"));
$active_count_data = mysqli_fetch_array(mysqli_query($conn, "SELECT count(agent_id) as total_agent FROM `agent` WHERE `status` = '1'"));

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

  <!-- Google Fonts -->
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
    .hero-blend-img {
      border-radius: 25px;
      mask-image: radial-gradient(circle, rgba(2,2,2,2) 50%, rgba(0,0,0,0) 100%);
      mask-repeat: no-repeat;
      mask-size: cover;
      background-color: transparent;
    }
    section {
      padding: 60px 0;
    }
    .pricing-card:hover {
      transform: translateY(-5px);
      transition: all 0.3s ease-in-out;
      border: 1px solid #dbeafe;
    }
  </style>
  
  <style>
  
      .roadmap {
      position: relative;
      padding: 20px 0;
    }

    /* Dotted Vertical Path */
    .roadmap::before {
      content: "";
      position: absolute;
      top: 0;
      left: 50%;
      width: 4px;
      height: 100%;
      border-left: 3px dashed #ccc;
      transform: translateX(-50%);
      z-index: 0;
    }

    .milestone {
      position: relative;
      width: 45%;
      margin: 50px 0;
      padding: 20px;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .milestone.left {
      float: left;
      clear: both;
      transform: translateX(-5%);
    }

    .milestone.right {
      float: right;
      clear: both;
      transform: translateX(5%);
    }

    .milestone::before {
      content: "";
      position: absolute;
      top: 20px;
      width: 20px;
      height: 20px;
      background: red;
      border-radius: 50%;
      border: 3px solid #fff;
      box-shadow: 0 0 0 3px #ccc;
      z-index: 1;
    }

    .milestone.left::before {
      right: -45px;
    }

    .milestone.right::before {
      left: -45px;
    }

    .milestone h3 {
      margin: 0 0 10px;
      color: #222;
    }

    .milestone p {
      margin: 0;
      font-size: 14px;
      line-height: 1.6;
      color: #555;
    }

    /* Clearfix */
    .roadmap::after {
      content: "";
      display: table;
      clear: both;
    }
    
    
    .question {
      font-weight: 600;
      cursor: pointer;
      margin: 1rem 0 0.5rem 0;
      padding: 0.75rem 1rem;
      background-color: #f1f1f1;
      border-radius: 4px;
    }
    .answer {
      display: none;
      margin-bottom: 1rem;
      padding-left: 1.5rem;
      border-left: 3px solid #0d6efd;
      color: #333;
    }
  </style>
  
  
  <!-- Styles for Animations and Icons -->
<style>
  
    /*Course Card Ul list */
    
     .list-unstyled li {
      display: flex;
      align-items: center;  /* vertically align icon & text */
      gap: 8px;             /* space between icon and text */
      margin-bottom: 8px;   /* spacing between rows */
    }
    
    .list-unstyled li i {
      font-size: 1.2rem;    /* adjust icon size */
      flex-shrink: 0;       /* prevent icon from shrinking */
    }

  /* General icon styling */
  .icon-container {
    width: 80px;
    height: 80px;
    background-color: #007bff;
    border-radius: 50%;
    transition: transform 0.3s ease-in-out, box-shadow 0.3s ease;
    color: white;
  }

  .icon-container:hover {
    transform: scale(1.2);
    box-shadow: 0px 4px 15px rgba(0, 123, 255, 0.4);
  }

  /* Icon animation for fade-in and scaling */
  .icon-container i {
    font-size: 36px;
    animation: fadeInScale 1s ease-out forwards;
  }

  @keyframes fadeInScale {
    0% {
      opacity: 0;
      transform: scale(0.5);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }

  /* Adding smooth transition for number increments */
  .fw-bold {
    font-size: 36px;
    transition: transform 0.5s ease-in-out;
  }

  /* Adding hover effect on the number display */
  .fw-bold:hover {
    transform: scale(1.1);
    color: #007bff;
  }

  /* Styling the section */
  #tutorial {
    background-color: #f8f9fa;
  }

  /* Count-up number animation */
  .count {
    display: inline-block;
    font-size: 48px;
    font-weight: bold;
    animation: countUp 3s ease-in-out forwards;
  }

  /* Keyframes for count-up animation */
  @keyframes countUp {
    0% {
      transform: translateY(20px);
      opacity: 0;
    }
    50% {
      transform: translateY(0px);
      opacity: 1;
    }
    100% {
      transform: translateY(-20px);
      opacity: 1;
    }
  }
  
  
</style>
</head>
<body>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg sticky-top px-3 py-2">
  <div class="container">
        <a class="navbar-brand d-flex align-items-center" href="#">
         <img src="./assets/img/logo.png"
           style="width: 100px; height: 44px; transform: scale(1.6) translateY(-3px);"
           class="me-2" />
         </a>

    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navcol-3">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navcol-3">
      <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
        <li class="nav-item"><a class="nav-link active" href="#top">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="#plan">Plans</a></li>
        <li class="nav-item"><a class="nav-link" href="#getstarted">Tutorial</a></li>
        <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
        <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
      </ul>
      <button class="btn btn-primary" onclick="location.href='login.php';">Login/SignUp</button>
    </div>
  </div>
</nav>

<!-- Hero Section -->
<section class="hero-section py-5" id="top" style="background: linear-gradient(135deg, #e0ecff, #ffffff);">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-6 text-center text-lg-start">
        <h1 class="display-5 fw-bold mb-3">Welcome to <span style="color:#1e3a8a;">Skill Learners</span></h1>
        <p class="lead mb-4">Unlock Your Potential of Learn, Earn and <br /> Build Your Path to Financial Freedom</p>
        <ul class="list-unstyled mb-4">
          <li><i class="bi bi-check-circle text-primary me-2"></i>10+ Skill-based Video Courses</li>
          <li><i class="bi bi-check-circle text-primary me-2"></i>Get 7 + income opportunity</li>
          <li><i class="bi bi-check-circle text-primary me-2"></i>Earn 10%–30% per Referral</li>
        </ul>
        <a href="#plan" class="btn btn-outline-primary btn-lg">Explore Plans</a>
        <a href="./register.php" class="btn btn-primary btn-lg me-2">Register Now</a>
      </div>
      <div class="col-lg-6 text-center mt-4 mt-lg-0">
        <img src="./assets/img/LL.png" alt="Online Learning" class="img-fluid hero-blend-img" style="max-height: 400px;" />
      </div>
    </div>
  </div>
</section>

<!-- Dynamic Count Section with 3D Realistic Look -->
<section id="tutorial" class="py-5" style="background: #f0f4f8;">
  <div class="container text-center">
    <div class="row gy-5 row-cols-1 row-cols-md-3 justify-content-center">

      <!-- Total Students -->
      <div class="col">
        <div class="card border-0 shadow-lg p-4" style="border-radius:50px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px);">
          <img src="https://cdn-icons-png.flaticon.com/512/4333/4333609.png" alt="Students" width="100" class="mx-auto mb-3" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));">
          <h2 class="fw-bold text-primary mb-0 count" id="totalStudents">0</h2>
          <p class="text-muted mb-0">Total Students</p>
        </div>
      </div>

      <!-- Total Active Members -->
      <div class="col">
        <div class="card border-0 shadow-lg p-4" style="border-radius: 50px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px);">
          <img src="https://cdn-icons-png.flaticon.com/512/706/706830.png" alt="Active Members" width="100" class="mx-auto mb-3" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));">
          <h2 class="fw-bold text-success mb-0 count" id="totalActiveMembers">0</h2>
          <p class="text-muted mb-0">Total Active Members</p>
        </div>
      </div>

      <!-- Total Courses -->
      <div class="col">
        <div class="card border-0 shadow-lg p-4" style="border-radius: 50px; background: rgba(255, 255, 255, 0.9); backdrop-filter: blur(10px);">
          <img src="https://cdn-icons-png.flaticon.com/512/2906/2906274.png" alt="Courses" width="100" class="mx-auto mb-3" style="filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));">
          <h2 class="fw-bold text-warning mb-0 count" id="totalCourses">0</h2>
          <p class="text-muted mb-0">Total Courses</p>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- About Section -->
<section id="about" class="py-5 bg-white" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
  <div class="container text-center">
    <h2 class="mb-4 fw-bold text-primary">About</h2>
    <div class="container text-center my-5">
      <p id="about-text" class="lead text-muted mb-4" style="line-height: 1.8;">
        <strong>Skill Learner</strong> Our mission is simple: to ignite the spark that transforms curiosity into capability. 
        We believe everyone deserves the chance to unlock their full potential and thrive in the digital age. 
        Skill Learner is designed to be your guide on this journey. You'll find a wide range of video courses – 
        <span id="more-text" style="display: none;">
          from bite-sized tutorials to in-depth programs – created by industry experts in fields like artificial intelligence, 
          digital marketing, and more. Each course is built to provide you with practical, hands-on skills you can use immediately 
          to advance your career or create new income streams. But Skill Learner is more than just courses. We're a community. 
          Here, you'll connect with a supportive network of peers and mentors, access practical toolkits, and find guidance to 
          help you achieve your professional aspirations and financial goals. Our ultimate aim is to empower you to build a 
          fulfilling life and achieve true financial freedom.
        </span>
        <a href="vision_mission.php" class="btn -primary b-3">Know More</a>
      </p>

 
    </div>
  </div>
</section>


<!-- Plans Section -->
<section id="plan" class="bg-light py-5">
  <div class="container text-center">
    <h2 class="mb-4 fw-bold">Our Plans</h2>
    <p class="lead text-muted mb-5">
      Choose the right plan that suits your learning needs and budget.
    </p>

    <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 justify-content-center">

      <!-- Silver Plan -->
      <div class="col">
        <div class="card border-0 shadow-lg h-100 bg-light">
          <div class="card-body p-4 d-flex flex-column text-start">
            <h5 class="card-title fw-bold text-primary">
              <i class="bi bi-stars me-2"></i>Silver
            </h5>

            <p class="text-muted mb-4">
              Perfect for starters with access to 10 beginner-level courses.
            </p>

            <h3 class="fw-bold text-dark text-center">
              ₹500 <small class="text-muted fs-6">/month</small>
            </h3>

            <ul class="list-unstyled my-4">
              <li><i class="bi bi-check-circle text-success me-2"></i>10+ Basic Courses</li>
              <li><i class="bi bi-check-circle text-success me-2"></i>Email Support</li>
              <li><i class="bi bi-check-circle text-success me-2"></i>Access on Mobile & Web</li>
            </ul>

            <a href="register.php" class="btn btn-outline-primary w-100 mt-auto">
              Get Started
            </a>
          </div>
        </div>
      </div>

      <!-- Gold Plan -->
      <div class="col">
        <div class="card border-0 shadow-lg h-100 bg-white position-relative">
          <span class="badge bg-danger position-absolute top-0 end-0 m-3">
            Popular
          </span>

          <div class="card-body p-4 d-flex flex-column text-start">
            <h5 class="card-title fw-bold text-danger">
              <i class="bi bi-gem me-2"></i>Gold
            </h5>

            <p class="text-muted mb-4">
              Unlimited course access with certificates and priority support.
            </p>

            <h3 class="fw-bold text-dark text-center">
              ₹1000 <small class="text-muted fs-6">/month</small>
            </h3>

            <ul class="list-unstyled my-4">
              <li><i class="bi bi-check-circle-fill text-success me-2"></i>All Basic Features</li>
              <li><i class="bi bi-check-circle-fill text-success me-2"></i>Certificates Included</li>
              <li><i class="bi bi-check-circle-fill text-success me-2"></i>Community Access</li>
            </ul>

            <a href="register.php" class="btn btn-danger w-100 mt-auto">
              Upgrade Now
            </a>
          </div>
        </div>
      </div>

      <!-- Diamond Plan -->
      <div class="col">
        <div class="card border-0 shadow-lg h-100" style="background-color: #e9fbe5;">
          <div class="card-body p-4 d-flex flex-column text-start">
            <h5 class="card-title fw-bold text-success">
              <i class="bi bi-award me-2"></i>Diamond
            </h5>

            <p class="text-muted mb-4">
              Includes everything with career mentorship & 1-on-1 guidance.
            </p>

            <h3 class="fw-bold text-dark text-center">
              ₹2500 <small class="text-muted fs-6">/month</small>
            </h3>

            <ul class="list-unstyled my-4">
              <li><i class="bi bi-check2-circle text-success me-2"></i>Pro Features Included</li>
              <li><i class="bi bi-check2-circle text-success me-2"></i>Career Mentorship</li>
              <li><i class="bi bi-check2-circle text-success me-2"></i>Job Placement Assistance</li>
            </ul>

            <a href="register.php"
               class="btn btn-success w-100 mt-auto"
               style="background-color: #7ed957; border: none;">
              Join Elite
            </a>
          </div>
        </div>
      </div>

      <!-- Platinum Plan -->
      <div class="col">
        <div class="card border-0 shadow-lg h-100 bg-dark text-white">
          <div class="card-body p-4 d-flex flex-column text-start">
            <h5 class="card-title fw-bold text-warning">
              <i class="bi bi-trophy me-2"></i>Platinum
            </h5>

            <p class="text-light mb-4">
              Everything in Diamond plus lifetime support & VIP webinars.
            </p>

            <h3 class="fw-bold text-white text-center">
              ₹6500 <small class="text-light fs-6">/month</small>
            </h3>

            <ul class="list-unstyled my-4">
              <li><i class="bi bi-check2-circle text-warning me-2"></i>All Diamond Features</li>
              <li><i class="bi bi-check2-circle text-warning me-2"></i>Lifetime VIP Support</li>
              <li><i class="bi bi-check2-circle text-warning me-2"></i>Exclusive Webinars</li>
            </ul>

            <a href="register.php"
               class="btn w-100 mt-auto"
               style="background-color: #ffc107; border: none;">
              Join Platinum
            </a>
          </div>
        </div>
      </div>

    </div>
  </div>
</section>

<!-- Top Courses Section -->
<section id="getstarted" class="bg-light py-5">
  <div class="container text-center">
    <h2 class="mb-4 fw-bold">Top Courses</h2>
    <p class="lead">Explore our most popular skill-building courses curated by experts.</p>

    <div id="coursesCarousel" class="carousel slide" data-bs-ride="carousel" data-bs-interval="3000">
      <div class="carousel-inner">

        <!-- Course 1 -->
        <div class="carousel-item active">
          <div class="card h-100 shadow-sm border-0 mx-auto" style="max-width: 400px;">
            <img src="assets/img/course1.png" class="card-img-top" alt="Course 1 Thumbnail">
            <div class="card-body">
              <h5 class="card-title fw-bold">Web Development Bootcamp</h5>
              <p class="card-text text-muted">Learn HTML, CSS, JavaScript, and modern frameworks to build real-world websites.</p>
              <a href="register.php" class="btn btn-primary w-100">Enroll Now</a>
            </div>
          </div>
        </div>

        <!-- Course 2 -->
        <div class="carousel-item">
          <div class="card h-100 shadow-sm border-0 mx-auto" style="max-width: 400px;">
            <img src="assets/img/course2.png" class="card-img-top" alt="Course 2 Thumbnail">
            <div class="card-body">
              <h5 class="card-title fw-bold">Python for Beginners</h5>
              <p class="card-text text-muted">Master Python programming from scratch and start building applications.</p>
              <a href="register.php" class="btn btn-success w-100">Start Learning</a>
            </div>
          </div>
        </div>

        <!-- Course 3 -->
        <div class="carousel-item">
          <div class="card h-100 shadow-sm border-0 mx-auto" style="max-width: 400px;">
            <img src="assets/img/course3.png" class="card-img-top" alt="Course 3 Thumbnail">
            <div class="card-body">
              <h5 class="card-title fw-bold">Digital Marketing Mastery</h5>
              <p class="card-text text-muted">Become an expert in SEO, Social Media, Ads & Analytics to grow any business.</p>
              <a href="register.php" class="btn btn-warning w-100 text-dark">Join Course</a>
            </div>
          </div>
        </div>

      </div>

      <!-- Carousel Controls -->
      <button class="carousel-control-prev" type="button" data-bs-target="#coursesCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#coursesCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>

      <!-- Carousel Indicators -->
      <div class="carousel-indicators mt-3">
        <button type="button" data-bs-target="#coursesCarousel" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#coursesCarousel" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#coursesCarousel" data-bs-slide-to="2"></button>
      </div>
    </div>
  </div>
</section>


  <section class="bg-light py-5">
    <div class="container">
      <h3 class="text-center fw-bold mb-4">Frequently Asked Questions</h3>

      <div class="question" onclick="toggleAnswer('faq1')">
        What happens after I purchase?
      </div>
      <div id="faq1" class="answer">
        You'll get instant access to your dashboard with lifetime access to the courses, live training invites, and community groups—no waiting, no friction.
      </div>

      <div class="question" onclick="toggleAnswer('faq2')">
        Is this just theory, or can I actually learn and earn?
      </div>
      <div id="faq2" class="answer">
        Every course is built for real-world application, with live tasks, mentorship, and market-ready skills. We don't just teach; we train you to implement.
      </div>

      <div class="question" onclick="toggleAnswer('faq5')">
        Can I upgrade later if I want more?
      </div>
      <div id="faq5" class="answer">
        You can upgrade your package within 7 days by paying the difference. After that, full pricing applies, so act fast if you're planning ahead.
      </div>

      <div class="question" onclick="toggleAnswer('faq6')">
        What kind of courses do you offer?
      </div>
      <div id="faq6" class="answer">
        We offer courses in future-oriented technologies like artificial intelligence and digital marketing, focusing on practical skills for career advancement and income opportunities.
      </div>

      <div class="question" onclick="toggleAnswer('faq7')">
        How does the community support help me?
      </div>
      <div id="faq7" class="answer">
        Our community provides a supportive space for networking, guidance, and sharing insights to help you achieve your goals.
      </div>

      <div class="question" onclick="toggleAnswer('faq8')">
        Do you help with job placement?
      </div>
      <div id="faq8" class="answer">
        While we don't guarantee job placement, our courses equip you with the skills and support needed for freelancing and job opportunities.
      </div>
    </div>
  </section>
    
  

    <section class="bg-light py-5">
      <div class="container">
        <div class="roadmap">
          <!-- About Us -->
          <div class="milestone left">
            <h3>About <span style="color:red;">Us</span></h3>
            <p>We are a passionate team committed to delivering innovative software solutions, driving business transformation, and enabling long-term success for our clients.</p>
          </div>
    
          <!-- We Speak Your Language -->
          <div class="milestone right">
            <h3>We Speak <span style="color:red;">Your</span> Language</h3>
            <p>In addition to fluency in software applications, we are also fluent in speaking your language.</p>
            <p>- Goal-minded, challenging, uniqueness, sense of ownership, economical approach, delivering quality, innovation embedded, and more.</p>
          </div>
    
          <!-- Recognitions -->
          <div class="milestone left">
            <h3>Recognitions</h3>
            <p>All our team's excellence and smart work never failed to get recognized. Our client retention rate proves our track record and satisfied success stories.</p>
          </div>
    
        </div>
      </div>
    </section>

 <!-- Contact Section -->
<section id="contact" class="bg-light py-5">
  <div class="container" data-aos="fade-up" data-aos-duration="2000">
    <div class="card shadow-lg border-0 rounded-4 p-5">
      <h2 class="text-center fw-bold mb-5">Contact Us</h2>
      <div class="row g-5 align-items-center">
        
        <!-- Contact Info -->
        <div class="col-lg-5">
          <div class="row g-4">
            <div class="col-12">
              <div class="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm">
                <i class="bi bi-geo-alt fs-3 text-primary me-3"></i>
                <div>
                  <h6 class="fw-semibold mb-1">Address</h6>
                  <p class="text-muted mb-0">Tirunelveli</p>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm">
                <i class="bi bi-telephone fs-3 text-primary me-3"></i>
                <div>
                  <h6 class="fw-semibold mb-1">Call Us</h6>
                  <p class="text-muted mb-0">+91 7200568504</p>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm">
                <i class="bi bi-envelope fs-3 text-primary me-3"></i>
                <div>
                  <h6 class="fw-semibold mb-1">Email Us</h6>
                  <p class="text-muted mb-0">SkillLearnermoneyworld@gmail.com</p>
                </div>
              </div>
            </div>
            <div class="col-12">
              <div class="d-flex align-items-center p-3 bg-white rounded-3 shadow-sm">
                <i class="bi bi-clock fs-3 text-primary me-3"></i>
                <div>
                  <h6 class="fw-semibold mb-1">Open Hours</h6>
                  <p class="text-muted mb-0">Mon - Sun | 9:00 AM - 5:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="col-lg-7">
          <div class="bg-white rounded-4 shadow-sm p-4">
            <h4 class="text-center mb-4">Send us a message</h4>
            <form action="request_handler.php" method="post" class="row g-3">
              <div class="col-md-6">
                <input type="text" name="name" class="form-control" placeholder="Your Name" required>
              </div>
              <div class="col-md-6">
                <input type="email" name="email" class="form-control" placeholder="Your Email" required>
              </div>
              <div class="col-12">
                <input type="text" name="phone" class="form-control" placeholder="Phone" required>
              </div>
              <div class="col-12">
                <textarea name="question" class="form-control" rows="5" placeholder="Your Question" required></textarea>
              </div>
              <div class="col-12 text-center">
                <button type="submit" name="ques" class="btn btn-primary px-5 py-2 rounded-pill shadow-sm">
                  Send Message
                </button>
              </div>
            </form>
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

 <!-- JavaScript for toggling answers -->
  <script>
    function toggleAnswer(id) {
      const answer = document.getElementById(id);
      answer.style.display = answer.style.display === "block" ? "none" : "block";
    }
  </script>
  
  
<!-- Counter Animation -->
<script>
  document.addEventListener("DOMContentLoaded", function () {
    const totalStudents = <?php echo (int)$agent_count_data['total_agent']; ?>;
    const totalActiveMembers = <?php echo (int)$active_count_data['total_agent']; ?>;

    function animateCount(id, target) {
      const el = document.getElementById(id);
      let count = 0;
      const step = Math.ceil(target / 100);
      const interval = setInterval(() => {
        count += step;
        if (count >= target) {
          count = target;
          clearInterval(interval);
        }
        el.textContent = count;
      }, 20);
    }

    animateCount("totalStudents", totalStudents);
    animateCount("totalActiveMembers", totalActiveMembers);
    animateCount("totalCourses", 24);
  });
</script>


</body>
</html>

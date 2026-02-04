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
    
        body {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f8f9fa;
      color: #212529;
      line-height: 1.7;
    }
    .policy-container {
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
      padding: 40px;
      max-width: 1000px;
      margin: 40px auto;
    }
    h1, h2, h3 {
      font-weight: 700;
      color: #0d6efd;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    h2 {
      font-size: 1.5rem;
      margin-top: 2rem;
      margin-bottom: 1rem;
    }
    h3 {
      font-size: 1.25rem;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
    }
    p, li {
      font-size: 1rem;
      color: #495057;
    }
    ul {
      padding-left: 20px;
    }
    .effective-date {
      font-size: 0.9rem;
      color: #6c757d;
      margin-bottom: 20px;
    }
    .footer-note {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
      font-size: 0.9rem;
      color: #6c757d;
      text-align: center;
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



  <div class="container">
    <div class="policy-container">
      <h1>Privacy Policy for Skill Learners</h1>
      <p class="effective-date">
        Effective Date: September 2, 2025<br>
        Last Updated: September 2, 2025
      </p>

      <h2>1. Preamble: Our Commitment to Your Privacy</h2>
      <p>
        This Privacy Policy is a legally binding document that outlines the data practices of 
        Skill Learners ("we," "us," or "our"). We are deeply committed to protecting the privacy 
        and security of your personal information. Our goal is to be transparent about the data we 
        collect, how we use it, and the controls you have over your information.
      </p>
      <p>
        By using our website and all related services, including our online courses and 
        affiliate/network marketing programs (collectively, the "Services"), you explicitly consent 
        to the data practices described in this policy. If you do not agree with these terms, 
        please do not use our Services.
      </p>

      <h3>1.1. Definitions</h3>
      <ul>
        <li><strong>Personal Information</strong> means any information that can directly or indirectly identify you.</li>
        <li><strong>Processing</strong> refers to any action performed on Personal Information.</li>
        <li><strong>Services</strong> encompasses our website, courses, and affiliate/network marketing programs.</li>
        <li><strong>You</strong> or <strong>User</strong> refers to any individual who accesses or uses our Services.</li>
      </ul>

      <h2>2. The Information We Collect and Its Importance</h2>
      <h3>2.1. Information You Voluntarily Provide</h3>
      <ul>
        <li><strong>Account and Profile Data:</strong> Name, email, phone, password, address, etc.</li>
        <li><strong>Financial and Transactional Data:</strong> Payment info, bank details, UPI IDs.</li>
        <li><strong>KYC Details:</strong> Aadhaar, PAN, or other government-issued IDs.</li>
        <li><strong>Communications Data:</strong> Emails, chats, and support tickets.</li>
        <li><strong>User-Generated Content:</strong> Reviews, comments, testimonials.</li>
      </ul>

      <h3>2.2. Information We Collect Automatically</h3>
      <ul>
        <li><strong>Device and Log Data:</strong> IP address, browser, OS, device info.</li>
        <li><strong>Usage Data:</strong> Pages visited, courses enrolled, progress, timestamps.</li>
        <li><strong>Cookies & Tracking:</strong> Cookies, web beacons, IP tracking.</li>
      </ul>

      <h2>3. The Purposes for Processing Your Information</h2>
      <ul>
        <li>Service provision and account management</li>
        <li>Financial and transactional processing</li>
        <li>Affiliate and network marketing program management</li>
        <li>Communication, marketing, and engagement</li>
        <li>Analytics, research, and platform improvement</li>
        <li>Security and fraud prevention</li>
        <li>Legal compliance</li>
      </ul>

      <h2>4. Disclosure of Your Information</h2>
      <ul>
        <li>Trusted third-party service providers (payment, hosting, analytics, etc.)</li>
        <li>Affiliates and business partners (for commissions and network tracking)</li>
        <li>Legal and regulatory authorities (when required)</li>
        <li>Business transfers (mergers, acquisitions, etc.)</li>
      </ul>

      <h2>5. Your Choices and Data Rights</h2>
      <h3>5.1. Your Data Rights</h3>
      <ul>
        <li>Right of Access</li>
        <li>Right to Rectification</li>
        <li>Right to Erasure ("Right to be Forgotten")</li>
        <li>Right to Object</li>
        <li>Right to Withdraw Consent</li>
      </ul>

      <h3>5.2. Exercising Your Rights</h3>
      <p>
        To exercise any of these rights, email us at <strong>[Your Contact Email Address]</strong> 
        or use the contact form on our website. We may verify your identity before processing your request.
      </p>

      <h3>5.3. Communication Preferences</h3>
      <p>You may unsubscribe from promotional emails anytime by clicking the "unsubscribe" link.</p>

      <h2>6. Data Security Measures</h2>
      <ul>
        <li>TLS encryption for data transmission</li>
        <li>Access controls with logging and monitoring</li>
        <li>Regular security audits</li>
        <li>Employee training on privacy best practices</li>
      </ul>

      <h2>7. Data Retention Policy</h2>
      <p>We retain your information as long as your account is active and for a reasonable time afterward for legal and operational needs.</p>

      <h2>8. International Data Transfers</h2>
      <p>Your data may be transferred globally, with security safeguards in place.</p>

      <h2>9. Children's Privacy</h2>
      <p>We do not knowingly collect data from children under 13.</p>

      <h2>10. Changes to This Privacy Policy</h2>
      <p>We may update this policy. Continued use of our Services indicates acceptance of any changes.</p>

      <h2>11. Contact Us</h2>
      <p>
        <strong>Skill Learners</strong><br>
        Attention: Privacy Officer<br>
        Email: [Your Contact Email Address]<br>
        Website: [Your Website Contact Page URL]
      </p>

      <div class="footer-note">
        <p><em>Disclaimer: This Privacy Policy template is for informational purposes only and does not constitute legal advice. Consult with a legal professional for compliance in your jurisdiction.</em></p>
      </div>
    </div>
  </div>




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

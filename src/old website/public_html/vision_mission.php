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
    .modal h5 {
    color: #007bff; /* Bootstrap blue */
  }
  
    .modal h3 {
    color: #007bff; /* Bootstrap blue */
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





        <!-- About / Legal Info & Packages -->
        <section id="info" class="py-5">
          <div class="container" data-aos="fade-up" data-aos-duration="2000">
            <div class="main-card shadow-lg">
        
            <div class="row equal-cols g-4" style="margin-bottom:20px">
               <img src="./assets/img/logo.png"
                   style="width: 100px; height: 46px; transform: scale(1.8) translateY(-4px);margin-left:10px"
                   class="me-2" />
            </div>
          
              <div class="row equal-cols g-4">
        
                <!-- About / Legal Info -->
                <div class="col-4" style="margin-top:45px">
                  <h2 class="fw-bold mb-4" style="color:white">Information</h2>
        
                  <div class="info-item">
                    <i class="bi bi-info-circle"></i>
                    <div>
                      <h6><a href="./vision_mission.php" data-bs-toggle="modal"  style="color:white;text-decoration:none;">About</a></h6>
                    </div>
                  </div>
        
                  <div class="info-item">
                    <i class="bi bi-shield-lock"></i>
                    <div>
                      <h6><a href="#" data-bs-toggle="modal" data-bs-target="#privacyModal" style="color:white;text-decoration:none;">Privacy Policy</a></h6>
                    </div>
                  </div>
        
                  <div class="info-item">
                    <i class="bi bi-file-earmark-text"></i>
                    <div>
                      <h6><a href="#" data-bs-toggle="modal" data-bs-target="#termsModal" style="color:white;text-decoration:none;">Terms & Conditions</a></h6>
                    </div>
                  </div>
        
                  <div class="info-item">
                    <i class="bi bi-exclamation-triangle"></i>
                    <div>
                      <h6><a href="#" data-bs-toggle="modal" data-bs-target="#disclaimerModal" style="color:white;text-decoration:none;">Disclaimer</a></h6>
                    </div>
                  </div>
                </div>
        
                <!-- Packages -->
                <div class="col-4" style="margin-top:-28px">
                  <h2 class="fw-bold  mb-4" style="color:white">Our Packages</h2>
        
                  <div class="package-list">
                    <h6>Beginner</h6>
                    <p>Starter features</p>
                    
                    <h6>Basic</h6>
                    <p>Batter features</p>
        
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
            
                
              <!-- contact -->
                <div class="col-4" style="margin-top:-28px">
                  <h2 class="fw-bold  mb-4" style="color:white">Contact Us</h2>
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
                      <div class="col-1 text-center">
                        <button type="submit" name="ques" class="btn btn-primary px-2 py-2  shadow-sm">
                          Send Message
                        </button>
                      </div>
                    </form>
                </div>
              </div>
            </div>
        </div>
        
      </div>
    </div>
  </div>
</section>

<!-- Modals -->

<!-- Privacy Policy Modal -->
<div class="modal fade" id="privacyModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content p-4">
      <h3 class="mb-3">Privacy Policy</h3>
      <p><em>Effective Date: September 2, 2025 | Last Updated: September 2, 2025</em></p>
      <div style="max-height:70vh; overflow-y:auto; padding-right:10px;">

        <h5>1. Preamble: Our Commitment to Your Privacy</h5>
        <p>
          This Privacy Policy is a legally binding document that outlines the data practices of Skill Learners 
          ("we," "us," or "our"). We are deeply committed to protecting the privacy and security of your personal information. 
          By using our Services, you explicitly consent to the data practices described in this policy.
        </p>

        <h5>1.1. Definitions</h5>
        <ul>
          <li><strong>Personal Information:</strong> Any data that can directly or indirectly identify you.</li>
          <li><strong>Processing:</strong> Any action performed on Personal Information, such as collection, storage, or disclosure.</li>
          <li><strong>Services:</strong> Our website, online courses, and affiliate/network marketing programs.</li>
          <li><strong>You / User:</strong> Any individual using our Services.</li>
        </ul>

        <h5>2. The Information We Collect</h5>
        <p>We collect information directly from you, automatically as you use our Services, and from third parties.</p>

        <h6>2.1. Information You Provide</h6>
        <ul>
          <li><strong>Account & Profile Data:</strong> Name, email, mobile, password, optional photo & address.</li>
          <li><strong>Financial Data:</strong> Payment details (via secure gateways), transaction history.</li>
          <li><strong>KYC Data:</strong> Aadhaar, PAN, or government ID (processed securely).</li>
          <li><strong>Communications:</strong> Emails, chats, messages.</li>
          <li><strong>User Content:</strong> Reviews, comments, testimonials.</li>
        </ul>

        <h6>2.2. Information We Collect Automatically</h6>
        <ul>
          <li>Device & log data (IP, browser, OS, referrer URL).</li>
          <li>Usage & activity data (pages visited, courses taken, time spent).</li>
          <li>Cookies & tracking tech (session cookies, persistent cookies, pixel tags, IP tracking).</li>
        </ul>

        <h5>3. Purposes for Processing Your Information</h5>
        <ul>
          <li><strong>Service Provision:</strong> Account access, authentication, personalization.</li>
          <li><strong>Payments:</strong> Process transactions & affiliate payouts.</li>
          <li><strong>Affiliate Program:</strong> Manage sales tracking & commission structures.</li>
          <li><strong>Communication:</strong> Send service alerts, customer support, promotions.</li>
          <li><strong>Analytics:</strong> Optimize user experience and improve content.</li>
          <li><strong>Security:</strong> Fraud prevention, KYC checks, unauthorized access protection.</li>
          <li><strong>Legal Compliance:</strong> Respond to subpoenas, court orders, regulations.</li>
        </ul>

        <h5>4. Disclosure of Your Information</h5>
        <ul>
          <li><strong>Service Providers:</strong> Payment gateways, cloud hosting, analytics, email delivery.</li>
          <li><strong>Affiliates:</strong> Limited sharing to track commissions.</li>
          <li><strong>Legal Authorities:</strong> When required by law or to protect rights/safety.</li>
          <li><strong>Business Transfers:</strong> In case of merger, acquisition, or asset sale.</li>
        </ul>

        <h5>5. Your Choices & Data Rights</h5>
        <ul>
          <li><strong>Access:</strong> Request a copy of your data.</li>
          <li><strong>Rectification:</strong> Correct inaccuracies.</li>
          <li><strong>Erasure:</strong> Request deletion ("Right to be Forgotten").</li>
          <li><strong>Objection:</strong> Restrict processing for certain cases.</li>
          <li><strong>Withdraw Consent:</strong> Stop certain data use.</li>
        </ul>
        <p>Submit requests via email: <strong>[skilllearners@gmail.com]</strong>. Identity verification required.</p>

        <h5>6. Data Security</h5>
        <ul>
          <li>TLS encryption for transmissions.</li>
          <li>Strict access controls & monitoring.</li>
          <li>Independent security audits.</li>
          <li>Employee privacy & security training.</li>
        </ul>
        <p>No method is 100% secure, but we strive for maximum protection.</p>

        <h5>7. Data Retention</h5>
        <p>
          Data is kept while your account is active, and for a reasonable time afterward to comply with legal obligations.
        </p>

        <h5>8. International Transfers</h5>
        <p>
          Your data may be processed outside your country but will always be handled securely under this policy.
        </p>

        <h5>9. Children's Privacy</h5>
        <p>
       Our Services are intended for a general audience and are not directed at children under the age of 13. We do not knowingly collect personal information from individuals under 13. If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately so we can take steps to remove it from our systems.
        </p>

        <h5>10. Changes to This Policy</h5>
        <p>
         We reserve the right to modify this Privacy Policy at any time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. Your continued use of the Services after any changes signifies your acceptance of the revised policy. We encourage you to review this policy periodically.
        </p>

        <h5>11. Contact Us</h5>
        <p>
          Skill Learners <br>
          Attention: Privacy Officer <br>
          Email: [skilllearners@gmail.com] <br>
          Website: https://3tmoneyworld.in
        </p>

        <p class="text-muted small">
          <em>Disclaimer: This detailed privacy policy is provided for informational purposes only. It is a comprehensive template and does not constitute legal advice. You must consult with a qualified legal professional to ensure your privacy policy fully complies with all applicable laws and regulations in your specific jurisdiction.
</em>
        </p>

      </div>
    </div>
  </div>
</div>


<!-- Terms & Conditions Modal -->
<div class="modal fade" id="termsModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content p-4">
      <h3 class="mb-3">Terms and Conditions</h3>
      <p><em>Last updated: September 03, 2025</em></p>
      <div style="max-height:70vh; overflow-y:auto; padding-right:10px;">
        
        <h5>1. AGREEMENT TO OUR LEGAL TERMS</h5>
        <p>
          This document represents a legally binding agreement between you, the user ('you'), and Skill Learners ('we,' 'us,' or 'our'), a company registered in India. This agreement governs your access to and use of our website, skilllearners.com (the 'Site'), and any other related products, services, or mobile applications that link to these Legal Terms (collectively, the 'Services').
        </p>
        <p>
          By accessing, browsing, or otherwise using the Services, you acknowledge that you have read, understood, and agreed to be bound by all of these Legal Terms. If you do not agree with any part of these Legal Terms, you are expressly prohibited from using our Services and must cease all use immediately.
        </p>
        <p>
          We reserve the right, at our sole discretion, to make changes or modifications to these Legal Terms at any time and for any reason. We will alert you of any changes by updating the 'Last updated' date of these Legal Terms. Your continued use of the Services after the posting of the revised Legal Terms constitutes your acceptance of the changes.
        </p>

        <h5>2. OUR SERVICES AND PURPOSE</h5>
        <p>
         Our Services primarily consist of providing access to pre-recorded video classes on a variety of subjects, including but not limited to digital marketing, online earning strategies, trading, and social media management. The purpose of these courses is to empower users with knowledge and skills for both personal and professional development. While our current focus is on pre-recorded content, we may, at our discretion, introduce additional services such as live, interactive classes, or offline workshops in the future.
        </p>

        <h5>3. USER REPRESENTATIONS AND ACCOUNT REGISTRATION</h5>
        <p>
          By using the Services, you represent and warrant that:
        </p>
        <ul>
          <li>You have the legal capacity to enter into this agreement and agree to comply with these Legal Terms..</li>
          <li>You are at least 18 years of age. Our Services are not intended for users under the age of 18.</li>
          <li> The registration information you provide is true, accurate, current, and complete..</li>
          <li>You will not access the Services through automated or non-human means, such as bots, scripts, or spiders.</li>
          <li>You will not use the Services for any illegal or unauthorized purpose.</li>
          <li>The registration information you provide is true, accurate, current, and complete.</li>
          <li>You will not use the Services for any illegal or unauthorized purpose.</li>
        </ul>
        <p>
          You may be required to register and create an account to use our Services. You are responsible for maintaining the confidentiality of your password and for all activities that occur under your account.
        </p>

        <h5>4. AFFILIATE AND MULTI-LEVEL INCOME PROGRAM</h5>
        <p>
          We offer an optional affiliate program that allows users to generate income by promoting and selling our courses.
        </p>
        <ul>
          <li><strong>Commission Structure:</strong> 70% to 80% on each course sale, including multiple levels of downline income.</li>
          <li><strong>Commission Payments:</strong>The method and schedule for commission payments will be communicated to you separately. The company retains the sole right to determine the accuracy of all sales and commissions and its decision on this matter is final.</li>
          <li><strong>Prohibited Activities:</strong> We have a zero-tolerance policy for fraudulent or unethical activities. Engaging in activities such as creating fake user accounts, sending unsolicited bulk emails (spam), misrepresenting the Services, or any other form of deceitful practice will result in immediate termination of your affiliate status, permanent suspension of your account, and forfeiture of any outstanding or future commissions.</li>
        </ul>

        <h5>5. INTELLECTUAL PROPERTY RIGHTS</h5>
        <p>
          All intellectual property rights in the Services are our exclusive property or licensed to us. You are prohibited from copying, republishing, or distributing any part of the Services without prior written permission.
        </p>

         <ul>
          <li><strong>Restrictions:</strong> You are strictly prohibited from copying, reproducing, aggregating, republishing, uploading, posting, publicly displaying, encoding, translating, transmitting, distributing, selling, licensing, or otherwise exploiting for any commercial purpose whatsoever, any part of the Services or the Content without our express prior written permission.</li>
          <li><strong> User Contributions:</strong>By posting any content, comments, or materials ("Contributions") on our Services, you grant us a worldwide, unrestricted, unlimited, irrevocable, perpetual, non-exclusive, transferable, royalty-free, fully-paid license to use, copy, reproduce, distribute, sell, resell, publish, broadcast, reformat, translate, and exploit your Contributions (including your image, name, and voice) for any commercial, advertising, or other purpose.</li>
          
        </ul>


        <h5>6. PURCHASES AND PAYMENT</h5>
        <p>
          All course fees are in INR. By purchasing, you agree to provide accurate payment details and authorize us to charge your chosen provider.
        </p>

        <h5>7. REFUNDS POLICY</h5>
        <p>
         All course sales are final. Due to the digital nature of our products and the immediate access granted to the content, we have a strict no-refund policy. We do not offer refunds or exchanges for any course purchased through our Services.
        </p>

        <h5>8. PROHIBITED ACTIVITIES</h5>
        <p>
          You agree not to misuse the Services, including attempts to defraud, hack, harass, or violate any laws.
        </p>
        
        <ul>
          <li><strong>Systematically retrieve data or other content from the Services to create or compile, directly or indirectly, a collection, compilation, database, or directory without our written permission</strong> </li>
          <li><strong>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</strong></li>
          <li><strong> Circumvent, disable, or otherwise interfere with security-related features of the Services.</strong></li>
          <li><strong>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Services.</strong></li>
          <li><strong> Use any information obtained from the Services in order to harass, abuse, or harm another person.</strong></li>
          <li><strong>Make improper use of our support services or submit false reports of abuse or misconduct.</strong></li>
          
        </ul>
        

        <h5>9. USER DATA AND PRIVACY</h5>
        <p>
          our privacy is important to us. We will collect, store, and use certain data that you provide to us to manage your account and provide our Services. Our data collection and privacy practices are fully detailed in our separate Privacy Policy. By using the Services, you consent to our data practices.
        </p>

        <h5>10. DISCLAIMER</h5>
        <p>
          The Services are provided on an "as is" and "as available" basis. We make no representations or warranties of any kind, express or implied, as to the operation of the Services or the information, content, materials, or products included on the Services. The information provided in our courses is for educational and informational purposes only and is not a guarantee of future earnings or success. Your personal effort, market conditions, and other factors will determine your success. You are solely responsible for your actions and the outcomes you achieve.
        </p>

        <h5>11. LIMITATIONS OF LIABILITY</h5>
        <p>
         To the fullest extent permitted by law, we will not be liable for any direct, indirect, incidental, punitive, special, or consequential damages, including loss of profits, revenue, data, or goodwill, arising from your use of the Services or any content provided within them.
        </p>

        <h5>12. INDEMNIFICATION</h5>
        <p>
       You agree to defend, indemnify, and hold us harmless from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees, arising from your breach of these Legal Terms or your use of the Services.
        </p>

        <h5>13. GOVERNING LAW AND DISPUTE RESOLUTION</h5>
        <p>
          These Legal Terms shall be governed by and construed in accordance with the laws of India. Any legal action or proceeding related to your access to or use of the Services shall be instituted in the courts located in India, and you consent to the exclusive jurisdiction of such courts.
        </p>

        <h5>14. CONTACT US</h5>
        <p>If you have any questions or concerns regarding these Legal Terms, please contact us at:
        <p>Email: skilllearners@gmail.com | Phone: 9585368504</p>

        <h5>15. THIRD-PARTY WEBSITES AND CONTENT</h5>
        <p>
          The Services may contain links to other websites ('Third-Party Websites') as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, and other content or items belonging to or originating from third parties ('Third-Party Content'). We are not responsible for and do not have control over the accuracy, appropriateness, or completeness of any Third-Party Websites or Third-Party Content. The inclusion of any link does not imply endorsement by us of the site. Your use of these third-party links is at your own risk.
        </p>

        <h5>16. ADVERTISERS</h5>
        <p>
          We may allow advertisers to display their advertisements and other information in certain areas of the Services, such as on the website or in the mobile application. These advertisers may be paid to feature these ads. As an advertiser, you take full responsibility for any ads you place on the Services. As a user, any dealings with advertisers found on our Services are solely between you and the advertiser. We shall not be responsible for any loss or damage of any kind incurred as a result of any such dealings.
        </p>

        <h5>17. SERVICE MANAGEMENT</h5>
        <p>
          We reserve the right to monitor, restrict, or suspend access to Services to protect our platform.
        </p>
        
          <ul>
          <li>Monitor the Services for violations of these Legal Terms.</li>
          <li><strong>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</strong></li>
          <li>Take appropriate legal action against anyone who, in our sole discretion, violates the law or these Legal Terms, including without limitation, reporting such user to law enforcement authorities.</li>
          <li> Refuse, restrict access to, limit the availability of, or disable (to the extent technologically feasible) any of your Contributions or any portion thereof.</li>
          <li>Otherwise manage the Services in a manner designed to protect our rights and property and to facilitate the proper functioning of the Services.</li>
        </ul>
        
        
        

        <h5>18. COPYRIGHT INFRINGEMENTS</h5>
        <p>
          We respect the intellectual property rights of others. If you believe that any material available on or through the Services infringes upon any copyright you own or control, please notify us immediately. Upon receiving a proper notification, we will remove the infringing content in accordance with applicable law.
        </p>

        <h5>19. TERM AND TERMINATION</h5>
        <p>
         These Legal Terms shall remain in full force and effect while you use the Services. Without limiting any other provision of these Legal Terms, we reserve the right to, in our sole discretion and without notice or liability, deny access to and use of the Services (including blocking certain IP addresses), to any person for any reason or for no reason, including without limitation for breach of any representation, warranty, or covenant contained in these Legal Terms or of any applicable law or regulation. We may terminate your use or participation in the Services or delete your account at any time, without warning.
        </p>

        <h5>20. MODIFICATIONS AND INTERRUPTIONS</h5>
        <p>
         We reserve the right to change, modify, or remove the contents of the Services at any time or for any reason at our sole discretion without notice. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the Services. We cannot guarantee the Services will be available at all times. We may experience hardware, software, or other issues or need to perform maintenance related to the Services, resulting in interruptions, delays, or errors.
        </p>

        <h5>21. CORRECTIONS</h5>
        <p>
         There may be information on the Services that contains typographical errors, inaccuracies, or omissions, including descriptions, pricing, availability, and various other information. We reserve the right to correct any errors, inaccuracies, or omissions and to change or update the information on the Services at any time, without prior notice.
        </p>

        <h5>22. INDEMNIFICATION (Duplicate Clause)</h5>
        <p>
        You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys' fees and expenses, made by any third party due to or arising out of your breach of these Legal Terms or your use of the Services.
        </p>

        <h5>23. USER DATA</h5>
        <p>
          We will maintain certain data that you transmit to the Services for the purpose of managing the performance of the Services, as well as data relating to your use of the Services. Although we perform regular routine backups of data, you are solely responsible for all data that you transmit or that relates to any activity you have undertaken using the Services. You agree that we shall have no liability to you for any loss or corruption of any such data, and you hereby waive any right of action against us arising from any such loss or corruption.
        </p>

        <h5>24. ELECTRONIC COMMUNICATIONS, TRANSACTIONS, AND SIGNATURES</h5>
        <p>
          Visiting the Services, sending us emails, and completing online forms constitute electronic communications. You consent to receive electronic communications, and you agree that all agreements, notices, disclosures, and other communications we provide to you electronically, via email and on the Services, satisfy any legal requirement that such communication be in writing. You hereby agree to the use of electronic signatures, contracts, orders, and other records.
        </p>

        <h5>25. MISCELLANEOUS</h5>
        <p>
          These Legal Terms and any policies or operating rules posted by us on the Services constitute the entire agreement and understanding between you and us. Our failure to exercise or enforce any right or provision of these Legal Terms shall not operate as a waiver of such right or provision. These Legal Terms operate to the fullest extent permissible by law. We shall not be responsible or liable for any loss, damage, delay, or failure to act caused by any cause beyond our reasonable control.
        </p>

        <h5>26. CONTACT US</h5>
        <p>Email: skilllearners@gmail.com | Phone: 9585368504</p>
      </div>
    </div>
  </div>
</div>

<!-- Disclaimer Modal -->
<div class="modal fade" id="disclaimerModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
    <div class="modal-content p-4">
      <h3 class="mb-3">Disclaimer for Skill Learners</h3>
      <div style="max-height:70vh; overflow-y:auto; padding-right:10px;">
        <h5>1. General Information and Educational Purpose</h5>
        <p>
          This disclaimer sets forth the terms and conditions for your use of the Skill Learners website, its content, products, and services. All information provided on this platform is strictly for general informational and educational purposes only. Our mission is to provide high-quality educational content and resources to help individuals develop and enhance their personal and professional skills. The content is presented as a compilation of general knowledge, personal experiences, and research from various sources.
        </p>
        <p>
          We provide all content on an "as is" and "as available" basis. This means we make no guarantees or warranties, express or implied, regarding the completeness, accuracy, reliability, suitability, timeliness, or availability of any information, products, services, or related graphics found on our website. You acknowledge that any reliance you place on such information is entirely at your own risk. Skill Learners, its affiliates, partners, employees, and agents shall not be held liable for any loss or damage, including but not limited to direct, indirect, incidental, punitive, or consequential damages, or any loss or damage whatsoever arising from the loss of data or profits in connection with the use of this website.
        </p>

        <h5>2. Results and Success Disclaimer</h5>
        <p>
          We want to be unequivocally clear about your potential for success. The knowledge and skills taught in our courses are designed to provide you with valuable tools, but we do not promise or guarantee immediate, rapid, or specific results. Your personal and professional success is a direct outcome of your own individual effort, dedication, consistency, and ability to apply what you have learned.
        </p>
        <p>
          Each individual's journey is unique. Your ability to achieve your desired outcomes depends on numerous personal factors, including your innate talent, work ethic, willingness to learn, and the specific market conditions in your industry. We cannot control these variables, and therefore, we cannot guarantee your success. Your success will be a direct reflection of your actions, not our promises.
        </p>

        <h5>3. Income Opportunity Disclaimer</h5>
        <p>
          By purchasing our courses, you are primarily investing in skill and knowledge enhancement. The income opportunity we offer is an additional benefit, not the core purpose of your purchase. The ability to generate any income from this opportunity is solely and entirely dependent on your personal effort, how effectively you utilize the skills you acquire, and the ever-changing market conditions.
        </p>
        <p>
          Skill Learners makes no express or implied guarantees, representations, or promises regarding any specific level of income you may earn. We are not responsible for your financial outcomes, whether positive or negative. The responsibility for your financial success rests solely with you. If you are unable to generate income because you did not effectively apply the skills or use the resources, Skill Learners will not be held liable or responsible for your failure to earn.
        </p>

        <h5>4. Trading Course Disclaimer</h5>
        <p>
          The trading courses we offer are based on our personal experience and insights gathered from interviews and research of expert traders. We provide an educational overview of trading strategies and market analysis techniques used by successful individuals in the field.
        </p>
        <p>
          <strong>This is not financial advice.</strong> Skill Learners is not a licensed financial advisor, and our content is not intended to be a substitute for professional financial guidance. The information provided in our trading courses does not constitute a recommendation to buy, sell, or hold any specific securities, commodities, or other financial instruments. Trading and investing involve significant risk, and you can lose all or more than your initial investment. The strategies and information presented may not be suitable for all individuals or financial situations.
        </p>
        <p>
          Any and all profits or losses that result from your application of the knowledge and strategies from our trading courses are solely your responsibility. Skill Learners is in no way liable for your trading results, whether they are profitable or result in a loss. We strongly advise that you carefully consider your financial situation and risk tolerance before engaging in any trading activity.
        </p>

        <h5>5. Professional Advice and External Links</h5>
        <p>
          The information provided on this platform is not intended to be, nor should it be considered, a substitute for professional advice. You should not act or refrain from acting based on any information presented on this website without first seeking professional advice from a qualified expert in the relevant field, such as a certified financial advisor, accountant, or legal counsel.
        </p>
        <p>
          Our website may contain links to external websites that are not managed or maintained by Skill Learners. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not imply a recommendation or endorsement of the views expressed within them. We cannot guarantee the accuracy, relevance, or completeness of any information on these external sites.
        </p>

        <h5>6. Your Consent and Acknowledgment</h5>
        <p>
          By using our website, purchasing our products, or accessing our services, you explicitly agree to this disclaimer and all its terms and conditions. You acknowledge that the liability set out in this disclaimer is reasonable and that you have read and understood its contents. We reserve the right to make changes, modifications, or updates to this disclaimer at any time without prior notice. Your continued use of our website following any such changes constitutes your acceptance of the new terms.
        </p>
      </div>
    </div>
  </div>
</div>


  </section>

  
<!-- Footer -->
<footer class="footer" style="margin-top:-30px">
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

<style>
#sidebar {
  background-color: #ccd3e6ff !important; 
  border-radius: 0 0 15px 15px;
  padding: 10px;
  max-height: 100vh; /* Make sidebar full height of viewport */
  overflow-y: auto;   /* Add vertical scroll if needed */
  overflow-x: hidden; /* Prevent horizontal scroll */
}

/* Style scrollbar (optional for better appearance) */
#sidebar::-webkit-scrollbar {
  width: 6px;
}

#sidebar::-webkit-scrollbar-thumb {
  background-color: #1e3a8a;
  border-radius: 10px;
}

#sidebar * {
  color: black !important;
}

/* Main nav item style */
#sidebar .nav-link {
  border-radius: 10px;
  padding: 8px 12px;
  margin-bottom: 5px;
}

/* Hover for main nav items */
#sidebar .nav-link:hover {
  background-color: #1e3a8a !important;
  color: white !important;
}

#sidebar .nav-link:hover i,
#sidebar .nav-link:hover span {
  color: white !important;
}

/* Child nav item style */
#sidebar .nav-content a {
  border-radius: 10px;
  padding: 6px 12px;
  margin-bottom: 4px;
}

/* Hover for child nav items */
#sidebar .nav-content a:hover {
  background-color: #6082afff !important;
  color: #1e3a8a !important;
}

#sidebar .nav-content a:hover i,
#sidebar .nav-content a:hover span {
  color: #1e3a8a !important;
}

</style>



<!-- ======= Sidebar ======= -->
<aside id="sidebar" class="sidebar">

    <ul class="sidebar-nav" id="sidebar-nav">
        
        <li class="nav-item">
            <a class="nav-link collapsed" href="./user_home.php">
                <i class="bi bi-grid"></i>
                <span>Home</span>
            </a>
        </li><!-- End Home Nav -->
        

        <li class="nav-item">
            <a class="nav-link collapsed" href="dashboard.php">
                <i class="bi bi-grid"></i>
                <span>Dashboard</span>
            </a>
        </li><!-- End Dashboard Nav -->

        <li class="nav-item">
            <a class="nav-link collapsed" data-bs-target="#agent-nav" data-bs-toggle="collapse" href="#">
                <i class="bi bi-people"></i><span>Agent</span><i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="agent-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
                <li>
                    <a href="direct_agent_list.php">
                        <i class="bi bi-circle"></i><span>Direct Agent List</span>
                    </a>
                </li>
                <li>
                    <a href="active_agent.php">
                        <i class="bi bi-circle"></i><span>Active Agent</span>
                    </a>
                </li>
                <li>
                    <a href="inactive_agent.php">
                        <i class="bi bi-circle"></i><span>Inactive Agent</span>
                    </a>
                </li>
            </ul>
        </li>

        <li class="nav-item">
            <a class="nav-link collapsed" data-bs-target="#tables-nav" data-bs-toggle="collapse" href="#">
                <i class="bi bi-layout-text-window-reverse"></i><span>Income</span><i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="tables-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
                <li>
                    <a href="level_income.php">
                        <i class="bi bi-circle"></i><span>Level Income</span>
                    </a>
                </li>
                <li>
                    <a href="autopool_income.php">
                        <i class="bi bi-circle"></i><span>Global Income</span>
                    </a>
                </li>
                <li>
                    <a href="referral_income.php">
                        <i class="bi bi-circle"></i><span>Referral Income</span>
                    </a>
                </li>
                <li>
                    <a href="spill_history.php">
                        <i class="bi bi-circle"></i><span>Spillover Income</span>
                    </a>
                </li>
                <li>
                    <a href="other_income.php">
                        <i class="bi bi-circle"></i><span>Other Income</span>
                    </a>
                </li>
            </ul>
        </li><!-- End income Nav -->

        <li class="nav-item">
            <a class="nav-link collapsed" data-bs-target="#wallet-nav" data-bs-toggle="collapse" href="#">
                <i class="bi bi-wallet2"></i><span>Wallet</span><i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="wallet-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
                <li>
                    <a href="add_money.php">
                        <i class="bi bi-circle"></i><span>Add Money</span>
                    </a>
                </li>
                <li>
                    <a href="withdrawal.php">
                        <i class="bi bi-circle"></i><span>withdraw Money</span>
                    </a>
                </li>
                <li>
                    <a href="wallet_history.php">
                        <i class="bi bi-circle"></i><span>Wallet History</span>
                    </a>
                </li>
                <li>
                    <a href="withdrawal_history.php">
                        <i class="bi bi-circle"></i><span>Withdrawal History</span>
                    </a>
                </li>
            </ul>
        </li>

        <li class="nav-item">
            <a class="nav-link collapsed" href="leaderboard.php">
            <i class="bi bi-bar-chart"></i>
                <span>Leader Board</span>
            </a>
        </li>
        
        
           <li class="nav-item">
            <a class="nav-link collapsed" data-bs-target="#courses-nav" data-bs-toggle="collapse" href="#">
                <i class="bi bi-journal-bookmark"></i><span>Courses</span><i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="courses-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
                <li>
                    <a href="online_course.php">
                        <i class="bi bi-circle"></i><span>Available Courses</span>
                    </a>
                </li>
                <li>
                    <a href="owned_courses.php">
                        <i class="bi bi-circle"></i><span>My Courses</span>
                    </a>
                </li>
            </ul>
        </li>

        <li class="nav-item">
            <a class="nav-link collapsed" href="task.php">
            <i class="bi bi-person-video2"></i>
                <span>Task</span>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link collapsed" href="more_income_form.php">
            <i class="bi bi-cash"></i>
                <span>More Income</span>
            </a>
        </li>
        
        <li class="nav-item">
            <a class="nav-link collapsed" href="spillover.php">
            <i class="bi bi-arrow-repeat"></i>
                <span>Spill Over</span>
            </a>
        </li>
        
        <li class="nav-item">
            <a class="nav-link collapsed" href="global_tree.php">
            <i class="bi bi-tree"></i>
                <span>Global Tree</span>
            </a>
        </li>
        
        <li class="nav-item">
            <a class="nav-link collapsed" href="add_money_history.php">
            <i class="bi bi-activity"></i>
                <span>Track</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link collapsed" href="referral.php">
            <i class="bi bi-person-plus"></i>
                <span>Affiliate and Earn</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link collapsed" href="package.php">
                <i class="bi bi-box-seam"></i>
                <span>Active & Upgrade Package</span>
            </a>
        </li>
        <li class="nav-item">
            <a class="nav-link collapsed" href="profile.php">
                <i class="bi bi-person"></i>
                <span>Profile</span>
            </a>
        </li>
    </ul>


<script>
// Disable F12, Ctrl+Shift+I, Ctrl+U (View Source), Ctrl+Shift+J
document.addEventListener("keydown", function (event) {
    if (
        event.keyCode === 123 || // F12
        (event.ctrlKey && event.shiftKey && event.keyCode === 73) || // Ctrl+Shift+I
        (event.ctrlKey && event.shiftKey && event.keyCode === 74) || // Ctrl+Shift+J
        (event.ctrlKey && event.keyCode === 85) // Ctrl+U
    ) {
        event.preventDefault();
        alert("Function disabled!");
        return false;
    }
});

// Disable right-click
document.addEventListener("contextmenu", function (event) {
    event.preventDefault();
   
});
</script>

</aside><!-- End Sidebar-->
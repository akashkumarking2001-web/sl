<!-- ======= Sidebar ======= -->
<aside id="sidebar" class="sidebar">

    <ul class="sidebar-nav" id="sidebar-nav">

        <li class="nav-item">
            <a class="nav-link collapsed" href="index.php">
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
                        <i class="bi bi-circle"></i><span>Totel Agent List</span>
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
                <li>
                    <a href="money_increase.php">
                        <i class="bi bi-circle"></i><span>Increase & decrease</span>
                    </a>
                </li>
                <li>
                    <a href="tree.php">
                        <i class="bi bi-circle"></i><span>Referal team List</span>
                    </a>
                </li>
            </ul>
        </li>

        <li class="nav-item">
            <a class="nav-link collapsed" data-bs-target="#autopool-nav" data-bs-toggle="collapse" href="#">
                <i class="bi bi-tree"></i><span>Autopool Tree</span><i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="autopool-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
                <li>
                    <a href="b_silver_autopool.php">
                        <i class="bi bi-circle"></i><span>basic silver</span>
                    </a>
                </li>
                <li>
                    <a href="b_gold_autopool.php">
                        <i class="bi bi-circle"></i><span>basic gold</span>
                    </a>
                </li>
                <li>
                    <a href="b_diamond_autopool.php">
                        <i class="bi bi-circle"></i><span>basic diamond</span>
                    </a>
                </li>
                <li>
                    <a href="b_platinum_autopool.php">
                        <i class="bi bi-circle"></i><span>basic platinum</span>
                    </a>
                </li>
                <li>
                    <a href="b_rocking_autopool.php">
                        <i class="bi bi-circle"></i><span>basic rocking</span>
                    </a>
                </li>
                
            </ul>
        </li>
        
        <li class="nav-item">
            <a class="nav-link collapsed" data-bs-target="#ecom-nav" data-bs-toggle="collapse" href="#">
                <i class="bi bi-bag-heart"></i><span>Ecommerce</span><i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="ecom-nav" class="nav-content collapse " data-bs-parent="#sidebar-nav">
                <li>
                    <a href="add_product.php">
                        <i class="bi bi-circle"></i><span>Add Product</span>
                    </a>
                </li>
            </ul>
        </li>

        <li class="nav-item">
            <a class="nav-link collapsed" href="courses.php">
            <i class="bi bi-book"></i>
                <span>Courses Management</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link collapsed" data-bs-target="#task-nav" data-bs-toggle="collapse" href="#">
                <i class="bi-journal-check"></i><span>Task Management</span><i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul id="task-nav" class="nav-content collapse" data-bs-parent="#sidebar-nav">
                <li>
                    <a href="task_management.php">
                        <i class="bi bi-circle"></i><span>Add Task</span>
                    </a>
                </li>
                 <li>
                    <a href="task_completion.php">
                        <i class="bi bi-circle"></i><span>View Completion</span>
                    </a>
                </li>
            </ul>
        </li>
        
         
        <li class="nav-item">
            <a class="nav-link collapsed" href="ads_management.php">
           <i class="bi bi-camera-video"></i>
                <span>Ads Management</span>
            </a>
        </li>
        
        <li class="nav-item">
            <a class="nav-link collapsed" href="other_income_add.php">
            <i class="bi bi-currency-exchange"></i>
                <span>Other Income ADD</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link collapsed" href="added_history.php">
                <i class="bi bi-currency-rupee"></i>
                <span>Added History</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link collapsed" href="bank.php">
                <i class="bi bi-bank"></i>
                <span>Bank Details</span>
            </a>
        </li>
        
        <li class="nav-item">
            <a class="nav-link collapsed" href="message.php">
                <i class="bi bi-chat-left-dots"></i>
                <span>Messages</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link collapsed" href="profile.php">
                <i class="bi bi-person"></i>
                <span>Profile</span>
            </a>
        </li>

        <li class="nav-item">
            <a class="nav-link collapsed" href="block.php">
                <i class="bi bi-patch-exclamation"></i>
                <span>Block Agent</span>
            </a>
        </li>
        
        <li class="nav-item">
            <a class="nav-link collapsed" href="del.php">
                <i class="bi bi-person-dash"></i>
                <span>Delete Agent</span>
            </a>
        </li>
        
    </ul>

</aside><!-- End Sidebar-->
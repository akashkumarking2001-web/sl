<?php
require("./resources/connection_build.php");
require("./resources/function.php");
// require("./resources/check_login.php");


if (isset($_REQUEST['register_btn'])) {
    $sps_id = mysqli_real_escape_string($conn, $_REQUEST['sps_id']);
    $username = mysqli_real_escape_string($conn, $_REQUEST['username']);
    $email = mysqli_real_escape_string($conn, $_REQUEST['user_email']);
    $user_mob = mysqli_real_escape_string($conn, $_REQUEST['user_mob']);
    $user_password = mysqli_real_escape_string($conn, $_REQUEST['user_password']);
    $v_code = bin2hex(random_bytes(16));
    if ($sps_id == '') {
        $sps_id = 214748;
    }
    $_SESSION['error'] = 'SPS';
    if (check_sponsor_id($sps_id)) {
        $_SESSION['error'] = 'Mobile';
        if (check_mobile($user_mob)) {
            $_SESSION['error'] = 'Email';
            if (check_email($email)) {
                $_SESSION['error'] = 'N';
                $password = $user_password;
                $agent_id = rand("100000", "999999");
                $reg_date = date("Y-m-d h:i:sa");
                $a = mysqli_query($conn, "INSERT INTO `email_verify`(`email`, `verification_code`, `is_verified`, `agent_id`) VALUES ('$email','$v_code','0','$agent_id')");
                $d = mysqli_query($conn, "INSERT INTO `agent`(`sponsor_id`, `agent_id`, `agent_name`, `password`, `agent_mobile`,`reg_date`) VALUES ('$sps_id','$agent_id','$username','$password','$user_mob','$reg_date')");
                $t = mysqli_query($conn, "INSERT INTO `agent_income`(`agent_id`) VALUES ('$agent_id')");
                mysqli_query($conn, "INSERT INTO `bank_account`(`agent_id`) VALUES('$agent_id')");
                if ($d && sendMail($agent_id, $user_password, $email, $v_code)) {
                    $_SESSION['reg'] = true;
                    $_SESSION['agent_id'] = $agent_id;
                    $_SESSION['Name'] = $username;
                    $_SESSION['email'] = $email;
                    echo '<script>window.location.replace("register.php");</script>';
                }
            }
        }
    }
    header("Location:register.php");
}

if (isset($_REQUEST['resend'])) {
    $email = mysqli_real_escape_string($conn, $_REQUEST['email']);
    if (!check_email($email)) {
        $get_agent = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `email_verify` WHERE `email`='$email'"));
        $agent_id = $get_agent['agent_id'];
        $v_code = $get_agent['verification_code'];
        $agent = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id` = '$agent_id'"));
        $user_password = $agent['password'];
        if (sendMail($agent_id, $user_password, $email, $v_code)) {
            $_SESSION['error'] = "mail_send";
            echo '<script>window.location.replace("forgot.php");</script>';
        }
    } else {
        $_SESSION['error'] = "invaild";
        echo '<script>window.location.replace("forgot.php");</script>';
    }
}

if (isset($_REQUEST['1login_btn'])) {
    $agent_id = mysqli_real_escape_string($conn, $_REQUEST['agent_id']);
    $agent_password = mysqli_real_escape_string($conn, $_REQUEST['agent_password']);
    $data = mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id` = '$agent_id'");
    $email = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `email_verify` WHERE `agent_id`='$agent_id'"));
    if (mysqli_num_rows($data) > 0) {
        $data = mysqli_fetch_array($data);
        $hash_pass = $data['password'];
        if ($agent_id == '214748') {
            if (password_verify($agent_password, $hash_pass)) {
                $_SESSION['sess_id'] = session_id();
                $_SESSION['my_id'] = $agent_id;
                header("Location:./admin/index.php");
            }
        } elseif ($email['is_verified'] == '0') {
            $_SESSION['error'] = 'email';
            header("Location:login.php");
        } elseif ($data['block'] == '1') {
            $_SESSION['error'] = 'block';
            header("Location:login.php");
        } elseif (password_verify($agent_password, $hash_pass)) {
            $_SESSION['sess_id'] = session_id();
            $_SESSION['my_id'] = $agent_id;
            header("Location:user_home.php");
        } else {
            $_SESSION['error'] = "not_valid";
            header("Location:login.php");
        }
    } else {
        $_SESSION['error'] = "not_found";
        header("Location:login.php");
    }
    // header("Location:index.php");
}

if (isset($_REQUEST['login_btn'])) {
    $agent_id = mysqli_real_escape_string($conn, $_REQUEST['agent_id']);
    $agent_password = mysqli_real_escape_string($conn, $_REQUEST['agent_password']);
    $data = mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id` = '$agent_id'");
    $email = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `email_verify` WHERE `agent_id`='$agent_id'"));
    if (mysqli_num_rows($data) > 0) {
        $data = mysqli_fetch_array($data);
        $hash_pass = $data['password'];
        if ($agent_id == '214748') {
            if ($agent_password == $hash_pass) {
                $_SESSION['sess_id'] = session_id();
                $_SESSION['my_id'] = $agent_id;
                $_SESSION['pass'] = $agent_password;
                header("Location:./admin/index.php");
            } else {
                $_SESSION['error'] = "not_valid";
                header("Location:login.php");
            }
        } elseif ($email['is_verified'] == '0') {
            $_SESSION['error'] = 'email';
            header("Location:login.php");
        } elseif ($agent_password == $hash_pass) {
            $_SESSION['sess_id'] = session_id();
            $_SESSION['my_id'] = $agent_id;
            $_SESSION['pass'] = $agent_password;
            check_upgrade($agent_id);
            header("Location:user_home.php");
        } else {
            $_SESSION['error'] = "not_valid";
            header("Location:login.php");
        }
    } else {
        $_SESSION['error'] = "not_found";
        header("Location:login.php");
    }
    // header("Location:index.php");
}

if (isset($_REQUEST['forgot_btn'])) {
    $mail = mysqli_real_escape_string($conn, $_REQUEST['email']);
    if (!check_email($mail)) {
        $get_agent = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `email_verify` WHERE `email`='$mail'"));
        $agent_id = $get_agent['agent_id'];
        $agent = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id` = '$agent_id'"));
        $pass = $agent['password'];
        if (forgot_mail($mail, $agent_id, $pass)) {
            $_SESSION['error'] = "mail_send";
            echo '<script>window.location.replace("forgot.php");</script>';
        }
    } else {
        $_SESSION['error'] = "invaild";
        echo '<script>window.location.replace("forgot.php");</script>';
    }
}

if (isset($_REQUEST['activate_btn'])) {
    $user = mysqli_real_escape_string($conn, $_REQUEST['user_id']);
    $pin = mysqli_real_escape_string($conn, $_REQUEST['pin']);
    $package = mysqli_real_escape_string($conn, $_REQUEST['package']);
    if (check_valid_user_id($user)) {
        if (check_pin_valid_or_not($pin)) {
            if (check_user_active_or_not($user)) {
                mysqli_query($conn, "INSERT INTO `bank_account`(`agent_id`) VALUES('$user')");
            }
            $timestamp = date("Y-m-d h:i:sa");
            mysqli_query($conn, "UPDATE `agent` SET `status`='1',`activatation_date`='$timestamp',`package`='$package' WHERE `agent_id` = '$user'");
            mysqli_query($conn, "DELETE FROM `payment_proof` WHERE `agent_id`='$user'");
            level_income_distribute($user);
            // mysqli_query($conn,"UPDATE `pins` SET `pin_status`='1',`used_date`='$timestamp',`activate_user`='$user' WHERE `pin_value`='$pin'");
            insert_in_matrix_autopool($user);
            $_SESSION['status'] = 4;
        } else {
            $_SESSION['status'] = 3;
        }
    } else {
        $_SESSION['status'] = 1;
    }
    header("Location:./admin/activation.php");
}

if (isset($_REQUEST['ebook_upload'])) {
    $package = mysqli_real_escape_string($conn, $_REQUEST['package']);
    $bname = mysqli_real_escape_string($conn, $_REQUEST['book_name']);
    $payment_proof = $_FILES['img']['name'];
    $payment_proof_temp = $_FILES['img']['tmp_name'];
    $payment_proof_dir = "assets/ebook/" . $payment_proof;
    $thumbnail = $_FILES['thumbnail']['name'];
    $thumbnail_temp = $_FILES['thumbnail']['tmp_name'];
    $thumbnail_dir = "assets/ebook/" . $thumbnail;
    $query = mysqli_query($conn, "INSERT INTO `ebook`(`file`, `package`, `thumbnail`, `book_name`) VALUES ('$payment_proof','$package','$thumbnail','$bname')");
    move_uploaded_file($thumbnail_temp, $thumbnail_dir);
    if (move_uploaded_file($payment_proof_temp, $payment_proof_dir)) {
        echo '<script>alert("Uploaded")</script>';
        echo '<script>window.location.replace("admin/ebook.php");</script>';
    }
}

if (isset($_REQUEST['agent_add_money_btn'])) {
    $agent = mysqli_real_escape_string($conn, $_REQUEST['agent_id']);
    $amount = mysqli_real_escape_string($conn, $_REQUEST['amount']);
    $time = date("Y-m-d h:i:sa");
    mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`+'$amount' WHERE `agent_id`='$agent'");
    mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$agent','$amount','Wallet Recharge','$time','0')");
    mysqli_query($conn, "UPDATE `payment_proof` SET `added_date`='$time',`status`='1' WHERE `agent_id`='$agent' && `amount`='$amount'");
    $_SESSION['status'] = 4;
    header("Location:admin/add_money.php");
}

if (isset($_REQUEST['usdt_add_money'])) {
    $agent = mysqli_real_escape_string($conn, $_REQUEST['agent_id']);
    $amount = mysqli_real_escape_string($conn, $_REQUEST['amount']);
    $amt = $amount * 75;
    $time = date("Y-m-d h:i:sa");
    mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`+'$amt' WHERE `agent_id`='$agent'");
    mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$agent','$amt','Wallet Recharge','$time','0')");
    mysqli_query($conn, "UPDATE `payment_proof` SET `added_date`='$time',`status`='1' WHERE `agent_id`='$agent' && `amount`='$amount'");
    $_SESSION['status'] = 4;
    header("Location:admin/add_money.php");
}

if (isset($_REQUEST['reject_add_money'])) {
    $agent = mysqli_real_escape_string($conn, $_REQUEST['agent_id']);
    $amount = mysqli_real_escape_string($conn, $_REQUEST['amount']);
    $reason = mysqli_real_escape_string($conn, $_REQUEST['reason']);
    mysqli_query($conn, "UPDATE `payment_proof` SET `added_date`='Rejected($reason)',`status`='1' WHERE `agent_id`='$agent' && `amount`='$amount'");
    $_SESSION['status'] = 5;
    header("Location:admin/add_money.php");
}


if (isset($_REQUEST['profile_update_basic'])) {
    $agent_id = mysqli_real_escape_string($conn, $_REQUEST['agent_id']);
    $address = mysqli_real_escape_string($conn, $_REQUEST['address']);
    $data = mysqli_query($conn, "UPDATE `agent` SET `address`='$address' WHERE `agent_id`='$agent_id'");
    $_SESSION['status'] = 4;
    if ($agent_id == '214748') {
        header("Location:admin/profile.php");
    } else {
        header("Location:profile.php");
    }
}

if (isset($_REQUEST['profile_update_password'])) {
    $agent_id = mysqli_real_escape_string($conn, $_REQUEST['agent_id']);
    $password = mysqli_real_escape_string($conn, $_REQUEST['newpassword']);
    $passwordre = mysqli_real_escape_string($conn, $_REQUEST['renewpassword']);
    if ($password == $passwordre) {
        $data = mysqli_query($conn, "UPDATE `agent` SET `password`='$password' WHERE `agent_id`='$agent_id'");
        $_SESSION['status'] = 4;
        if ($agent_id == '214748') {
            header("Location:admin/profile.php");
        } else {
            header("Location:profile.php");
        }
    }
    else {
        $_SESSION['status'] = 5;
        if ($agent_id == '214748') {
            header("Location:admin/profile.php");
        } else {
            header("Location:profile.php");
        }
    }
}

if (isset($_REQUEST['profile_imageupdate'])) {
    $agent_id = mysqli_real_escape_string($conn, $_REQUEST['agent_id']);
    $imageUrl = mysqli_real_escape_string($conn, $_REQUEST['imageurl']);
    if ($imageUrl) {
        $data = mysqli_query($conn, "UPDATE `agent` SET `profile_image`='$imageUrl' WHERE `agent_id`='$agent_id'");
        $_SESSION['status'] = 4;
    }
}



if (isset($_REQUEST['withdrawal_btn'])) {
    $my_id = mysqli_real_escape_string($conn, $_REQUEST['user_id']);
    $amt = mysqli_real_escape_string($conn, $_REQUEST['amount']);
    $bank_detail = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `bank_account` WHERE `agent_id`='$my_id'"));
    $amount = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$my_id'"));
    $history = mysqli_query($conn, "SELECT * FROM `withdraw_history` WHERE `agent_id`='$my_id' && `status`='0'");
    $_SESSION['status'] = 0;
    if (mysqli_num_rows($history) == 0) {
        if ($bank_detail['account_number'] == '') {
            $_SESSION['status'] = 5;
        } elseif ($amount['wallet'] >= $amt) {
            $deduction = $amt * .15;
            $payable_amt = $amt - $deduction;
            $time = date("Y-m-d h:i:sa");
            mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`-$amt WHERE `agent_id` = '$my_id'");
            mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$my_id','$amt','withdrawal','$time','1')");
            mysqli_query($conn, "INSERT INTO `withdraw_history`(`agent_id`, `amount`, `payable_amt`, `req_time`) VALUES ('$my_id', '$amt', '$payable_amt', '$time')");
            $_SESSION['status'] = 4;
        }
    }
    header("Location:withdrawal.php");
}

if (isset($_REQUEST['usdt_withdrawal'])) {
    $my_id = mysqli_real_escape_string($conn, $_REQUEST['user_id']);
    $usdt = mysqli_real_escape_string($conn, $_REQUEST['amount']);
    $amt = $usdt * 85;
    $bank_detail = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `bank_account` WHERE `agent_id`='$my_id'"));
    $amount = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$my_id'"));
    $history = mysqli_query($conn, "SELECT * FROM `withdraw_history` WHERE `agent_id`='$my_id' && `status`='0'");
    $_SESSION['status'] = 0;
    if (mysqli_num_rows($history) == 0) {
        if ($bank_detail['usdt'] == '') {
            $_SESSION['status'] = 5;
        } elseif ($amount['wallet'] >= $amt) {
            $usdt = $amt / 85;
            $deduction = $amt * .15;
            $payable = $amt - $deduction;
            $payable_amt = $payable / 85;
            $time = date("Y-m-d h:i:sa");
            mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`-$amt WHERE `agent_id` = '$my_id'");
            mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$my_id','$amt','withdrawal','$time','1')");
            mysqli_query($conn, "INSERT INTO `withdraw_history`(`agent_id`, `amount`, `payable_amt`, `req_time`, `usdt`) VALUES ('$my_id', '$usdt', '$payable_amt', '$time', '1')");
            $_SESSION['status'] = 4;
        }
    }
    header("Location:withdrawal.php");
}

if (isset($_REQUEST['other_income_btn'])) {
    $time = date("Y-m-d h:i:sa");
    $my_id = mysqli_real_escape_string($conn, $_REQUEST['agent_id']);
    $amt = mysqli_real_escape_string($conn, $_REQUEST['amount']);
    $desp = mysqli_real_escape_string($conn, $_REQUEST['desp']);
    $income = $amt * .90;
    $update = $amt * .10;
    mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`+$income, `upgrade_amt`=`upgrade_amt`+$update WHERE `agent_id` = '$my_id'");
    mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$my_id','$amt','$desp','$time','0')");
    check_upgrade($my_id);
    $_SESSION['status'] = 4;
    header("Location:./admin/other_income_add.php");
}

if (isset($_REQUEST['add_money_btn'])) {
    $timestamp = date("Y-m-d h:i:sa");
    $agent_id = mysqli_real_escape_string($conn, $_REQUEST['agent_id']);
    $payer_name = mysqli_real_escape_string($conn, $_REQUEST['payer_name']);
    $payment_id = mysqli_real_escape_string($conn, $_REQUEST['payment_id']);
    $amt = mysqli_real_escape_string($conn, $_REQUEST['amt']);
    $history = mysqli_query($conn, "SELECT * FROM `payment_proof` WHERE `agent_id`='$agent_id' && `status`='0'");
    if (mysqli_num_rows($history) == 0) {
        if (check_tran_id($payment_id)) {
            $payment_proof = $_FILES['img_input']['name'];
            $payment_proof_temp = $_FILES['img_input']['tmp_name'];
            $payment_proof_dir = "assets/img/payment_proof/" . $payment_proof;
            if (move_uploaded_file($payment_proof_temp, $payment_proof_dir)) {
                mysqli_query($conn, "INSERT INTO `payment_proof`(`agent_id`, `name`, `transaction_id`, `amount`, `img_name`, `date`, `added_date`, `status`) VALUES('$agent_id','$payer_name','$payment_id','$amt','$payment_proof','$timestamp','NA','0')");
                $_SESSION['status'] = 4;
            }
        } else {
            $_SESSION['status'] = 6;
        }
    } else {
        $_SESSION['status'] = 5;
    }
    header("Location:add_money.php");
}

if (isset($_REQUEST['usdt_add_money_btn'])) {
    $timestamp = date("Y-m-d h:i:sa");
    $agent_id = mysqli_real_escape_string($conn, $_REQUEST['agent_id']);
    $payment_id = mysqli_real_escape_string($conn, $_REQUEST['payment_id']);
    $amt = mysqli_real_escape_string($conn, $_REQUEST['amt']);
    $history = mysqli_query($conn, "SELECT * FROM `payment_proof` WHERE `agent_id`='$agent_id' && `status`='0'");
    if (mysqli_num_rows($history) == 0) {
        if (check_tran_id($payment_id)) {
            $payment_proof = $_FILES['img_input']['name'];
            $payment_proof_temp = $_FILES['img_input']['tmp_name'];
            $payment_proof_dir = "assets/img/payment_proof/" . $payment_proof;
            if (move_uploaded_file($payment_proof_temp, $payment_proof_dir)) {
                mysqli_query($conn, "INSERT INTO `payment_proof`(`agent_id`, `transaction_id`, `amount`, `img_name`, `date`, `added_date`, `status`, `usdt`) VALUES('$agent_id','$payment_id','$amt','$payment_proof','$timestamp','NA','0','1')");
                $_SESSION['status'] = 4;
            }
        } else {
            $_SESSION['status'] = 6;
        }
    } else {
        $_SESSION['status'] = 5;
    }
    header("Location:add_money.php");
}


if (isset($_REQUEST['bank_detail_update'])) {
    $agent_id = mysqli_real_escape_string($conn, $_REQUEST['agent_id']);
    $acc_holder = mysqli_real_escape_string($conn, $_REQUEST['acc_holder']);
    $acc_num = mysqli_real_escape_string($conn, $_REQUEST['acc_num']);
    $ifsc_code = mysqli_real_escape_string($conn, $_REQUEST['ifsc_code']);
    $bank_name = mysqli_real_escape_string($conn, $_REQUEST['bank_name']);
    $usdt = mysqli_real_escape_string($conn, $_REQUEST['usdt']);
    $data = mysqli_query($conn, "UPDATE `bank_account` SET `bank_name`='$bank_name',`account_number`='$acc_num',`IFSC_code`='$ifsc_code',`account_holder`='$acc_holder',`usdt`='$usdt' WHERE `agent_id`='$agent_id'");
    $_SESSION['status'] = 4;
    if ($agent_id == '214748') {
        header("Location:admin/profile.php");
    } else {
        header("Location:profile.php");
    }
}

if (isset($_REQUEST['withdrawal__btn'])) {
    $timestamp = date("Y-m-d h:i:sa");
    $agent_id = mysqli_real_escape_string($conn, $_REQUEST['user_id']);
    $amt = mysqli_real_escape_string($conn, $_REQUEST['amount']);
    $x = mysqli_query($conn, "UPDATE `withdraw_history` SET `status`='1',`approve_time`='$timestamp' WHERE `agent_id`='$agent_id' AND `amount`='$amt'");
    if ($x) {
        $_SESSION['status'] = 4;
    }
    header("Location:admin/withdrawal.php");
}

if (isset($_REQUEST['reject_withdrawal_btn'])) {
    $timestamp = date("Y-m-d h:i:sa");
    $agent_id = mysqli_real_escape_string($conn, $_REQUEST['user_id']);
    $amt = mysqli_real_escape_string($conn, $_REQUEST['amount']);
    $reason = mysqli_real_escape_string($conn, $_REQUEST['reason']);
    $usdt_check = mysqli_fetch_array(mysqli_query($conn,"SELECT * FROM `withdraw_history` WHERE `agent_id`='$agent_id' && `status`='0'"));
    $x = mysqli_query($conn, "UPDATE `withdraw_history` SET `status`='1',`approve_time`='Rejected($reason)' WHERE `agent_id`='$agent_id' AND `amount`='$amt'");
    if ($usdt_check['usdt'] == '1') {
        $amount = $amt * 85;
    } elseif ($usdt_check['usdt'] == '0') {
        $amount = $amt ;
    }
    mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`+$amount WHERE `agent_id` = '$agent_id'");
    mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$agent_id','$amount','Refund','$time','0')");
    $_SESSION['status'] = 5;
    header("Location:admin/withdrawal.php");
}

if (isset($_REQUEST['notify'])) {
    $timestamp = date("Y-m-d h:i:sa");
    $mess = mysqli_real_escape_string($conn, $_REQUEST['message']);
    $x = mysqli_query($conn, "INSERT INTO `notify`(`message`, `date`) VALUES ('$mess','$timestamp')");
    if ($x) {
        $_SESSION['status'] = 4;
    }
    header("Location:admin/message.php");
}


if (isset($_REQUEST['logout_btn'])) {
    unset($_SESSION['sess_id']);
    unset($_SESSION['my_id']);
    header("Location:login.php");
}

if (isset($_REQUEST['b_silver_btn'])) {
    $package = 'b_silver';
    $agent = mysqli_real_escape_string($conn, $_REQUEST['user']);
    $wallet = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$agent'"));
    $amount = $wallet['wallet'];
    if ($amount >= 500) {
        $timestamp = date("Y-m-d h:i:sa");
        $amt = 500;
        mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`-$amt WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "UPDATE `agent` SET `activatation_date`='$timestamp',`package`='$package' WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$agent','$amt','Package Active','$timestamp','1')");
        $agent_id = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$agent'"));
        if ($agent_id['status'] == '0') {
            level_income_distribute($agent, $package);
        } else {
            $package_old = $agent_id['package'];
            mysqli_query($conn, "UPDATE `$package_old` SET `upgrade`='1' WHERE `agent_id`='$agent'");
            insert_in_matrix_autopool($agent, $package);
        }
        echo '<script>alert("Success! package activated")</script>';
        echo '<script>window.location.replace("package.php");</script>';
        mysqli_query($conn, "UPDATE `agent` SET `status`='1' WHERE `agent_id` = '$agent'");
    } else {
        echo '<script>alert("Low account balance!")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    }
}

if (isset($_REQUEST['b_gold_btn'])) {
    $package = 'b_gold';
    $agent = mysqli_real_escape_string($conn, $_REQUEST['user']);
    $wallet = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$agent'"));
    $amount = $wallet['wallet'];
    if ($amount >= 1000) {
        $timestamp = date("Y-m-d h:i:sa");
        $amt = 1000;
        mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`-$amt WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "UPDATE `agent` SET `activatation_date`='$timestamp',`package`='$package' WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$agent','$amt','Package Active','$timestamp','1')");
        $agent_id = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$agent'"));
        $agent = $agent_id['agent_id'];
        if ($agent_id['status'] == '0') {
            level_income_distribute($agent, $package);
        } else {
            $package_old = $agent_id['package'];
            mysqli_query($conn, "UPDATE `$package_old` SET `upgrade`='1' WHERE `agent_id`='$agent'");
            insert_in_matrix_autopool($agent, $package);
        }
        mysqli_query($conn, "UPDATE `agent` SET `status`='1' WHERE `agent_id` = '$agent'");
        echo '<script>alert("Success! package activated")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    } else {
        echo '<script>alert("Low account balance!")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    }
}

if (isset($_REQUEST['b_diamond_btn'])) {
    $package = 'b_diamond';
    $agent = mysqli_real_escape_string($conn, $_REQUEST['user']);
    $wallet = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$agent'"));
    $amount = $wallet['wallet'];
    if ($amount >= 2500) {
        $timestamp = date("Y-m-d h:i:sa");
        $amt = 2500;
        mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`-$amt WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "UPDATE `agent` SET `activatation_date`='$timestamp',`package`='$package' WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$agent','$amt','Package Active','$timestamp','1')");
        $agent_id = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$agent'"));
        $agent = $agent_id['agent_id'];
        if ($agent_id['status'] == '0') {
            level_income_distribute($agent, $package);
        } else {
            $package_old = $agent_id['package'];
            mysqli_query($conn, "UPDATE `$package_old` SET `upgrade`='1' WHERE `agent_id`='$agent'");
            insert_in_matrix_autopool($agent, $package);
        }
        mysqli_query($conn, "UPDATE `agent` SET `status`='1' WHERE `agent_id` = '$agent'");
        echo '<script>alert("Success! package activated")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    } else {
        echo '<script>alert("Low account balance!")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    }
}

if (isset($_REQUEST['b_platinum_btn'])) {
    $package = 'b_platinum';
    $agent = mysqli_real_escape_string($conn, $_REQUEST['user']);
    $wallet = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$agent'"));
    $amount = $wallet['wallet'];
    if ($amount >= 6500) {
        $timestamp = date("Y-m-d h:i:sa");
        $amt = 6500;
        mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`-$amt WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "UPDATE `agent` SET `activatation_date`='$timestamp',`package`='$package' WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$agent','$amt','Package Active','$timestamp','1')");
        $agent_id = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$agent'"));
        $agent = $agent_id['agent_id'];
        if ($agent_id['status'] == '0') {
            level_income_distribute($agent, $package);
        } else {
            $package_old = $agent_id['package'];
            mysqli_query($conn, "UPDATE `$package_old` SET `upgrade`='1' WHERE `agent_id`='$agent'");
            insert_in_matrix_autopool($agent, $package);
        }
        mysqli_query($conn, "UPDATE `agent` SET `status`='1' WHERE `agent_id` = '$agent'");
        echo '<script>alert("Success! package activated")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    } else {
        echo '<script>alert("Low account balance!")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    }
}

if (isset($_REQUEST['b_rocking_btn'])) {
    $package = 'b_rocking';
    $agent = mysqli_real_escape_string($conn, $_REQUEST['user']);
    $wallet = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$agent'"));
    $amount = $wallet['wallet'];
    if ($amount >= 10000) {
        $timestamp = date("Y-m-d h:i:sa");
        $amt = 10000;
        mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`-$amt WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "UPDATE `agent` SET `activatation_date`='$timestamp',`package`='$package' WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$agent','$amt','Package Active','$timestamp','1')");
        $agent_id = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$agent'"));
        $agent = $agent_id['agent_id'];
        if ($agent_id['status'] == '0') {
            level_income_distribute($agent, $package);
        } else {
            $package_old = $agent_id['package'];
            mysqli_query($conn, "UPDATE `$package_old` SET `upgrade`='1' WHERE `agent_id`='$agent'");
            insert_in_matrix_autopool($agent, $package);
        }
        mysqli_query($conn, "UPDATE `agent` SET `status`='1' WHERE `agent_id` = '$agent'");
        echo '<script>alert("Success! package activated")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    } else {
        echo '<script>alert("Low account balance!")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    }
}

if (isset($_REQUEST['p_silver_btn'])) {
    $package = 'p_silver';
    $agent = mysqli_real_escape_string($conn, $_REQUEST['user']);
    $wallet = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$agent'"));
    $amount = $wallet['wallet'];
    if ($amount >= 12500) {
        $timestamp = date("Y-m-d h:i:sa");
        $amt = 12500;
        mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`-$amt WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "UPDATE `agent` SET `activatation_date`='$timestamp',`package`='$package' WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$agent','$amt','Package Active','$timestamp','1')");
        $agent_id = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$agent'"));
        $agent = $agent_id['agent_id'];
        if ($agent_id['status'] == '0') {
            level_income_distribute($agent, $package);
        } else {
            $package_old = $agent_id['package'];
            mysqli_query($conn, "UPDATE `$package_old` SET `upgrade`='1' WHERE `agent_id`='$agent'");
            insert_in_matrix_autopool($agent, $package);
        }
        mysqli_query($conn, "UPDATE `agent` SET `status`='1' WHERE `agent_id` = '$agent'");
        echo '<script>alert("Success! package activated")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    } else {
        echo '<script>alert("Low account balance!")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    }
}

if (isset($_REQUEST['p_gold_btn'])) {
    $package = 'p_gold';
    $agent = mysqli_real_escape_string($conn, $_REQUEST['user']);
    $wallet = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$agent'"));
    $amount = $wallet['wallet'];
    if ($amount >= 55000) {
        $timestamp = date("Y-m-d h:i:sa");
        $amt = 55000;
        mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`-$amt WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "UPDATE `agent` SET `activatation_date`='$timestamp',`package`='$package' WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$agent','$amt','Package Active','$timestamp','1')");
        $agent_id = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$agent'"));
        $agent = $agent_id['agent_id'];
        if ($agent_id['status'] == '0') {
            level_income_distribute($agent, $package);
        } else {
            $package_old = $agent_id['package'];
            mysqli_query($conn, "UPDATE `$package_old` SET `upgrade`='1' WHERE `agent_id`='$agent'");
            insert_in_matrix_autopool($agent, $package);
        }
        mysqli_query($conn, "UPDATE `agent` SET `status`='1' WHERE `agent_id` = '$agent'");
        echo '<script>alert("Success! package activated")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    } else {
        echo '<script>alert("Low account balance!")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    }
}

if (isset($_REQUEST['p_diamond_btn'])) {
    $package = 'p_diamond';
    $agent = mysqli_real_escape_string($conn, $_REQUEST['user']);
    $wallet = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$agent'"));
    $amount = $wallet['wallet'];
    if ($amount >= 80000) {
        $timestamp = date("Y-m-d h:i:sa");
        $amt = 80000;
        mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`-$amt WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "UPDATE `agent` SET `activatation_date`='$timestamp',`package`='$package' WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$agent','$amt','Package Active','$timestamp','1')");
        $agent_id = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$agent'"));
        $agent = $agent_id['agent_id'];
        if ($agent_id['status'] == '0') {
            level_income_distribute($agent, $package);
        } else {
            $package_old = $agent_id['package'];
            mysqli_query($conn, "UPDATE `$package_old` SET `upgrade`='1' WHERE `agent_id`='$agent'");
            insert_in_matrix_autopool($agent, $package);
        }
        mysqli_query($conn, "UPDATE `agent` SET `status`='1' WHERE `agent_id` = '$agent'");
        echo '<script>alert("Success! package activated")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    } else {
        echo '<script>alert("Low account balance!")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    }
}

if (isset($_REQUEST['p_platinum_btn'])) {
    $package = 'p_platinum';
    $agent = mysqli_real_escape_string($conn, $_REQUEST['user']);
    $wallet = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$agent'"));
    $amount = $wallet['wallet'];
    if ($amount >= 100000) {
        $timestamp = date("Y-m-d h:i:sa");
        $amt = 100000;
        mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`-$amt WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "UPDATE `agent` SET `activatation_date`='$timestamp',`package`='$package' WHERE `agent_id` = '$agent'");
        mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$agent','$amt','Package Active','$timestamp','1')");
        $agent_id = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$agent'"));
        $agent = $agent_id['agent_id'];
        if ($agent_id['status'] == '0') {
            level_income_distribute($agent, $package);
        } else {
            $package_old = $agent_id['package'];
            mysqli_query($conn, "UPDATE `$package_old` SET `upgrade`='1' WHERE `agent_id`='$agent'");
            insert_in_matrix_autopool($agent, $package);
        }
        mysqli_query($conn, "UPDATE `agent` SET `status`='1' WHERE `agent_id` = '$agent'");
        echo '<script>alert("Success! package activated")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    } else {
        echo '<script>alert("Low account balance!")</script>';
        echo '<script>window.location.replace("package.php");</script>';
    }
}

if (isset($_REQUEST['block_btn'])) {
    $id = mysqli_real_escape_string($conn, $_REQUEST['user_id']);
    $b = mysqli_query($conn, "UPDATE `agent` SET `block`='1' WHERE `agent_id`='$id'");
    if ($b) {
        $_SESSION['status'] = 4;
    }
    header("Location:admin/block.php");
}

if (isset($_REQUEST['del_btn'])) {
    $id = mysqli_real_escape_string($conn, $_REQUEST['user_id']);
    $b = mysqli_query($conn, "DELETE FROM `agent` WHERE `agent_id`='$id'");
    mysqli_query($conn, "DELETE FROM `bank_account` WHERE `agent_id`='$id'");
    mysqli_query($conn, "DELETE FROM `agent_income` WHERE `agent_id`='$id'");
    mysqli_query($conn, "DELETE FROM `email_verify` WHERE `agent_id`='$id'");
    if ($b) {
        $_SESSION['status'] = 4;
    }
    header("Location:admin/del.php");
}

if (isset($_REQUEST['unblock_btn'])) {
    $id = mysqli_real_escape_string($conn, $_REQUEST['user_id']);
    $b = mysqli_query($conn, "UPDATE `agent` SET `block`='0' WHERE `agent_id`='$id'");
    if ($b) {
        $_SESSION['status'] = 5;
    }
    header("Location:admin/block.php");
}

if (isset($_REQUEST['ques'])) {
    $name = mysqli_real_escape_string($conn, $_REQUEST['name']);
    $phone = mysqli_real_escape_string($conn, $_REQUEST['phone']);
    $email = mysqli_real_escape_string($conn, $_REQUEST['email']);
    $message = mysqli_real_escape_string($conn, $_REQUEST['question']);
    $time = date("Y-m-d h:i:sa");
    mysqli_query($conn, "INSERT INTO `message`(`name`, `phone`, `email`, `message`, `date`) VALUES ('$name','$phone','$email','$message','$time')");
    header("Location:index.php");
}

if (isset($_REQUEST['increase_btn'])) {
    $agent_id = mysqli_real_escape_string($conn, $_REQUEST['user_id']);
    $amt = mysqli_real_escape_string($conn, $_REQUEST['amount']);
    $income = $amt * .90;
    $update = $amt * .10;
    $x = mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`+$income, `upgrade_amt`=`upgrade_amt`+$update WHERE `agent_id` = '$agent_id'");
    if ($x) {
        $_SESSION['status'] = 4;
    }
    header("Location:admin/money_increase.php");
}

if (isset($_REQUEST['decrease_btn'])) {
    $agent_id = mysqli_real_escape_string($conn, $_REQUEST['user_id']);
    $amt = mysqli_real_escape_string($conn, $_REQUEST['amount']);
    $income = $amt * .90;
    $update = $amt * .10;
    $x = mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`-$income, `upgrade_amt`=`upgrade_amt`-$update WHERE `agent_id` = '$agent_id'");
    if ($x) {
        $_SESSION['status'] = 5;
    }
    header("Location:admin/money_increase.php");
}
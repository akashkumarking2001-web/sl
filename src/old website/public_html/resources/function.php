<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

function sendMail($agent_id, $password, $email, $v_code)
{
    require("PHPMailer/PHPMailer.php");
    require("PHPMailer/SMTP.php");
    require("PHPMailer/Exception.php");

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
        $mail->isSMTP();                                            //Send using SMTP
        $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
        $mail->Username   = '3tmoneyworld@gmail.com';                     //SMTP username
        $mail->Password   = 'dwkzxetvdqjxobmm';                               //SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
        $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

        //Recipients
        $mail->setFrom('3tmoneyworld@gmail.com', '3T Money World');
        $mail->addAddress($email);     //Add a recipient

        //Content
        $mail->isHTML(true);                                  //Set email format to HTML

        $email_template = "./test.html";
        $name = "3T$agent_id";
        $id = "$password";
        $link = "https://3tmoneyworld.com/resources/verify.php?email=$email&v_code=$v_code";

        $message = file_get_contents($email_template);
        $message = str_replace('%name%', $name, $message);
        $message = str_replace('%id%', $id, $message);
        $message = str_replace('%link%', $link, $message);


        $mail->Subject = 'Email Verification from 3T Money World';
        $mail->Body    = $message;

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}

function forgot_mail($email, $agent_id, $password)
{
    require("PHPMailer/PHPMailer.php");
    require("PHPMailer/SMTP.php");
    require("PHPMailer/Exception.php");

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Enable verbose debug output
        $mail->isSMTP();                                            //Send using SMTP
        $mail->Host       = 'smtp.gmail.com';                     //Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   //Enable SMTP authentication
        $mail->Username   = '3tmoneyworld@gmail.com';                     //SMTP username
        $mail->Password   = 'dwkzxetvdqjxobmm';                               //SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
        $mail->Port       = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

        //Recipients
        $mail->setFrom('3tmoneyworld@gmail.com', '3T Money World');
        $mail->addAddress($email);     //Add a recipient

        //Content
        $mail->isHTML(true);                                  //Set email format to HTML

        $mail->Subject = 'Forgot Password from 3T Money World';
        $mail->Body    = "Your Login Details <br> Agent ID : $agent_id <br> Password : $password";

        $mail->send();
        return true;
    } catch (Exception $e) {
        return false;
    }
}

function check_sponsor_id($sps_id)
{
    global $conn;
    $data = mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id` = '$sps_id'");
    // $data = mysqli_num_rows($data);
    if (mysqli_num_rows($data) == 1) {
        return true;
    }
    return false;
}

function check_payment($agent_id)
{
    global $conn;
    $b = mysqli_query($conn, "SELECT * FROM `payment_proof` WHERE `agent_id`='$agent_id'");
    if (mysqli_num_rows($b) == 1) {
        return true;
    }
    return false;
}
function check_mobile($mobile)
{
    global $conn;
    $data = mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_mobile` = '$mobile'");
    // $data = mysqli_num_rows($data);
    if (mysqli_num_rows($data) == 1) {
        return false;
    }
    return true;
}

function check_tran_id($id)
{
    global $conn;
    $data = mysqli_query($conn, "SELECT * FROM `payment_proof` WHERE `transaction_id` = '$id'");
    // $data = mysqli_num_rows($data);
    if (mysqli_num_rows($data) >= 1) {
        return false;
    }
    return true;
}

function check_email($email)
{
    global $conn;
    $data = mysqli_query($conn, "SELECT * FROM `email_verify` WHERE `email` = '$email'");
    if (mysqli_num_rows($data) == 1) {
        return false;
    }
    return true;
}

function check_valid_user_id($agent_id)
{
    global $conn;
    $data = mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id` = '$agent_id'");
    // $data = mysqli_num_rows($data);
    if (mysqli_num_rows($data) == 1) {
        return true;
    }
    return false;
}

function check_user_active_or_not($agent_id)
{
    global $conn;
    $data = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id` = '$agent_id'"));
    if ($data['status']) {
        return false;
    }
    return true;
}

function check_pin_valid_or_not($pin)
{
    global $conn;
    $data = mysqli_query($conn, "SELECT * FROM `pins` WHERE `pin_value` = '$pin'");
    if (mysqli_num_rows($data) == 1) {
        $data = mysqli_fetch_array($data);
        if (!$data['pin_status']) {
            return true;
        }
    }
    return false;
}

function check_pack($package) {
    $pack = ['b_silver', 'b_gold', 'b_diamond', 'b_platinum', 'p_silver', 'p_gold', 'p_diamond'];
    $a = 0;
    while ($pack[$a] != $package) {
        ++$a;
        $pack_num = $a;
    }
    return $pack_num + 1;
}


function level_income_distribute($agent_id, $pack)
{
    global $conn;
    $sponsor_id = get_spons_id($agent_id);
    $time = date("Y-m-d h:i:sa");
    $qurry = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$sponsor_id'"));
    $package = $qurry['package'];
    if ($pack == 'b_silver') {
        $amt = 100;
    } elseif ($pack == 'b_gold') {
        $amt = 200;
    } elseif ($pack == 'b_diamond') {
        $amt = 500;
    } elseif ($pack == 'b_platinum') {
        $amt = 2500;
    } elseif ($pack == 'b_rocking') {
        $amt = 500;
    } elseif ($pack == 'p_silver') {
        $amt = 1500;
    } elseif ($pack == 'p_gold') {
        $amt = 5000;
    } elseif ($pack == 'p_diamond') {
        $amt = 10000;
    } elseif ($pack == 'p_platinum') {
        $amt = 500;
    } else {
        $amt = 0;
    }
    $income = $amt * .90;
    $update = $amt * .10;
    mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`+$income, `upgrade_amt`=`upgrade_amt`+$update WHERE `agent_id`='$sponsor_id'");
    mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$sponsor_id','$amt','Referral Income','$time','0')");
    $a = 1;
    $amt = 0;
    while ($a <= 12 && $sponsor_id != 0) {
        $qurry = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$sponsor_id'"));
        $package = $qurry['package'];
        if ($pack == $package) {
            if ($package == 'b_silver') {
                $amt = 20;
            } elseif ($package == 'b_gold') {
                $level = [40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 80, 80];
                $amt = $level[$a - 1];
            } elseif ($package == 'b_diamond') {
                $level = [125, 125, 125, 125, 125, 125, 125, 125, 125, 125, 150, 150];
                $amt = $level[$a - 1];
            } elseif ($package == 'b_platinum') {
                $level = [170, 170, 170, 170, 170, 170, 170, 170, 170, 170, 200, 200];
                $amt = $level[$a - 1];
            } elseif ($package == 'b_platinum') {
                $level = [260, 260, 260, 260, 260, 260, 260, 260, 260, 260, 300, 300];
                $amt = $level[$a - 1];
            }
            $income = $amt * .90;
            $update = $amt * .10;
            mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`+$income, `upgrade_amt`=`upgrade_amt`+$update WHERE `agent_id`='$sponsor_id'");
            mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`, `level_id`) VALUES ('$sponsor_id','$amt','Level Income','$time','0','$agent_id')");
            mysqli_query($conn, "UPDATE `agent` SET `downline`=`downline`+1 WHERE `agent_id`='$sponsor_id'");
        }
        $sponsor_id = get_spons_id($sponsor_id);
        ++$a;
    }
    insert_in_matrix_autopool($agent_id, $pack);
}

function check_upgrade($agent_id)
{
    global $conn;
    $query = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$agent_id'"));
    $wallet = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent_income` WHERE `agent_id`='$agent_id'"));
    $package = $query['package'];
    $up_amt = $wallet['upgrade_amt'];
    $array_package = ['b_silver', 'b_gold', 'b_diamond', 'b_platinum', 'b_rocking'];
    $array_package_p = ['p_silver', 'p_gold', 'p_diamond', 'p_platinum'];
    $array_amount = [500, 1000, 2500, 6500, 10000];
    $array_amount_p = [12500, 55000, 80000, 100000];
    $a = 0;
    while ($a < 4) {
        $array_package[$a];
        $package;
        if ($array_package[$a] == $package) {
            $b = $a + 1;
            if ($array_amount[$b] <= $up_amt) {
                $time = date("Y-m-d h:i:sa");
                mysqli_query($conn, "UPDATE `agent_income` SET `upgrade_amt`=`upgrade_amt`-$array_amount[$b] WHERE `agent_id`='$agent_id'");
                mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$agent_id','$array_amount[$b]','Auto Upgrade','$time','1')");
                mysqli_query($conn, "UPDATE `$array_package[$a]` SET `upgrade`='1' WHERE `agent_id`='$agent_id'");
                Insert_in_matrix_autopool($agent_id, $array_package[$b]);
            }
        }
        ++$a;
    }
    $a = 0;
    while ($a < 3) {
        $array_package_p[$a];
        $package;
        if ($array_package_p[$a] == $package) {
            $b = $a + 1;
            if ($array_amount_p[$b] <= $up_amt) {
                $time = date("Y-m-d h:i:sa");
                mysqli_query($conn, "UPDATE `agent_income` SET `upgrade_amt`=`upgrade_amt`-$array_amount_p[$b] WHERE `agent_id`='$agent_id'");
                mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$agent_id','$array_amount_p[$b]','Auto Upgrade','$time','1')");
                mysqli_query($conn, "UPDATE `$array_package_p[$a]` SET `upgrade`='1' WHERE `agent_id`='$agent_id'");
                Insert_in_matrix_autopool($agent_id, $array_package_p[$b]);
            }
        }
        ++$a;
    }
}

function insert_in_matrix_autopool($agent_id, $pack)
{
    global $conn;
    $query = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `$pack` WHERE `left_pos`='' OR `mid_pos`='' OR `right_pos`=''"));
    $placement_id = $query['agent_id'];
    $position = ($query['left_pos'] == '') ? 'left_pos' : (($query['mid_pos'] == '') ? 'mid_pos' : 'right_pos');
    mysqli_query($conn, "INSERT INTO `$pack`(`agent_id`, `placement_id`, `level`) VALUES ('$agent_id','$placement_id','1')");
    mysqli_query($conn, "UPDATE `agent` SET `package`='$pack' WHERE `agent_id`='$agent_id'");
    mysqli_query($conn, "UPDATE `$pack` SET `$position`='$agent_id' WHERE `agent_id` = '$placement_id'");
    distribute_level_for_autopool($agent_id,$pack);
}

function distribute_level_for_autopool($agent_id, $pack)
{
    global $conn;
    $data = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `$pack` WHERE `agent_id`='$agent_id'"));
    $parent_id = $data['placement_id'];
    $level = 0;
    if ($pack == 'p_silver' || $pack == 'p_gold' || $pack == 'p_platinum' || $pack == 'p_diamond') {
        $level = 6;
    } else {
        $level = 8;
    }
    $a = 0;
    while ($parent_id != '0' && $a <= $level) {
        $qurry = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$parent_id'"));
        $package = $qurry['package'];
        mysqli_query($conn, "UPDATE `$pack` SET `downline`=`downline`+1 , `mem`=`mem`+1 WHERE `agent_id`='$parent_id'");

        $auto = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `$pack` WHERE `agent_id`='$parent_id'"));
        $members = pow(3, $auto['level']);
        if ($auto['mem'] == $members && $auto['upgrade'] == 0) {
            $time = date("Y-m-d h:i:sa");
            if ($package == 'b_silver') {
                $amt = 100 * $members;
            } elseif ($package == 'b_gold') {
                $amt = 200 * $members;
            } elseif ($package == 'b_diamond') {
                $amt = 500 * $members;
            } elseif ($package == 'b_platinum') {
                $amt = 1000 * $members;
            }  elseif ($package == 'b_rocking') {
                $amt = 2000 * $members;
            } elseif ($package == 'p_silver') {
                $amt = 6000 * $members;
            } elseif ($package == 'p_gold') {
                $amt = 28000 * $members;
            } elseif ($package == 'p_diamond') {
                $amt = 40000 * $members;
            }  elseif ($package == 'p_platinum') {
                $amt = 90000 * $members;
            }
            $income = $amt * .90;
            $update = $amt * .10;
            mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`+$income, `upgrade_amt`=`upgrade_amt`+$update WHERE `agent_id`='$parent_id'");
            mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$parent_id','$amt','Global Income','$time','0')");
            mysqli_query($conn, "UPDATE `$pack` SET `mem`='0', `level`=`level`+1 WHERE `agent_id`='$parent_id'");
        }
        $data = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `$pack` WHERE `agent_id`='$parent_id'"));
        $parent_id = $data['placement_id'];
        $a++;
    }
    $sponsor_id = get_spons_id($agent_id);
    $over_income = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM `agent` WHERE `sponsor_id`='$sponsor_id'"));
    if ($over_income % 3 == 0) {
        spilover($sponsor_id);
    }
}

function spilover($agent_id) {
    global $conn;
    $downline = mysqli_query($conn, "SELECT * FROM `agent` WHERE `sponsor_id`='$agent_id'");
    $array = array();
    $num_down = mysqli_num_rows($downline); 
    while ($data = mysqli_fetch_array($downline)) {
        $check_down = mysqli_num_rows(mysqli_query($conn, "SELECT * FROM `agent` WHERE `sponsor_id` = '$data[agent_id]'"));
        if ($num_down > $check_down) {
            array_push($array,$data['agent_id']);
        }
    }
    $spil_id_rand = array_rand($array);
    $spil_id = $array[$spil_id_rand];
    $time = date("Y-m-d h:i:sa");
    $qurry = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$spil_id'"));
    $package = $qurry['package'];
    if ($package == 'b_silver') {
        $down = 5;
    } elseif ($package == 'b_gold') {
        $down = 30;
    } elseif ($package == 'b_diamond') {
        $down = 155;
    } elseif ($package == 'b_platinum' OR $package == 'b_rocking') {
        $down = 780;
    }
    if ($down >= $qurry['spilover'] && $qurry['status']=='1') {
        if ($qurry['spilover'] < 5) {
            $amt = 50;
        }elseif ($qurry['spilover'] < 30) {
            $amt = 100;
        } elseif ($qurry['spilover'] < 155) {
            $amt = 150;
        } elseif ($qurry['spilover'] < 780) {
            $amt = 200;
        } 
        $income = $amt * .90;
        $update = $amt * .10;
        mysqli_query($conn, "UPDATE `agent_income` SET `wallet`=`wallet`+$income, `upgrade_amt`=`upgrade_amt`+$update WHERE `agent_id`='$spil_id'");
        mysqli_query($conn, "INSERT INTO `wallet_history`(`agent_id`, `amt`, `desp`, `date_time`, `status`) VALUES ('$spil_id','$amt','Spillover Income','$time','0')");
        mysqli_query($conn, "UPDATE `agent` SET `spilover`=`spilover`+1 WHERE `agent_id`='$spil_id'");
    }
    
}

function get_spons_id($agent_id)
{
    global $conn;
    $data = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$agent_id'"));
    return $data['sponsor_id'];
}

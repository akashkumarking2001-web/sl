<?php

require("connection_build.php");
require("function.php");

if (isset($_GET['email']) && isset($_GET['v_code'])) {
    $result = mysqli_query($conn, "SELECT * FROM `email_verify` WHERE `email`='$_GET[email]' AND `verification_code`='$_GET[v_code]'");
    if ($result) {
        if (mysqli_num_rows($result) == 1) {
            $result_fatch = mysqli_fetch_array($result);
            if ($result_fatch['is_verified'] == 0) {
                mysqli_query($conn,"UPDATE `email_verify` SET `is_verified`='1' WHERE `email`='$result_fatch[email]'");
                $_SESSION['status'] = 4;
                header("Location:../login.php");
            } else {
                $_SESSION['status'] = 5;
                header("Location:../login.php");
            }
        }
    } else {
        echo "
        <script>
        alart('cannot run query');
        window.location.href='../register.php';
        </script>";
    }
}

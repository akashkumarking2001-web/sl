<?php
    session_start();
    $db_host = "localhost";
    $db_user = "u681451102_mlm1";
    $db_pass = "3Tmoneyworld@";
    $db_name = "u681451102_mlm1";

    $conn = mysqli_connect($db_host,$db_user,$db_pass,$db_name);
    if(mysqli_connect_error())
    {
        header('location:404.php');
    }

    date_default_timezone_set('Asia/Calcutta');
    function siteURL() 
    {
        $protocol =((!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off') || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";
        $domainName = $_SERVER['HTTP_HOST'];
        return $protocol.$domainName."/adminLTE/";
        
    }
    define("SITE_URL", siteURL());
?>
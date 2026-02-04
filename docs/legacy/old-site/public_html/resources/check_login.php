<?php

    if (isset($_SESSION['sess_id']) && isset($_SESSION['my_id']) && isset($_SESSION['pass'])) 
    {
        $my_id = $_SESSION['my_id'];
        $my_pass = $_SESSION['pass'];
        $a = mysqli_fetch_array(mysqli_query($conn, "SELECT * FROM `agent` WHERE `agent_id`='$my_id'"));
        if($a['password']!=$my_pass) {
            header("Location:https://3tmoneyworld.com/login.php");
        }

    }
    else
    {
        header("Location:https://3tmoneyworld.com/login.php");
    }
?>
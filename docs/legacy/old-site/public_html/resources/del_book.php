<?php
    require("connection_build.php");
    require("function.php");


    if (isset($_GET['name'])){
  
        $book_name=$_GET['name'];
        echo $book_name;

        $book = mysqli_fetch_array(mysqli_query($conn,"SELECT * FROM `ebook` WHERE `book_name`='$book_name'"));
        $path = '../assets/ebook/'.$book['file'];
        unlink($path);

        mysqli_query($conn,"DELETE FROM `ebook` WHERE `book_name`='$book_name'");
        header("Location:../admin/ebook.php");

    }
?>
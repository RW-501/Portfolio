<?php

    //echo "Success ";

	if(isset($_POST['msgZZ'])){

	$name = $_POST['nameZZ'];
	$subject  = $_POST['subjectZZ'];
	$msg = $_POST['msgZZ'];

/*
$path = $_SERVER['DOCUMENT_ROOT'];
   $path .= "/Includes/db_Conx/index.php";
   include($path);
   
   
 $name = clean_Input($db_conx,$name);
 $subject = clean_Input($db_conx,$subject);
 $msg  = clean_Input($db_conx,$msg);

*/


    $headers  = "From: Contct Portfolio <portfolio@mylinks.buzz>\n";
    $headers .= "X-Sender: Portfolio <portfolio@mylinks.buzz>\n";
    $headers .= 'X-Mailer: PHP/' . phpversion();
    $headers .= "X-Priority: 1\n"; // Urgent message!
    $headers .= "Return-Path: admin@mylinks.buzz\n"; // Return path for errors
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=iso-8859-1\n";
	
	
// use wordwrap() if lines are longer than 70 characters
$msg = wordwrap($msg,70);
$msg = "Name:  $name \n Message: $msg"; 
// send email
$result = mail("lilron.2007@yahoo.com",$subject,$msg,$headers);
if(!$result) {   

     echo "Error";   
} else {
    echo "Success";
}


   // echo "Success $msg";



	}


?>
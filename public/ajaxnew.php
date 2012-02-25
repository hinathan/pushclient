<?php

if(!isset($_POST['type'])) {
  header("HTTP/1.1 400 Invalid Input Missing type");
  exit;
 }
if(!isset($_POST['ref'])) {
  header("HTTP/1.1 400 Invalid Input Missing ref");
  exit;
 }

$ref = $_POST['ref'];
$type = $_POST['type'];

$base = 'http://' . $_SERVER['HTTP_HOST'];

$id = sha1(rand());

$info = array(
	      'input_url'=>$base . "/vendor.php?id=$id&ref=$ref",
	      'done_url'=>$base . "/done.php?id=$id&ref=$ref",
	      'error_url'=>$base . "/error.php?id=$id&ref=$ref",
	      'progress_url'=>$base . "/progress.php?ref=$ref",
	      'customer_id' => 'cafe42babe',
	      'transforms' => $type,
	      );

$post_to = 'https://convertallthethings.com/api/v1/createjob';
$ch = curl_init($post_to);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $info);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$result = curl_exec($ch);
header("Content-Type: application/json");
print $result;

<?php

if(isset($_GET['ref']) && isset($_POST['message'])) {
  $ref = $_GET['ref'];
  $to = __DIR__ . '/logs/' . intval(1000*microtime(true)) . '.progress';
  $json = stripslashes($_POST['message']);
  $info = json_decode($json,true);
  $info['ts'] = microtime(true);
  $json = json_encode($info);
  $ch = curl_init("http://push.lensu.com/pub?id=" . $ref);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1 );
  curl_setopt($ch, CURLOPT_POST,           1 );
  curl_setopt($ch, CURLOPT_POSTFIELDS,     $json);
  curl_setopt($ch, CURLOPT_HTTPHEADER,     array('Content-Type: text/plain')); 
  curl_exec($ch);
  print "OK";
 } else {
  header("HTTP/1.1 400 Missing Parameters");
  print "Error";
 }

<?php

error_reporting(E_ALL);

if(count($_FILES)) {
  $tmp = $_FILES['file']['tmp_name'];
  $task = $_POST['transform'];
  if($err = $_FILES['file']['error']) {
    header("HTTP/1.1 403 Error");
    if($err == UPLOAD_ERR_INI_SIZE) {
      print "Error UPLOAD_ERR_INI_SIZE";
    } else {
      print "Unknwon error $err processing file";
    }
    exit;
  }
  chmod($tmp,0777);
  $uid = intval(1000*microtime(true));
  $uid = substr(sha1(rand()),0,8);
  $outfn = preg_replace('/[^\w\d\._-]/','',basename($_GET['ref'])) . ".$uid." . basename($_FILES['file']['name']);
  rename($tmp,__DIR__ .'/output/' . $outfn);
  print "saved $tmp at " . basename($_FILES['file']['name']) . "\n";
  print 'OK';
 } else {
  print '<form method="POST">Done:<input type="text" name="done-json"></form>';
 }

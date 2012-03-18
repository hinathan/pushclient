<?php

require_once 'AWSSDKforPHP/sdk.class.php';

function s3obj() {
  $credentials = json_decode(file_get_contents(__DIR__ . '/../conf/aws.json'),true);
  $s3 = new AmazonS3(array('key'=>$credentials['access_key_id'],'secret'=>$credentials['secret_access_key']));
  return $s3;
}
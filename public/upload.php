<?php

// for raw upload POST from drag-drop upload, not the _FILES method

$fn = $_SERVER['HTTP_X_FILE_NAME'];
$sz = $_SERVER['HTTP_X_FILE_SIZE'];
$tmpfile = tempnam('/tmp/','uploadraw');
$wfh = fopen($tmpfile,'w');
$rfh = fopen('php://input','r');
while(fwrite($wfh,fread($rfh,8096))) {
	//copy
}
fclose($wfh);
fclose($rfh);

$sha = substr(trim(`sha1sum $tmpfile`),0,6);
$id = $sha . "-" . date('YmdHis');

$tag = sha1(time());
if(preg_match('/\.pdf$/',$fn)) {
	$activity = 'pdftoocrpdf';
	$type = "application/pdf";
} else if(preg_match('/\.key$/',$fn)) {
	$activity = 'keynotetopdf';
	$type = "application/octet-stream";
} else if(preg_match('/\.pages$/',$fn)) {
	$activity = 'pagestopdf';
	$type = "application/octet-stream";
} else {
	unlink($tmpfile);
	throw new Exception("Unknown file type");
}

$outfile = __DIR__ . '/input/' . $id . '-' . basename($fn);
rename($tmpfile,$outfile);
$info = array('saved'=>basename($outfile),'type'=>$type,'size'=>$sz);
print json_encode($info);
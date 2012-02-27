<?php

$outdir = __DIR__ . '/output/';
if(isset($_FILES['file'])) {
	$f = $_FILES['file'];
	if(preg_match('/^\/output\//',$_SERVER['REQUEST_URI'])) {
		$dest = $outdir . basename($_SERVER['REQUEST_URI']);
	} else {
		$dest = $outdir . basename($f['name']);
	}
	$rv = move_uploaded_file($f['tmp_name'],$dest);
	print "OK $rv";
} else {
	$bn = basename($_GET['arg']);
	if(file_exists($outdir . $bn)) {
		header("Content-Type: " . mime_content_type($outdir.$bn));
		$fh = fopen($outdir . $bn, 'r');
		fpassthru($fh);
	} else {
		header("HTTP/1.1 404 Not Found");
	}
}
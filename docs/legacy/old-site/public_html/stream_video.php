<?php
// === Secure File Name Input ===
$filename = isset($_GET['file']) ? basename($_GET['file']) : '';

if (empty($filename)) {
    http_response_code(400); // Bad request
    exit('No file specified.');
}

// === DEMO VIDEO OR GOOGLE DRIVE HANDLING ===
$googleDriveFiles = [
    'demo-video.mp4' => '1KJvGwKXvJXYZEXAMPLEID', // Replace with actual Google Drive File ID
    'another-video.mp4' => '1Ax7N8P2XYZABCEXAMPLEID',
];

if (isset($googleDriveFiles[$filename])) {
    $fileId = $googleDriveFiles[$filename];
    // Redirect to Google Drive preview URL
    header("Location: https://drive.google.com/uc?export=preview&id=$fileId");
    exit;
}

// === Path to your video directory ===
$videoDir = 'assets/videos/';
$filePath = $videoDir . $filename;

// === Validate file existence ===
if (!file_exists($filePath)) {
    http_response_code(404); // Not found
    exit('Video file not found.');
}

// === File Info ===
$mime = "video/mp4";
$size = filesize($filePath);
$begin = 0;
$end = $size - 1;

// === Check for Range Header (for seek support) ===
if (isset($_SERVER['HTTP_RANGE']) && preg_match('/bytes=\h*(\d+)-(\d*)[\D.*]?/i', $_SERVER['HTTP_RANGE'], $matches)) {
    $begin = intval($matches[1]);
    if (!empty($matches[2])) {
        $end = intval($matches[2]);
    }
}

$length = $end - $begin + 1;

// === Send Headers ===
header("Content-Type: $mime");
header("Accept-Ranges: bytes");
header("Content-Range: bytes $begin-$end/$size");
header("Content-Length: $length");
header("Content-Disposition: inline; filename=\"" . $filename . "\"");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("Expires: 0");

// === Stream the video ===
$fp = fopen($filePath, 'rb');
if (!$fp) {
    http_response_code(500); // Internal Server Error
    exit('Failed to open file.');
}

fseek($fp, $begin);
$bufferSize = 1024 * 8;

while (!feof($fp) && ftell($fp) <= $end) {
    echo fread($fp, $bufferSize);
    flush();
}
fclose($fp);
exit;

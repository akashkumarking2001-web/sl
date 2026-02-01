<?php
// Get the relative file path from URL
$file = $_GET['file'] ?? '';

if (!$file) {
    http_response_code(400);
    echo "No file specified.";
    exit;
}

$targetFile = substr($file, 3);

// Security check: make sure it's inside the intended folder
if ($targetFile === false  || !file_exists($targetFile)) {
    http_response_code(404);
    echo "$file not found or access denied.";
    exit;
}

// Set headers to force download
header('Content-Description: File Transfer');
header('Content-Type: application/octet-stream');
header('Content-Disposition: attachment; filename="' . basename($targetFile) . '"');
header('Expires: 0');
header('Cache-Control: must-revalidate');
header('Pragma: public');
header('Content-Length: ' . filesize($targetFile));
readfile($targetFile);
exit;

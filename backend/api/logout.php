<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();
session_start();

// Destroy server session
session_unset();
session_destroy();

successResponse(null, 'Logged out');
?>

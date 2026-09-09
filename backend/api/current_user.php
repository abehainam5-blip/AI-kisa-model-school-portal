<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();
session_start();

$user = getCurrentUser();
if (!$user) {
    errorResponse('Not authenticated', 401);
}

successResponse(['user' => $user]);
?>

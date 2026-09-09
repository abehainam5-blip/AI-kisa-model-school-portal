<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

// Example admin-only endpoint
requireRole('super_admin');

successResponse(['message' => 'This is a protected Super Admin API.']);

?>

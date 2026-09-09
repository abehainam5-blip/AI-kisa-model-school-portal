<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();
session_start();

$body = getRequestBody();
$email = trim($body['email'] ?? '');
$password = $body['password'] ?? '';

if (!$email || !$password) {
    errorResponse('Email and password are required', 422);
}

$user = authenticateUser($email, $password);
if (!$user) {
    errorResponse('Invalid credentials', 401);
}

// Generate a simple token and return user data
$token = generateToken($user['id']);
// Save session server-side for convenience
$_SESSION['user_id'] = $user['id'];
$_SESSION['role'] = $user['role'];

successResponse(['token' => $token, 'user' => $user], 'Authenticated');
?>

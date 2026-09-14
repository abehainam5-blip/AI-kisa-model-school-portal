<?php
declare(strict_types=1);
require_once __DIR__ . '/../config.php';

setCorsHeaders();
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    errorResponse('Method not allowed.', 405);
}

$body = getRequestBody();
$email = strtolower(trim((string) ($body['email'] ?? '')));
$password = (string) ($body['password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
    errorResponse('Email and password are required.', 422);
}

try {
    $statement = getDBConnection()->prepare(
        'SELECT id, name, email, password, role, created_at FROM users WHERE LOWER(email) = LOWER(:email) LIMIT 1'
    );
    $statement->execute(['email' => $email]);
    $user = $statement->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        errorResponse('Invalid email or password.', 401);
    }

    unset($user['password']);
    successResponse([
        'token' => generateToken($user),
        'user' => $user,
    ], 'Login successful.');
} catch (Throwable $error) {
    errorResponse('Unable to complete login.', 500);
}

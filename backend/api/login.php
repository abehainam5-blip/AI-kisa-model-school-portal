<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';

// CORS: allow the Vite dev server (localhost:3001) and other configured origins.
setCorsHeaders();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    errorResponse('Method not allowed.', 405);
}

$body = getRequestBody();
$rawEmail = strtolower(trim((string) ($body['email'] ?? '')));
$rawPassword = (string) ($body['password'] ?? '');

if (!filter_var($rawEmail, FILTER_VALIDATE_EMAIL) || $rawPassword === '') {
    errorResponse('Email and password are required.', 422);
}

// LOCKDOWN ENFORCEMENT: reject any email that is not the active testing account.
if (LOCKDOWN_MODE && $rawEmail !== LOCKDOWN_EMAIL) {
    errorResponse('Account access is temporarily restricted during isolated testing.', 403);
}

try {
    $pdo = getDBConnection();

    // Fetch user by normalized email.
    $stmt = $pdo->prepare(
        'SELECT id, name, email, password, role, created_at
         FROM users
         WHERE LOWER(email) = LOWER(:email)
         LIMIT 1'
    );
    $stmt->execute(['email' => $rawEmail]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($rawPassword, $user['password'])) {
        errorResponse('Invalid email or password.', 401);
    }

    unset($user['password']);

    $token = generateToken($user);

    successResponse([
        'token' => $token,
        'user' => [
            'id' => (int) $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'role' => $user['role'],
            'created_at' => $user['created_at'],
        ],
    ], 'Login successful.');
} catch (Throwable $error) {
    errorResponse('Unable to complete login. Start the PHP/PostgreSQL backend and try again.', 503);
}
<?php
require_once __DIR__ . '/../config.php';
setCorsHeaders();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    errorResponse('Method not allowed', 405);
}

$admin = requireRole(['admin']);
$body = getRequestBody();
$name = trim($body['name'] ?? '');
$email = strtolower(trim($body['email'] ?? ''));
$password = $body['password'] ?? '';

if ($name === '' || $email === '' || $password === '') {
    errorResponse('Name, email, and password are required.', 422);
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    errorResponse('Please provide a valid email address.', 422);
}
if (strlen($password) < PASSWORD_MIN_LENGTH) {
    errorResponse('Password must be at least ' . PASSWORD_MIN_LENGTH . ' characters.', 422);
}

try {
    $pdo = getDBConnection();
    $check = $pdo->prepare('SELECT id FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1');
    $check->execute([$email]);
    if ($check->fetch()) {
        errorResponse('A user with this email already exists.', 409);
    }

    $insert = $pdo->prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?) RETURNING id, name, email, role, created_at');
    $insert->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT), 'teacher']);
    $teacher = $insert->fetch();

    successResponse(['user' => $teacher, 'createdBy' => $admin['email']], 'Teacher account created');
} catch (PDOException $error) {
    if ($error->getCode() === '23505') {
        errorResponse('A user with this email already exists.', 409);
    }
    errorResponse('Unable to create the teacher account.', 500);
}
?>
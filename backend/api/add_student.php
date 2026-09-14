<?php
declare(strict_types=1);
require_once __DIR__ . '/../config.php';

setCorsHeaders();
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    errorResponse('Method not allowed.', 405);
}

requireRole(['admin', 'teacher']);
$body = getRequestBody();
$name = trim((string) ($body['name'] ?? ''));
$email = strtolower(trim((string) ($body['email'] ?? '')));
$password = (string) ($body['password'] ?? '');
$classNumber = (int) ($body['class'] ?? 0);
$gender = trim((string) ($body['gender'] ?? 'Not Specified'));
$attendance = (int) ($body['attendance'] ?? 85);
$performance = (int) ($body['performance'] ?? 75);

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < PASSWORD_MIN_LENGTH) {
    errorResponse('Name, valid email, and a password of at least ' . PASSWORD_MIN_LENGTH . ' characters are required.', 422);
}
if ($classNumber < 1 || $classNumber > 10 || $attendance < 0 || $attendance > 100 || $performance < 0 || $performance > 100) {
    errorResponse('Class, attendance, and performance values are invalid.', 422);
}

try {
    $pdo = getDBConnection();
    $check = $pdo->prepare('SELECT id FROM students WHERE LOWER(email) = LOWER(?) LIMIT 1');
    $check->execute([$email]);
    if ($check->fetch()) errorResponse('A student with this email already exists.', 409);

    $insert = $pdo->prepare(
        'INSERT INTO students (name, email, password, class_number, gender, attendance, performance)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         RETURNING id, name, email, class_number, gender, attendance, performance, created_at'
    );
    $insert->execute([
        $name,
        $email,
        password_hash($password, PASSWORD_DEFAULT),
        $classNumber,
        $gender ?: 'Not Specified',
        $attendance,
        $performance,
    ]);
    successResponse(['student' => $insert->fetch()], 'Student created.');
} catch (PDOException $error) {
    if ($error->getCode() === '23505') errorResponse('A student with this email already exists.', 409);
    errorResponse('Unable to create the student.', 500);
}

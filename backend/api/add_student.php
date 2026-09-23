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
$socialMedia = trim((string) ($body['social_media'] ?? ''));
$studentId = trim((string) ($body['student_id'] ?? ''));

if ($name === '') {
    errorResponse('Name is required.', 422);
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    errorResponse('Please provide a valid email address if provided.', 422);
}
if ($classNumber < 1 || $classNumber > 10 || $attendance < 0 || $attendance > 100 || $performance < 0 || $performance > 100) {
    errorResponse('Class, attendance, and performance values are invalid.', 422);
}
// Social media is now optional - no validation required

try {
    $pdo = getDBConnection();
    // Only check email uniqueness if email is provided
    if ($email !== '') {
        $check = $pdo->prepare('SELECT id FROM students WHERE LOWER(email) = LOWER(?) LIMIT 1');
        $check->execute([$email]);
        if ($check->fetch()) errorResponse('A student with this email already exists.', 409);
    }

    if ($studentId === '') {
        $year = (int) date('Y');
        $seqStmt = $pdo->prepare('SELECT COUNT(*) FROM students WHERE class_number = :cls');
        $seqStmt->execute(['cls' => $classNumber]);
        $seq = (int) $seqStmt->fetchColumn() + 1;
        $studentId = sprintf('KISA-%d-%d-%03d', $year, $classNumber, $seq);
    }

    $insert = $pdo->prepare(
        'INSERT INTO students (name, email, class_number, gender, attendance, performance, social_media, student_id)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         RETURNING id, name, email, class_number, gender, attendance, performance, social_media, student_id, created_at'
    );
    $insert->execute([
        $name,
        $email,
        $classNumber,
        $gender ?: 'Not Specified',
        $attendance,
        $performance,
        $socialMedia,
        $studentId,
    ]);
    successResponse(['student' => $insert->fetch()], 'Student created.');
} catch (PDOException $error) {
    if ($error->getCode() === '23505') errorResponse('A student with this email already exists.', 409);
    errorResponse('Unable to create the student.', 500);
}

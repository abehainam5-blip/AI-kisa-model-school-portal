<?php
declare(strict_types=1);

require_once __DIR__ . '/../config.php';

setCorsHeaders();
$user = requireRole(['admin', 'teacher']);
$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

function validDate(string $value): string
{
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value);
    if (!$date || $date->format('Y-m-d') !== $value) {
        errorResponse('A valid date is required.', 422);
    }
    return $value;
}

try {
    if ($method === 'GET') {
        $from = validDate((string) ($_GET['from'] ?? (new DateTimeImmutable('-6 days'))->format('Y-m-d')));
        $to = validDate((string) ($_GET['to'] ?? (new DateTimeImmutable())->format('Y-m-d')));
        $tasks = $pdo->prepare(
            'SELECT id, student_id, task, status, task_date, created_at
             FROM task_records WHERE task_date BETWEEN :from AND :to ORDER BY task_date DESC, id DESC'
        );
        $tasks->execute(['from' => $from, 'to' => $to]);
        $attendance = $pdo->prepare(
            'SELECT student_id, attendance_date, present
             FROM attendance_records WHERE attendance_date BETWEEN :from AND :to ORDER BY attendance_date DESC'
        );
        $attendance->execute(['from' => $from, 'to' => $to]);
        successResponse(['tasks' => $tasks->fetchAll(), 'attendance' => $attendance->fetchAll()]);
    }

    if ($method !== 'POST') {
        errorResponse('Method not allowed.', 405);
    }

    $body = getRequestBody();
    $studentId = (int) ($body['student_id'] ?? 0);
    $date = validDate((string) ($body['date'] ?? (new DateTimeImmutable())->format('Y-m-d')));
    if ($studentId < 1) errorResponse('A valid student is required.', 422);

    if (($body['type'] ?? '') === 'attendance') {
        $statement = $pdo->prepare(
            'INSERT INTO attendance_records (student_id, teacher_id, attendance_date, present)
             VALUES (:student_id, :teacher_id, :attendance_date, :present)
             ON CONFLICT (student_id, attendance_date) DO UPDATE SET present = EXCLUDED.present'
        );
        $statement->execute([
            'student_id' => $studentId,
            'teacher_id' => (int) $user['id'],
            'attendance_date' => $date,
            'present' => !empty($body['present']) ? 'true' : 'false',
        ]);
        successResponse([], 'Attendance saved.');
    }

    $task = trim((string) ($body['task'] ?? ''));
    $status = (string) ($body['status'] ?? 'not_done');
    if ($task === '' || !in_array($status, ['done', 'not_done'], true)) {
        errorResponse('Task and valid status are required.', 422);
    }
    $statement = $pdo->prepare(
        'INSERT INTO task_records (student_id, teacher_id, task, status, task_date)
         VALUES (:student_id, :teacher_id, :task, :status, :task_date)'
    );
    $statement->execute([
        'student_id' => $studentId,
        'teacher_id' => (int) $user['id'],
        'task' => $task,
        'status' => $status,
        'task_date' => $date,
    ]);
    successResponse(['id' => (int) $pdo->lastInsertId()], 'Task saved.');
} catch (Throwable $error) {
    errorResponse('Unable to save progress data.', 500);
}
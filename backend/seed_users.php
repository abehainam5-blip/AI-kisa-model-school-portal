<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This script must be run from the command line.\n");
    exit(1);
}

require_once __DIR__ . '/config.php';

/**
 * LOCKDOWN TESTING CONFIGURATION
 * ---------------------------------------------------------------
 * Only ONE account is active during isolated testing:
 *   Email:    rizvitabssum123@gmail.com
 *   Password: kisaschool123!
 * ---------------------------------------------------------------
 * To restore full multi-account access later, flip
 * LOCKDOWN_MODE to false and restore the full $masterUsers list.
 */
const LOCKDOWN_MODE = true;
const LOCKDOWN_EMAIL = 'rizvitabssum123@gmail.com';
const LOCKDOWN_PASSWORD = 'kisaschool123!';
const LOCKDOWN_NAME = 'Rizvi Tabssum';
const LOCKDOWN_ROLE = 'teacher';

// Full account list preserved for future restoration.
const FULL_MASTER_USERS = [
    ['name' => 'S. Wasif', 'email' => 's.wasif404@gmail.com', 'role' => 'admin'],
    ['name' => 'Kisa Model School', 'email' => 'kisamodel.school@gmail.com', 'role' => 'admin'],
    ['name' => 'Mehdi Yawer', 'email' => 'mehdi_yawer@yahoo.com', 'role' => 'admin'],
    ['name' => 'Fatima', 'email' => 'itsfatima25@gmail.com', 'role' => 'teacher'],
    ['name' => 'Ashba Fatima', 'email' => 'ashbafatima017@gmail.com', 'role' => 'teacher'],
    ['name' => 'Batool Sakina', 'email' => 'batoolsakina7607@gmail.com', 'role' => 'teacher'],
    ['name' => 'Rizvi Tabssum', 'email' => 'rizvitabssum123@gmail.com', 'role' => 'teacher'],
    ['name' => 'Ghazia', 'email' => 'ghaziaznb@gmail.com', 'role' => 'teacher'],
    ['name' => 'Nauzhat Fatima', 'email' => 'nauzhatfatima017@gmail.com', 'role' => 'teacher'],
];

function generateUniquePassword(int $length = 10): string
{
    $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    $password = '';
    $max = strlen($alphabet) - 1;
    for ($i = 0; $i < $length; $i++) {
        $password .= $alphabet[random_int(0, $max)];
    }
    return $password;
}

function printCredentialsTable(array $credentials): void
{
    $emailWidth = 36;
    $passwordWidth = 24;

    echo "\nAI KISA Model School - Generated Credentials\n";
    echo str_repeat('=', 64) . "\n";
    printf("%-{$emailWidth}s | %-{$passwordWidth}s\n", 'Email', 'Auto-Generated Password');
    echo str_repeat('-', 64) . "\n";

    foreach ($credentials as $credential) {
        printf("%-{$emailWidth}s | %-{$passwordWidth}s\n", $credential['email'], $credential['password']);
    }

    echo str_repeat('=', 64) . "\n";
    echo "Copy and share these credentials safely with each user.\n";
}

try {
    $pdo = getDBConnection();
    $pdo->beginTransaction();

    // COMPLETE DATA PURGE: Remove all dummy/test records across every table.
    $pdo->exec('TRUNCATE TABLE task_records RESTART IDENTITY CASCADE');
    $pdo->exec('TRUNCATE TABLE attendance_records RESTART IDENTITY CASCADE');
    $pdo->exec('TRUNCATE TABLE students RESTART IDENTITY CASCADE');
    $pdo->exec('TRUNCATE TABLE users RESTART IDENTITY');

    $activeUsers = LOCKDOWN_MODE
        ? [['name' => LOCKDOWN_NAME, 'email' => LOCKDOWN_EMAIL, 'role' => LOCKDOWN_ROLE]]
        : FULL_MASTER_USERS;

    $insert = $pdo->prepare(
        'INSERT INTO users (name, email, password, role)
         VALUES (:name, :email, :password, :role)'
    );

    $credentials = [];
    foreach ($activeUsers as $user) {
        $plainPassword = LOCKDOWN_MODE ? LOCKDOWN_PASSWORD : generateUniquePassword(10);

        $insert->execute([
            'name' => $user['name'],
            'email' => strtolower($user['email']),
            'password' => password_hash($plainPassword, PASSWORD_DEFAULT),
            'role' => $user['role'],
        ]);

        $credentials[] = [
            'role' => $user['role'],
            'email' => strtolower($user['email']),
            'password' => $plainPassword,
        ];
    }

    $pdo->commit();

    if (LOCKDOWN_MODE) {
        echo "\n*** LOCKDOWN MODE ACTIVE ***\n";
        echo "Only ONE account is seeded for isolated testing:\n";
    }
    printCredentialsTable($credentials);

    if (LOCKDOWN_MODE) {
        echo str_repeat('=', 64) . "\n";
        echo "All dummy students, tasks, and attendance records have been purged.\n";
        echo "Set LOCKDOWN_MODE = false in seed_users.php to restore all accounts.\n";
    }
} catch (Throwable $error) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    fwrite(STDERR, "Seeding failed: {$error->getMessage()}\n");
    exit(1);
}
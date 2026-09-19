<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This script must be run from the command line.\n");
    exit(1);
}

require_once __DIR__ . '/config.php';

$masterUsers = [
    ['name' => 'S. Wasif', 'email' => 's.wasif404@gmail.com', 'role' => 'admin'],
    ['name' => 'Kisa Model School', 'email' => 'kisamodel.school@gmail.com', 'role' => 'admin'],
    ['name' => 'Fatima', 'email' => 'itsfatima25@gmail.com', 'role' => 'teacher'],
    ['name' => 'Ashba Fatima', 'email' => 'ashbafatima017@gmail.com', 'role' => 'teacher'],
    ['name' => 'Batool Sakina', 'email' => 'batoolsakina7607@gmail.com', 'role' => 'teacher'],
    ['name' => 'Rizvi Tabssum', 'email' => 'rizvitabssum123@gmail.com', 'role' => 'teacher'],
    ['name' => 'Ghazia', 'email' => 'ghaziaznb@gmail.com', 'role' => 'teacher'],
    ['name' => 'Nauzhat Fatima', 'email' => 'nauzhatfatima017@gmail.com', 'role' => 'teacher'],
];

function generatePassword(int $length = 10): string
{
    $alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    $password = '';
    $max = strlen($alphabet) - 1;

    for ($index = 0; $index < $length; $index++) {
        $password .= $alphabet[random_int(0, $max)];
    }

    return $password;
}

try {
    $pdo = getDBConnection();
    $pdo->beginTransaction();

    // The allowlist is enforced by migration 003; this truncate removes all
    // previous accounts and makes every run produce a fresh credential set.
    $pdo->exec('TRUNCATE TABLE users RESTART IDENTITY');
    $insert = $pdo->prepare(
        'INSERT INTO users (name, email, password, role)
         VALUES (:name, :email, :password, :role)'
    );

    $credentials = [];
    foreach ($masterUsers as $user) {
        $plainPassword = generatePassword(10);
        $insert->execute([
            'name' => $user['name'],
            'email' => $user['email'],
            'password' => password_hash($plainPassword, PASSWORD_DEFAULT),
            'role' => $user['role'],
        ]);
        $credentials[] = [
            'role' => $user['role'],
            'email' => $user['email'],
            'password' => $plainPassword,
        ];
    }

    $pdo->commit();

    echo "\nAI KISA Model School - Master User Credentials\n";
    echo "===============================================================\n";
    printf("%-10s | %-34s | %s\n", 'Role', 'Email', 'Auto-Generated Password');
    echo "---------------------------------------------------------------\n";
    foreach ($credentials as $credential) {
        printf("%-10s | %-34s | %s\n", $credential['role'], $credential['email'], $credential['password']);
    }
    echo "===============================================================\n";
    echo "Store this output securely. Re-running the script replaces every password.\n";
} catch (Throwable $error) {
    if (isset($pdo) && $pdo instanceof PDO && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    fwrite(STDERR, "Seeding failed: {$error->getMessage()}\n");
    exit(1);
}

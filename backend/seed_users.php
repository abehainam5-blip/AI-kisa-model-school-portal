<?php
require_once __DIR__ . '/config.php';

// Run from CLI: php seed_users.php
$pdo = getDBConnection();

function insertIfMissing($pdo, $name, $email, $plainPassword, $role='teacher'){
    $stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        echo "User {$email} already exists\n";
        return;
    }
    $hash = password_hash($plainPassword, PASSWORD_DEFAULT);
    $ins = $pdo->prepare('INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)');
    $ins->execute([$name,$email,$hash,$role]);
    echo "Inserted {$email} ({$role})\n";
}

echo "Seeding users...\n";
insertIfMissing($pdo, 'AI Kisa Admin', 'admin@aikisa.edu.pk', 'AdminPass123!', 'super_admin');
insertIfMissing($pdo, 'Areeba Nadeem', 'areeba.nadeem@aikisa.edu.pk', 'TeacherPass123!', 'teacher');

echo "Done. Super Admin: admin@aikisa.edu.pk / AdminPass123!\n";
echo "Teacher: areeba.nadeem@aikisa.edu.pk / TeacherPass123!\n";

?>

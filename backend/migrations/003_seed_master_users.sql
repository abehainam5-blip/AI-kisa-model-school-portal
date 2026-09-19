BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS task_records (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    teacher_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('done', 'not_done')),
    task_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS task_records_student_date_idx
    ON task_records (student_id, task_date);

CREATE TABLE IF NOT EXISTS attendance_records (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    teacher_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    present BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT attendance_records_unique_day UNIQUE (student_id, attendance_date)
);

-- Remove every previous local/testing account before installing the allowlist.
DELETE FROM users;

ALTER TABLE users
    DROP CONSTRAINT IF EXISTS users_master_email_check;

ALTER TABLE users
    ADD CONSTRAINT users_master_email_check CHECK (
        LOWER(email) IN (
            's.wasif404@gmail.com',
            'kisamodel.school@gmail.com',
            'itsfatima25@gmail.com',
            'ashbafatima017@gmail.com',
            'batoolsakina7607@gmail.com',
            'rizvitabssum123@gmail.com',
            'ghaziaznb@gmail.com',
            'nauzhatfatima017@gmail.com'
        )
    );

-- Bootstrap rows use unique, cryptographically random hashes. Run
-- backend/seed_users.php immediately after this migration to replace them
-- with PHP password_hash() values and print the one-time credentials.
INSERT INTO users (name, email, password, role)
VALUES
    ('S. Wasif', 'S.wasif404@gmail.com', crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')), 'admin'),
    ('Kisa Model School', 'kisamodel.school@gmail.com', crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')), 'admin'),
    ('Fatima', 'itsfatima25@gmail.com', crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')), 'teacher'),
    ('Ashba Fatima', 'ashbafatima017@gmail.com', crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')), 'teacher'),
    ('Batool Sakina', 'batoolsakina7607@gmail.com', crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')), 'teacher'),
    ('Rizvi Tabssum', 'rizvitabssum123@gmail.com', crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')), 'teacher'),
    ('Ghazia', 'ghaziaznb@gmail.com', crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')), 'teacher'),
    ('Nauzhat Fatima', 'nauzhatfatima017@gmail.com', crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')), 'teacher');

COMMIT;

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

-- LOCKDOWN MODE (isolated testing):
-- Only ONE account is permitted during testing. To restore the full
-- multi-admin/multi-teacher allowlist, edit the CHECK constraint below
-- and re-run backend/seed_users.php with LOCKDOWN_MODE = false.
DELETE FROM users;

ALTER TABLE users
    DROP CONSTRAINT IF EXISTS users_master_email_check;

ALTER TABLE users
    ADD CONSTRAINT users_master_email_check CHECK (
        LOWER(email) = 'rizvitabssum123@gmail.com'
    );

-- Bootstrap row uses a random hash; run backend/seed_users.php immediately
-- after this migration to replace it with the lockdown password hash.
INSERT INTO users (name, email, password, role)
VALUES
    ('Rizvi Tabssum', 'rizvitabssum123@gmail.com', crypt(encode(gen_random_bytes(32), 'hex'), gen_salt('bf')), 'teacher');

COMMIT;
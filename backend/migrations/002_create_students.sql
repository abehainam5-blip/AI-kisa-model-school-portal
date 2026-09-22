BEGIN;

CREATE TABLE IF NOT EXISTS students (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    class_number SMALLINT NOT NULL CHECK (class_number BETWEEN 1 AND 10),
    gender VARCHAR(30) NOT NULL DEFAULT 'Not Specified',
    attendance SMALLINT NOT NULL DEFAULT 85 CHECK (attendance BETWEEN 0 AND 100),
    performance SMALLINT NOT NULL DEFAULT 75 CHECK (performance BETWEEN 0 AND 100),
    social_media VARCHAR(500),
    student_id VARCHAR(40) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT students_email_unique UNIQUE (email)
);

CREATE UNIQUE INDEX IF NOT EXISTS students_email_lower_unique
    ON students (LOWER(email));
CREATE UNIQUE INDEX IF NOT EXISTS students_student_id_unique
    ON students (LOWER(student_id));

COMMIT;
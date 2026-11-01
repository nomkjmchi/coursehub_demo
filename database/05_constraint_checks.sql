
-- Run after 01_schema.sql and 02_seed.sql.
-- Each block catches its expected constraint error so the full script can run.

-- Duplicate enrollment: primary key violation.
DO $$
BEGIN
    INSERT INTO enrollments (student_id, class_section_id)
    VALUES ('22000001', 'WEB-01');

    RAISE EXCEPTION 'Expected duplicate enrollment to be rejected';
EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'PASS: duplicate enrollment rejected';
END;
$$;

-- Nonexistent student: foreign key violation.
DO $$
BEGIN
    INSERT INTO enrollments (student_id, class_section_id)
    VALUES ('22999999', 'WEB-01');

    RAISE EXCEPTION 'Expected missing student to be rejected';
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'PASS: missing student rejected';
END;
$$;

-- Zero capacity: CHECK violation.
DO $$
BEGIN
    UPDATE class_sections
    SET capacity = 0
    WHERE id = 'WEB-01';

    RAISE EXCEPTION 'Expected zero capacity to be rejected';
EXCEPTION
    WHEN check_violation THEN
        RAISE NOTICE 'PASS: zero capacity rejected';
END;
$$;

-- NULL course credits: NOT NULL violation.
DO $$
BEGIN
    UPDATE courses
    SET credits = NULL
    WHERE code = 'INT2204';

    RAISE EXCEPTION 'Expected NULL credits to be rejected';
EXCEPTION
    WHEN not_null_violation THEN
        RAISE NOTICE 'PASS: NULL credits rejected';
END;
$$;

-- Duplicate email: UNIQUE violation.
DO $$
BEGIN
    UPDATE students
    SET email = 'anh@example.com'
    WHERE id = '22000002';

    RAISE EXCEPTION 'Expected duplicate email to be rejected';
EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'PASS: duplicate email rejected';
END;
$$;

-- NULL student name: NOT NULL violation.
DO $$
BEGIN
    UPDATE students
    SET name = NULL
    WHERE id = '22000004';

    RAISE EXCEPTION 'Expected NULL student name to be rejected';
EXCEPTION
    WHEN not_null_violation THEN
        RAISE NOTICE 'PASS: NULL student name rejected';
END;
$$;

-- All rejected operations leave the seed data unchanged.
SELECT COUNT(*) AS total_enrollments
FROM enrollments;

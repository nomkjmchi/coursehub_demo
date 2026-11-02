BEGIN;
SELECT id, capacity FROM class_sections
WHERE id = 'RACE-01' FOR UPDATE;
SELECT pg_sleep(8);
COMMIT;

-- Run in a second tab while the first transaction is sleeping.
BEGIN;
SELECT id, capacity FROM class_sections
WHERE id = 'RACE-01' FOR UPDATE;
ROLLBACK;

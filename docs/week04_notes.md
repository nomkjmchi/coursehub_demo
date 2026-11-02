# CourseHub - Buoi 4

## Muc tieu

- Them migration `001` va bang `enrollment_events`.
- Ghi `CREATED` va `CANCELLED` cung transaction voi dang ky.
- Khoa dong `class_sections` bang `FOR UPDATE`.
- Kiem thu hai request dong thoi tren `RACE-01`.
- So sanh EXPLAIN truoc va sau composite index.

## Kiem thu

Chay migration, `database/08_week04_demo_setup.sql`, khoi dong API, sau do:

```powershell
python backend/tests/week04_concurrency_test.py
```

Ket qua mong doi: mot HTTP 201, mot HTTP 409, `enrolled = 1`,
`remaining = 0`. Chay `database/11_generate_performance_events.sql` va
tung cau EXPLAIN trong `database/12_explain_and_index.sql` de ghi lai ket
qua thuc te tren PostgreSQL.

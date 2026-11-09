# CourseHub - Buoi 5

## Muc tieu

- Bo sung cau hinh CORS cho FastAPI backend de cho phep origin `http://localhost:5173` va `http://127.0.0.1:5173`.
- Xay dung frontend React bang Vite voi kien truc component: `App`, `Notice`, `SectionTable`, `EnrollmentList`.
- Ket noi cac API GET `/courses`, GET `/sections`, GET `/students/{student_id}/enrollments`.
- Thuc hien dang ky POST `/enrollments` va huy dang ky DELETE `/enrollments/{student_id}/{class_section_id}`.
- Xu ly day du cac trang thai loading, empty, success, va loi HTTP (404, 409, 422, CORS).
- Xac nhan luong Frontend -> FastAPI -> PostgreSQL va kiem tra giao diện responsive tai 390px.

## Kiem thu va chay ung dung

### 1. Khoi dong Backend
```powershell
.venv\Scripts\Activate.ps1
python -m uvicorn backend.app.main:app --reload
```

### 2. Khoi dong Frontend
```powershell
cd frontend
npm install
npm run dev
```

Truy cap `http://127.0.0.1:5173/` tren trinh duyet.

### 3. Kiem thu don vi Frontend API
```powershell
cd frontend
npm test
npm run build
```

### 4. Doi chieu PostgreSQL
Chay cac truy van trong `database/13_week05_verify.sql` sau khi thao tac dang ky va huy dang ky qua giao dien React de xac nhan du lieu trong bang `enrollments` va `enrollment_events`.

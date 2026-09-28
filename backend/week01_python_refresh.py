
import keyword


students = [
    {"id": "22000001", "name": "Nguyen Minh Anh", "major": "KHDL"},
    {"id": "22000002", "name": "Tran Duc Long", "major": "KHDL"},
]
courses = [
    {
        "code": "INT2204",
        "name": "Co so du lieu Web va he thong thong tin",
        "capacity": 3,
        "enrolled": 2,
    },
    {
        "code": "INT2205",
        "name": "Khai pha du lieu",
        "capacity": 2,
        "enrolled": 2,
    },
]
enrollments = [
    {"student_id": "22000001", "course_code": "INT2204"}
]
#duyệt danh sách lớp học và in ra số lượng chỗ còn trống
for course in courses:
    remaining = course["capacity"] - course["enrolled"]
    print(course["code"], "- con", remaining, "cho")

#tìm lớp học theo mã lớp học
def find_course(course_code):
    for course in courses:
        if course["code"] == course_code:
            return course
        return None

print(find_course("INT2204"))

#mô phỏng quy tắc đăng ký lớp học
def can_enroll(student_id, course_code):
    course = find_course(course_code)
    if course is None:
        return False, "Lớp học không tồn tại"
        
    if course["enrolled"] >= course["capacity"]:
        return False, "Lớp học đã đầy"

    duplicate_enrollment = any(
        item["student_id"] == student_id and item["course_code"] == course_code
        for item in enrollments
    )
    if duplicate_enrollment:
        return False, "Sinh viên đã đăng ký lớp học này"    
    return True, "Sinh viên có thể đăng ký lớp học này"
print(can_enroll("22000001", "INT2204"))
#xử lý dữ liệu nhập sai
try:
    limit = int(input("Nhap so luong hoc phan muon hien thi: "))
    print(courses[:limit])
except ValueError:
    print("So luong phai la so nguyen")

#tìm lớp học theo từ khóa
def search_courses(keyword):
    normalized = keyword.strip().lower()
    results = []
    for course in courses:
        code = course["code"].lower()
        name = course["name"].lower()
        if normalized in code or normalized in name:
            results.append(course)
    return results

print(search_courses("web"))

print("abc")
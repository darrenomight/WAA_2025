"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StudentForm from "../../../../../components/StudentForm";
import { getStudent, updateStudent } from "../../../../../services/studentAPI";
import { StudentCreate } from "../../../../../types/student";

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = Array.isArray(params.id) ? params.id[0] : params.id;

  const [student, setStudent] = useState<StudentCreate | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch student data when the component mounts
  useEffect(() => {
    if (studentId) {
      getStudent(studentId)
        .then((data) => {
          setStudent({
            firstName: data.firstName,
            lastName: data.lastName,
            studentNumber: data.studentNumber,
            email: data.email,
            course: data.course,
          });
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [studentId]);

  // Handle update submission
  const handleUpdate = async (data: StudentCreate) => {
    if (!studentId) return;
    await updateStudent(studentId, data);
    router.push("/students");
  };

  // UI states
  if (!studentId) return <div>Invalid student ID.</div>;
  if (loading) return <div>Loading...</div>;
  if (!student) return <div>Student not found.</div>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8 text-blue-700">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Edit Student</h1>
        <StudentForm initialData={student} onSubmit={handleUpdate} />
      </div>
    </main>
  );
}

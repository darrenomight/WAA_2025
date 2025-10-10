"use client";

import { useRouter } from "next/navigation";
import StudentForm from "../../../../components/StudentForm"
import { createStudent } from "../../../../services/studentAPI";
import { StudentCreate } from "../../../../types/student";

export default function NewStudentPage() {
  const router = useRouter();

  const handleCreate = async (data: StudentCreate) => {
    await createStudent(data);
    router.push("/students");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 flex items-center justify-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8 text-blue-700">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Add Student</h1>
        <StudentForm onSubmit={handleCreate} />
      </div>
    </main>
  );
}

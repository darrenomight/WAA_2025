"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getStudent } from "../../../../services/studentAPI"
import { Student } from "../../../../types/student";
import Link from "next/link";

export default function ViewStudentPage() {
    const params = useParams();
    const router = useRouter();
    const studentId = Array.isArray(params.id) ? params.id[0] : params.id;

    const [student, setStudent] = useState<Student | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!studentId) return;
        getStudent(studentId)
            .then((data) => setStudent(data))
            .catch(() => setStudent(null))
            .finally(() => setLoading(false));
    }, [studentId]);

    if (!studentId) return <div>Invalid student ID.</div>;
    if (loading) return <div>Loading...</div>;
    if (!student) return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 flex items-center justify-center">
            <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                <h1 className="text-2xl font-bold text-blue-700 mb-4">Student not found</h1>
                <p className="text-gray-500 mb-6">The requested student does not exist.</p>
                <Link
                    href="/students"
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                    Back to list
                </Link>
            </div>
        </main>
    );

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6 flex justify-center">
            <div className="max-w-3xl w-full bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-blue-700 mb-6">
                    {student.firstName} {student.lastName}
                </h1>

                <div className="space-y-4 text-blue-700">
                    <p><span className="font-medium">Student #:</span> {student.studentNumber}</p>
                    <p><span className="font-medium">Email:</span> {student.email}</p>
                    <p><span className="font-medium">Course:</span> {student.course}</p>
                </div>
                <div className="mt-4 flex gap-4">
                    <Link
                        href={`/students/${student.id}/edit`}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                        Edit
                    </Link>
                    <Link
                        href="/students"
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Back to list
                    </Link>
                </div>
            </div>
        </main>
    );
}


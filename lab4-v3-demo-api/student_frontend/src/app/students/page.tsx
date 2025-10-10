"use client";

import {useEffect, useState} from "react";
import {getStudents, deleteStudent } from "../../../services/studentAPI"
import {Student} from "../../../types/student";
import Link from "next/link";


export default function StudentsPage() 
{
    const [students, setStudents] = useState<Student[]>([]);
    
    const fetchStudents = async () => {
        const data = await getStudents();
        setStudents(data);
    };
    
    useEffect(() => {
        fetchStudents();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure?")) {
          await deleteStudent(id);
          fetchStudents();
        }
      };
    

    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold text-blue-700">Students</h1>
                    <Link
                        href="/students/new"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    >
                        + Add Student
                    </Link>
                </header>

                {/* Students Table or Empty State */}
                {students.length === 0 ? (
                    <p className="text-gray-500 text-center bg-white rounded-lg shadow p-6">
                        No students found.
                    </p>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                        <table className="min-w-full text-gray-700">
                            <thead className="bg-gray-100 text-sm font-semibold">
                                <tr>
                                    <th className="px-4 py-3 text-left">Name</th>
                                    <th className="px-4 py-3 text-left">Student #</th>
                                    <th className="px-4 py-3 text-left">Email</th>
                                    <th className="px-4 py-3 text-left">Course</th>
                                    <th className="px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 text-sm">
                                {students.map((s) => (
                                    <tr key={s.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            {s.firstName} {s.lastName}
                                        </td>
                                        <td className="px-4 py-3">{s.studentNumber}</td>
                                        <td className="px-4 py-3">{s.email}</td>
                                        <td className="px-4 py-3">{s.course}</td>
                                        <td className="px-4 py-3 text-center space-x-3">
                                            <Link
                                                href={`/students/${s.id}`}
                                                className="text-blue-600 hover:underline"
                                            >
                                                View
                                            </Link>
                                            <Link
                                                href={`/students/${s.id}/edit`}
                                                className="text-green-600 hover:underline"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                className="px-2 py-1 bg-red-500 text-white rounded"
                                                onClick={() => handleDelete(s.id)}
                                            >
                                                Delete
                                            </button>

                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
        
    );
}


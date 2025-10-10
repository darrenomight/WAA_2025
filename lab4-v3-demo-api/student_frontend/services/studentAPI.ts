import { Student, StudentCreate } from "../types/student";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
const BASE_URL = `${API_URL}/v1/students`;

export async function getStudents(): Promise<Student[]> {
    const res = await fetch(BASE_URL, { cache: "no-store" });
    if (!res.ok) throw new Error(`Failed to fetch students: ${res.status} ${res.statusText}`);
    const data = await res.json();
    return data.value;
}

export async function getStudent(id: string): Promise<Student> {
    const res = await fetch(`${BASE_URL}/${id}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Student not found");
    return res.json();
}

export async function deleteStudent(id: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Failed to delete student");
}

export async function createStudent(student: StudentCreate): Promise<Student> {
    const res = await fetch(BASE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
    });
    if (!res.ok) throw new Error("Failed to create student");
    return res.json();
}

export async function updateStudent(id: string, student: StudentCreate): Promise<Student> {
    const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
    });
    if (!res.ok) throw new Error("Failed to update student");
    return res.json();
}



  

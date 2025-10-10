"use client";

import { useState } from "react";
import { StudentCreate } from "../types/student";

interface Props {
  initialData?: StudentCreate;
  onSubmit: (data: StudentCreate) => void;
}

export default function StudentForm({ initialData, onSubmit }: Props) {
  const [firstName, setFirstName] = useState(initialData?.firstName || "");
  const [lastName, setLastName] = useState(initialData?.lastName || "");
  const [studentNumber, setStudentNumber] = useState(initialData?.studentNumber || "");
  const [email, setEmail] = useState(initialData?.email || "");
  const [course, setCourse] = useState(initialData?.course || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ firstName, lastName, studentNumber, email, course });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 max-w-md">
      <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First Name" />
      <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last Name" />
      <input value={studentNumber} onChange={e => setStudentNumber(e.target.value)} placeholder="Student Number" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <input value={course} onChange={e => setCourse(e.target.value)} placeholder="Course" />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
    </form>
  );
}


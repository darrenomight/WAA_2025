import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-6">
      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-16">
        <h1 className="text-3xl font-bold text-blue-700">Student Manager</h1>
        <nav className="space-x-6 text-lg font-medium">
          <Link href="/about" className="text-gray-600 hover:text-blue-600">
            About
          </Link>
          <Link href="/features" className="text-gray-600 hover:text-blue-600">
            Features
          </Link>
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl w-full">
        {/* Text */}
        <div className="text-center lg:text-left">
          <h2 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Manage Students <span className="text-blue-600">Effortlessly</span>
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            A modern student management app to track performance, attendance,
            and academic records — all in one place.
          </p>
          <div className="flex gap-4 justify-center lg:justify-start">
            <Link
              href="/signup"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              href="/demo"
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-xl hover:bg-blue-50 transition"
            >
              Live Demo
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="flex justify-center lg:justify-end">
          <Image
            src="/lecture.webp" 
            alt="Illustration of students using the app"
            width={500}
            height={400}
            className="rounded-2xl shadow-lg"
            priority // ensures hero image loads quickly
          />

        </div>
      </section>

      {/* Features Section */}
      <section className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl w-full">
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">Student Profiles</h3>
          <p className="text-gray-600">
            Create and manage student profiles with academic records, grades, and attendance tracking.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">Class Management</h3>
          <p className="text-gray-600">
            Organize classes, assign teachers, and keep everything structured and accessible.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow hover:shadow-lg transition">
          <h3 className="text-xl font-semibold mb-2 text-blue-700">Reports & Analytics</h3>
          <p className="text-gray-600">
            Generate performance reports and gain insights into student progress in seconds.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-20 text-gray-500 text-sm">
        © {new Date().getFullYear()} Student Manager. All rights reserved.
      </footer>
    </main>
  );
}







"use client";
export default function Header() {
  return (
    <footer
      className="bg-gray-900 text-gray-300 py-6">
      <div className="max-w-7xl mx-auto text-center text-sm">
        © Sarah C. {new Date().getFullYear()}
      </div>
    </footer>
  );
}

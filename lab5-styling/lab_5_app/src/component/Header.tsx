"use client";
import Link from "next/link";
export default function Header() {
  const navLinks = [
    { name: "Home", href: "#" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-blue-600">Sarah Connor</h1>
        {/* Navigation Links */}
        <ul className="absolutemd:static bg-white md:bg-transparent left-0w-full md:w-auto top-16 md:top-autoborder-t md:border-none md:flex md:space-x-8 transition-all duration-300 ease-in">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                className="block px-6py-3 text-gray-700 hover:text-blue-600font-medium transition"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-2xl font-bold">GymTrack</div>
          <nav className="flex gap-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900">
              Features
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900">
              About
            </Link>
          </nav>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          © 2024 GymTrack. All rights reserved.
          <span className="mx-4">|</span>
          <Link href="#" className="hover:text-gray-700">
            Privacy Policy
          </Link>
          <span className="mx-4">|</span>
          <Link href="#" className="hover:text-gray-700">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
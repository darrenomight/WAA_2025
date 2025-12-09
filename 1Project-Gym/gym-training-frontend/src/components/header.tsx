import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold hover:opacity-80">
          GymTrack
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="#exercises" className="text-gray-600 hover:text-gray-900">
            Exercises
          </Link>
          <Link href="#about" className="text-gray-600 hover:text-gray-900">
            About
          </Link>
          <Link href="/auth">
            <Button>Get Started</Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
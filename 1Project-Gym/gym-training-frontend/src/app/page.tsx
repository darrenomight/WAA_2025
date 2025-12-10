import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Footer from '@/components/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header/Navbar */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">GymTrack</div>
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

      {/* Hero Section */}
      <main className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-gray-600 mb-4">TRACK YOUR FITNESS JOURNEY</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-gray-900">
              Your Personal Gym Training Companion
            </h1>
            
            {/* Placeholder Image */}
            <div className="w-64 h-64 mx-auto mb-8 bg-gray-300 rounded-lg flex items-center justify-center">
              <svg
                className="w-32 h-32 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>

            <Link href="/auth">
              <Button size="lg" className="text-lg px-8">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
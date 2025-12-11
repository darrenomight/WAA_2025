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
      <main
        className="flex-1 flex items-center justify-center bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/images/background/background_landing.jpg')" }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-sm text-white/90 mb-4 font-semibold tracking-wide">TRACK YOUR FITNESS JOURNEY</p>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white drop-shadow-lg">
              Your Personal Gym Training Companion
            </h1>

            <Link href="/auth">
              <Button size="lg" className="text-lg px-8 shadow-xl">
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
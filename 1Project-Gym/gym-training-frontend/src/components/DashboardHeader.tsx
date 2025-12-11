'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { showToast } from '@/lib/toast';

interface DashboardHeaderProps {
  currentPage?: string;
}

export default function DashboardHeader({ currentPage }: DashboardHeaderProps) {
  const router = useRouter();
  const { clearAuth } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    clearAuth();
    showToast.success('Logged out successfully');
    router.push('/');
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Plans', path: '/plans' },
    { label: 'History', path: '/history' },
    { label: 'Records', path: '/records' },
    { label: 'Profile', path: '/profile' },
    { label: 'Start Workout', path: '/workout/start', primary: true },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div
            className="text-2xl font-bold cursor-pointer hover:opacity-80"
            onClick={() => router.push('/dashboard')}
          >
            GymTrack
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant={item.primary ? 'default' : 'ghost'}
                onClick={() => handleNavigation(item.path)}
                className={currentPage === item.path ? 'bg-gray-100' : ''}
              >
                {item.label}
              </Button>
            ))}
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t pt-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  variant={item.primary ? 'default' : 'ghost'}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full justify-start ${currentPage === item.path ? 'bg-gray-100' : ''}`}
                >
                  {item.label}
                </Button>
              ))}
              <Button variant="outline" onClick={handleLogout} className="w-full">
                Logout
              </Button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
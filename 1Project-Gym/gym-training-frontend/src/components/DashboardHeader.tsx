'use client';

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

  const handleLogout = () => {
    clearAuth();
    showToast.success('Logged out successfully');
    router.push('/');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'My Plans', path: '/plans' },
    { label: 'History', path: '/history' },
    { label: 'Records', path: '/records' },
    { label: 'Start Workout', path: '/workout/start', primary: true },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="text-2xl font-bold cursor-pointer hover:opacity-80" 
          onClick={() => router.push('/dashboard')}
        >
          GymTrack
        </div>
        <nav className="flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={item.primary ? 'default' : 'ghost'}
              onClick={() => router.push(item.path)}
              className={currentPage === item.path ? 'bg-gray-100' : ''}
            >
              {item.label}
            </Button>
          ))}
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
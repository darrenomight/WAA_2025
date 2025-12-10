'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';
import DashboardHeader from '@/components/DashboardHeader';

export default function CreatePlanPage() {
  const router = useRouter();
  const { user, clearAuth, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        router.push('/auth');
        return;
      }

      if (!user) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data.user);
        } catch (error) {
          showToast.error('Session expired. Please login again.');
          clearAuth();
          router.push('/auth');
        }
      }
    };

    checkAuth();
  }, [user, router, setUser, clearAuth]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/workout-plans', {
        name,
        description: description || null,
      });

      showToast.success('Workout plan created successfully!');
      
      // Redirect to the plan detail page to add exercises
      router.push(`/plans/${response.data.data.id}`);
    } catch (error: any) {
      showToast.error(error.response?.data?.error || 'Failed to create plan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    showToast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="/plans" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Create Workout Plan</h1>
          <p className="text-gray-600">
            Give your workout plan a name and description
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Plan Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Plan Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Push Day, Full Body Workout"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your workout plan..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isLoading}
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button type="submit" disabled={isLoading || !name.trim()}>
                  {isLoading ? 'Creating...' : 'Create Plan'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/plans')}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>

              <p className="text-sm text-gray-500">
                After creating the plan, you'll be able to add exercises to it.
              </p>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
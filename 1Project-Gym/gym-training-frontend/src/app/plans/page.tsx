'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';
import DashboardHeader from '@/components/DashboardHeader';

interface WorkoutPlan {
  id: string;
  name: string;
  description: string | null;
  exercises: Array<{
    id: string;
    exercise: {
      id: string;
      name: string;
      primaryMuscle: string;
    };
    targetSets: number | null;
    targetReps: number | null;
    orderIndex: number;
  }>;
}

export default function WorkoutPlansPage() {
  const router = useRouter();
  const { user, clearAuth, setUser } = useAuthStore();
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch workout plans
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/workout-plans');
        setPlans(response.data.data);
      } catch (error: any) {
        showToast.error('Failed to load workout plans');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handleDeletePlan = async (planId: string) => {
    if (!confirm('Are you sure you want to delete this plan?')) return;

    try {
      await api.delete(`/workout-plans/${planId}`);
      setPlans(plans.filter((plan) => plan.id !== planId));
      showToast.success('Plan deleted successfully');
    } catch (error: any) {
      showToast.error('Failed to delete plan');
    }
  };

  const handleLogout = () => {
    clearAuth();
    showToast.success('Logged out successfully');
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="/plans" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Workout Plans</h1>
            <p className="text-gray-600">
              Create and manage your custom workout routines
            </p>
          </div>
          <Link href="/plans/create">
            <Button size="lg">Create New Plan</Button>
          </Link>
        </div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No workout plans yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first workout plan to get started!
              </p>
              <Link href="/plans/create">
                <Button>Create Your First Plan</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>
                    {plan.description || 'No description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Exercises:</span>
                      <Badge variant="secondary">{plan.exercises.length}</Badge>
                    </div>

                    {/* Show first few exercises */}
                    {plan.exercises.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs text-gray-500 font-medium">
                          Includes:
                        </p>
                        {plan.exercises.slice(0, 3).map((pe) => (
                          <p key={pe.id} className="text-sm text-gray-700">
                            • {pe.exercise.name}
                          </p>
                        ))}
                        {plan.exercises.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{plan.exercises.length - 3} more...
                          </p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 pt-2">
                      <Link href={`/plans/${plan.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
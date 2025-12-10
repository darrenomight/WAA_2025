'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';

interface WorkoutPlan {
  id: string;
  name: string;
  description: string | null;
  exercises: Array<{
    exercise: {
      name: string;
      primaryMuscle: string;
    };
  }>;
}

export default function StartWorkoutPage() {
  const router = useRouter();
  const { user, clearAuth, setUser } = useAuthStore();
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);

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

  // Fetch plans
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

  const handleStartWorkout = async (planId: string | null, planName: string) => {
    setIsStarting(true);
    try {
      const response = await api.post('/workout-sessions', {
        planId: planId,
        name: planName,
        notes: null,
      });

      const sessionId = response.data.data.id;
      showToast.success('Workout started!');
      
      // Navigate to active workout with session ID
      router.push(`/workout/active?sessionId=${sessionId}`);
    } catch (error: any) {
      showToast.error('Failed to start workout');
    } finally {
      setIsStarting(false);
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
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">GymTrack</div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/dashboard')}>
              Dashboard
            </Button>
            <Button variant="ghost" onClick={() => router.push('/plans')}>
              My Plans
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Start Workout</h1>
          <p className="text-gray-600">
            Choose a workout plan or start a freestyle workout
          </p>
        </div>

        <div className="space-y-6">
          {/* Freestyle Workout */}
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle>Freestyle Workout</CardTitle>
              <CardDescription>
                Start a workout without a plan - add exercises as you go
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => handleStartWorkout(null, 'Freestyle Workout')}
                disabled={isStarting}
                size="lg"
              >
                {isStarting ? 'Starting...' : 'Start Freestyle Workout'}
              </Button>
            </CardContent>
          </Card>

          {/* My Plans */}
          {plans.length > 0 && (
            <>
              <div className="pt-4">
                <h2 className="text-xl font-semibold mb-4">My Workout Plans</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{plan.name}</CardTitle>
                      <CardDescription>
                        {plan.description || 'No description'}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">
                            {plan.exercises.length} exercises
                          </Badge>
                        </div>

                        {plan.exercises.length > 0 && (
                          <div className="text-sm text-gray-600">
                            {plan.exercises.slice(0, 3).map((pe, idx) => (
                              <div key={idx}>• {pe.exercise.name}</div>
                            ))}
                            {plan.exercises.length > 3 && (
                              <div className="text-xs mt-1">
                                +{plan.exercises.length - 3} more...
                              </div>
                            )}
                          </div>
                        )}

                        <Button
                          onClick={() => handleStartWorkout(plan.id, plan.name)}
                          disabled={isStarting}
                          className="w-full"
                        >
                          {isStarting ? 'Starting...' : 'Start This Plan'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {plans.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  You don't have any workout plans yet.
                </p>
                <Button
                  variant="outline"
                  onClick={() => router.push('/plans/create')}
                >
                  Create Your First Plan
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
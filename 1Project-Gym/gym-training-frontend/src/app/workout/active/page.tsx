'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';
import type { Exercise } from '@/types';

interface WorkoutSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  weight: number | null;
  reps: number | null;
  duration: number | null;
  isPersonalRecord: boolean;
  completedAt: string;
  exercise: Exercise;
}

interface WorkoutSession {
  id: string;
  name: string;
  startTime: string;
  endTime: string | null;
  sets: WorkoutSet[];
}

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('sessionId');
  const { user, clearAuth, setUser } = useAuthStore();

  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [exercises, setExercises] = useState<Exercise[]>([]);

  // Current set logging state
  const [selectedExerciseId, setSelectedExerciseId] = useState('');
  const [setNumber, setSetNumber] = useState(1);
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [duration, setDuration] = useState('');
  const [isLoggingSet, setIsLoggingSet] = useState(false);

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

  // Fetch session details
  useEffect(() => {
    if (!sessionId) {
      showToast.error('No session ID provided');
      router.push('/workout/start');
      return;
    }

    const fetchSession = async () => {
      try {
        const response = await api.get(`/workout-sessions/${sessionId}`);
        setSession(response.data.data);
      } catch (error: any) {
        showToast.error('Failed to load workout session');
        router.push('/workout/start');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, [sessionId, router]);

  // Fetch exercises
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await api.get('/exercises');
        setExercises(response.data.data);
      } catch (error: any) {
        showToast.error('Failed to load exercises');
      }
    };

    fetchExercises();
  }, []);

  // Auto-calculate next set number for selected exercise
  useEffect(() => {
    if (selectedExerciseId && session) {
      const exerciseSets = session.sets.filter(
        (set) => set.exerciseId === selectedExerciseId
      );
      setSetNumber(exerciseSets.length + 1);
    }
  }, [selectedExerciseId, session]);

  const handleLogSet = async () => {
    if (!selectedExerciseId) {
      showToast.error('Please select an exercise');
      return;
    }

    if (!weight && !reps && !duration) {
      showToast.error('Please enter weight/reps or duration');
      return;
    }

    setIsLoggingSet(true);
    try {
      const response = await api.post(`/workout-sessions/${sessionId}/sets`, {
        exerciseId: selectedExerciseId,
        setNumber: setNumber,
        weight: weight ? parseFloat(weight) : null,
        reps: reps ? parseInt(reps) : null,
        duration: duration ? parseInt(duration) : null,
      });

      const newSet = response.data.data;

      // Check for PR
      if (newSet.isPersonalRecord) {
        showToast.success('🎉 NEW PERSONAL RECORD! 🎉');
      } else {
        showToast.success('Set logged!');
      }

      // Refresh session to get updated sets
      const sessionResponse = await api.get(`/workout-sessions/${sessionId}`);
      setSession(sessionResponse.data.data);

      // Reset weight and reps but keep exercise selected
      setWeight('');
      setReps('');
      setDuration('');
    } catch (error: any) {
      showToast.error(error.response?.data?.error || 'Failed to log set');
    } finally {
      setIsLoggingSet(false);
    }
  };

  const handleCompleteWorkout = async () => {
    if (!confirm('Complete this workout?')) return;

    try {
      await api.put(`/workout-sessions/${sessionId}/complete`, {
        notes: null,
      });

      showToast.success('Workout completed! Great job! 💪');
      router.push('/history');
    } catch (error: any) {
      showToast.error('Failed to complete workout');
    }
  };

  const handleDeleteSet = async (setId: string) => {
    if (!confirm('Delete this set?')) return;

    try {
      await api.delete(`/workout-sessions/sets/${setId}`);
      showToast.success('Set deleted');

      // Update local state
      if (session) {
        setSession({
          ...session,
          sets: session.sets.filter((set) => set.id !== setId),
        });
      }
    } catch (error: any) {
      showToast.error('Failed to delete set');
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
          <p className="mt-4 text-gray-600">Loading workout...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  // Group sets by exercise
  const setsByExercise = session.sets.reduce((acc, set) => {
    if (!acc[set.exerciseId]) {
      acc[set.exerciseId] = [];
    }
    acc[set.exerciseId].push(set);
    return acc;
  }, {} as Record<string, WorkoutSet[]>);

  const startTime = new Date(session.startTime);
  const currentTime = new Date();
  const elapsedMinutes = Math.floor(
    (currentTime.getTime() - startTime.getTime()) / 1000 / 60
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{session.name}</h1>
              <p className="text-sm text-gray-600">
                {elapsedMinutes} min • {session.sets.length} sets
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleLogout} size="sm">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Log Set Card */}
        <Card className="mb-6 border-2 border-primary">
          <CardHeader>
            <CardTitle>Log Set</CardTitle>
            <CardDescription>
              Record your current set - weight and reps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Exercise Selection */}
            <div>
              <Label>Exercise</Label>
              <Select
                value={selectedExerciseId}
                onValueChange={setSelectedExerciseId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select exercise" />
                </SelectTrigger>
                <SelectContent>
                  {exercises.map((exercise) => (
                    <SelectItem key={exercise.id} value={exercise.id}>
                      {exercise.name} ({exercise.primaryMuscle})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Set Details */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <Label htmlFor="setNumber">Set #</Label>
                <Input
                  id="setNumber"
                  type="number"
                  value={setNumber}
                  onChange={(e) => setSetNumber(parseInt(e.target.value))}
                  min="1"
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="reps">Reps</Label>
                <Input
                  id="reps"
                  type="number"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="duration">Time (sec)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <Button
              onClick={handleLogSet}
              disabled={isLoggingSet || !selectedExerciseId}
              className="w-full"
              size="lg"
            >
              {isLoggingSet ? 'Logging...' : 'Log Set'}
            </Button>
          </CardContent>
        </Card>

        {/* Workout Summary */}
        {session.sets.length > 0 ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Today's Sets</h2>

            {Object.entries(setsByExercise).map(([exerciseId, sets]) => {
              const exercise = sets[0].exercise;
              return (
                <Card key={exerciseId}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          {exercise.name}
                        </CardTitle>
                        <CardDescription>
                          {exercise.primaryMuscle} • {sets.length} sets
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {sets.map((set) => (
                        <div
                          key={set.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">Set {set.setNumber}</Badge>
                            <span className="font-semibold">
                              {set.weight ? `${set.weight} kg` : '-'} ×{' '}
                              {set.reps || '-'} reps
                            </span>
                            {set.duration && (
                              <span className="text-sm text-gray-600">
                                {set.duration}s
                              </span>
                            )}
                            {set.isPersonalRecord && (
                              <Badge variant="default">PR! 🎉</Badge>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteSet(set.id)}
                            className="text-red-600"
                          >
                            Delete
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-gray-600">
                No sets logged yet. Start by selecting an exercise above!
              </p>
            </CardContent>
          </Card>
        )}

        {/* Complete Workout Button */}
        <div className="mt-8 flex gap-4">
          <Button
            onClick={handleCompleteWorkout}
            disabled={session.sets.length === 0}
            size="lg"
            className="flex-1"
          >
            Complete Workout
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/dashboard')}
          >
            Cancel
          </Button>
        </div>
      </main>
    </div>
  );
}
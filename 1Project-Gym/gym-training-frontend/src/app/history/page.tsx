'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { showToast } from '@/lib/toast';
import DashboardHeader from '@/components/DashboardHeader';
import ConfirmDialog from '@/components/ConfirmDialog';

interface WorkoutSet {
  id: string;
  exerciseId: string;
  setNumber: number;
  weight: number | null;
  reps: number | null;
  duration: number | null;
  isPersonalRecord: boolean;
  exercise: {
    name: string;
    primaryMuscle: string;
  };
}

interface WorkoutSession {
  id: string;
  name: string;
  startTime: string;
  endTime: string | null;
  notes: string | null;
  sets: WorkoutSet[];
}

export default function WorkoutHistoryPage() {
  const router = useRouter();
  const { user, clearAuth, setUser } = useAuthStore();
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [deleteSessionId, setDeleteSessionId] = useState<string | null>(null);

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

  // Fetch workout history
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/workout-sessions');
        setSessions(response.data.data);
      } catch (error: any) {
        showToast.error('Failed to load workout history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleDeleteSession = async () => {
    if (!deleteSessionId) return;

    try {
      await api.delete(`/workout-sessions/${deleteSessionId}`);
      setSessions(sessions.filter((s) => s.id !== deleteSessionId));
      showToast.success('Workout session deleted');
    } catch (error: any) {
      showToast.error('Failed to delete session');
    } finally {
      setDeleteSessionId(null);
    }
  };

  const toggleExpand = (sessionId: string) => {
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  };

  const handleLogout = () => {
    clearAuth();
    showToast.success('Logged out successfully');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const calculateDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return 'In progress';
    const start = new Date(startTime);
    const end = new Date(endTime);
    const minutes = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);
    return `${minutes} min`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="/plans" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Workout History</h1>
            <p className="text-gray-600">
              {sessions.length} total workout{sessions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Sessions List */}
        {sessions.length === 0 ? (
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No workouts yet</h3>
              <p className="text-gray-600 mb-6">
                Start your first workout to see it here!
              </p>
              <Button onClick={() => router.push('/workout/start')}>
                Start Workout
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => {
              const isExpanded = expandedSessionId === session.id;
              const setsByExercise = session.sets.reduce((acc, set) => {
                if (!acc[set.exerciseId]) {
                  acc[set.exerciseId] = [];
                }
                acc[set.exerciseId].push(set);
                return acc;
              }, {} as Record<string, WorkoutSet[]>);

              const uniqueExercises = Object.keys(setsByExercise).length;
              const totalSets = session.sets.length;
              const prCount = session.sets.filter((s) => s.isPersonalRecord).length;

              return (
                <Card key={session.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg">{session.name}</CardTitle>
                          {prCount > 0 && (
                            <Badge variant="default">
                              {prCount} PR{prCount !== 1 ? 's' : ''}! 🎉
                            </Badge>
                          )}
                        </div>
                        <CardDescription>
                          {formatDate(session.startTime)} at{' '}
                          {formatTime(session.startTime)} •{' '}
                          {calculateDuration(session.startTime, session.endTime)}
                        </CardDescription>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>{uniqueExercises} exercises</span>
                          <span>•</span>
                          <span>{totalSets} sets</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleExpand(session.id)}
                        >
                          {isExpanded ? 'Hide' : 'View'} Details
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteSessionId(session.id)}
                          className="text-red-600"
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
                  </CardHeader>

                  {isExpanded && (
                    <CardContent>
                      <div className="space-y-4">
                        {Object.entries(setsByExercise).map(
                          ([exerciseId, sets]) => {
                            const exercise = sets[0].exercise;
                            return (
                              <div key={exerciseId} className="border-t pt-4 first:border-t-0 first:pt-0">
                                <h4 className="font-semibold mb-2">
                                  {exercise.name}
                                </h4>
                                <div className="space-y-2">
                                  {sets.map((set) => (
                                    <div
                                      key={set.id}
                                      className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded"
                                    >
                                      <div className="flex items-center gap-3">
                                        <Badge variant="outline" className="text-xs">
                                          Set {set.setNumber}
                                        </Badge>
                                        <span>
                                          {set.weight ? `${set.weight} kg` : '-'} ×{' '}
                                          {set.reps || '-'} reps
                                        </span>
                                        {set.duration && (
                                          <span className="text-gray-600">
                                            ({set.duration}s)
                                          </span>
                                        )}
                                        {set.isPersonalRecord && (
                                          <Badge variant="default" className="text-xs">
                                            PR! 🎉
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={deleteSessionId !== null}
        onOpenChange={(open) => !open && setDeleteSessionId(null)}
        onConfirm={handleDeleteSession}
        title="Delete Workout Session?"
        description="Are you sure you want to delete this workout session? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
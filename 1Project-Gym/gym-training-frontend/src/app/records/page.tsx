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

interface PersonalRecord {
  id: string;
  recordType: 'ONE_REP_MAX' | 'BEST_SET' | 'BEST_VOLUME' | 'LONGEST_DURATION';
  weight: number | null;
  reps: number | null;
  duration: number | null;
  achievedAt: string;
}

interface GroupedPR {
  exercise: {
    id: string;
    name: string;
    primaryMuscle: string;
    equipment: string;
  };
  records: PersonalRecord[];
}

export default function PersonalRecordsPage() {
  const router = useRouter();
  const { user, clearAuth, setUser } = useAuthStore();
  const [groupedPRs, setGroupedPRs] = useState<GroupedPR[]>([]);
  const [totalPRs, setTotalPRs] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [deletePRId, setDeletePRId] = useState<string | null>(null);

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

  // Fetch personal records
  useEffect(() => {
    const fetchPRs = async () => {
      try {
        const response = await api.get('/personal-records');
        setGroupedPRs(response.data.data);
        setTotalPRs(response.data.total || 0);
      } catch (error: any) {
        showToast.error('Failed to load personal records');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPRs();
  }, []);

  const handleDeletePR = async () => {
    if (!deletePRId) return;

    try {
      await api.delete(`/personal-records/${deletePRId}`);
      // Refresh the data after deletion
      const response = await api.get('/personal-records');
      setGroupedPRs(response.data.data);
      setTotalPRs(response.data.total || 0);
      showToast.success('Personal record deleted');
    } catch (error: any) {
      showToast.error('Failed to delete PR');
    } finally {
      setDeletePRId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatRecordType = (type: string) => {
    switch (type) {
      case 'ONE_REP_MAX':
        return '1RM';
      case 'BEST_SET':
        return 'Best Set';
      case 'BEST_VOLUME':
        return 'Best Volume';
      case 'LONGEST_DURATION':
        return 'Longest Duration';
      default:
        return type;
    }
  };

  const formatRecordValue = (pr: PersonalRecord) => {
    if (pr.recordType === 'LONGEST_DURATION' && pr.duration) {
      return `${pr.duration}s`;
    }
    if (pr.weight && pr.reps) {
      return `${pr.weight} kg × ${pr.reps} reps`;
    }
    if (pr.weight) {
      return `${pr.weight} kg`;
    }
    return '-';
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="/plans" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Personal Records 🏆</h1>
          <p className="text-gray-600">
            {totalPRs} total record{totalPRs !== 1 ? 's' : ''} across{' '}
            {groupedPRs.length} exercise
            {groupedPRs.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* PRs List */}
        {groupedPRs.length === 0 ? (
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
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No personal records yet</h3>
              <p className="text-gray-600 mb-6">
                Start working out to set your first PR!
              </p>
              <Button onClick={() => router.push('/workout/start')}>
                Start Workout
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {groupedPRs.map(({ exercise, records }) => (
              <Card key={exercise.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{exercise.name}</CardTitle>
                      <CardDescription>
                        {exercise.primaryMuscle} • {exercise.equipment}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{records.length} PRs</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {records.map((pr: PersonalRecord) => (
                      <div
                        key={pr.id}
                        className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <Badge variant="outline" className="bg-white">
                              {formatRecordType(pr.recordType)}
                            </Badge>
                            <span className="font-semibold text-lg">
                              {formatRecordValue(pr)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Achieved on {formatDate(pr.achievedAt)}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeletePRId(pr.id)}
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
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={deletePRId !== null}
        onOpenChange={(open) => !open && setDeletePRId(null)}
        onConfirm={handleDeletePR}
        title="Delete Personal Record?"
        description="Are you sure you want to delete this personal record? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
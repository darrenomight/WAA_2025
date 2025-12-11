'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import DashboardHeader from '@/components/DashboardHeader';
import ConfirmDialog from '@/components/ConfirmDialog';

interface PlanExercise {
  id: string;
  exerciseId: string;
  orderIndex: number;
  targetSets: number | null;
  targetReps: number | null;
  targetDuration: number | null;
  restTime: number | null;
  notes: string | null;
  exercise: Exercise;
}

interface WorkoutPlan {
  id: string;
  name: string;
  description: string | null;
  exercises: PlanExercise[];
}

export default function PlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;
  const { user, clearAuth, setUser } = useAuthStore();

  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Exercise library for adding
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('');
  const [targetSets, setTargetSets] = useState('3');
  const [targetReps, setTargetReps] = useState('10');
  const [restTime, setRestTime] = useState('90');
  const [isAdding, setIsAdding] = useState(false);
  const [removeExerciseId, setRemoveExerciseId] = useState<string | null>(null);

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

  // Fetch plan details
  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const response = await api.get(`/workout-plans/${planId}`);
        setPlan(response.data.data);
      } catch (error: any) {
        showToast.error('Failed to load plan');
        router.push('/plans');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlan();
  }, [planId, router]);

  // Fetch exercises for adding
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const response = await api.get('/exercises');
        setExercises(response.data.data);
        setFilteredExercises(response.data.data);
      } catch (error: any) {
        showToast.error('Failed to load exercises');
      }
    };

    fetchExercises();
  }, []);

  // Filter exercises by muscle
  useEffect(() => {
    if (selectedMuscle === 'all') {
      setFilteredExercises(exercises);
    } else {
      const filtered = exercises.filter((ex) => ex.primaryMuscle === selectedMuscle);
      setFilteredExercises(filtered);
    }
  }, [selectedMuscle, exercises]);

  const handleAddExercise = async () => {
    if (!selectedExerciseId) {
      showToast.error('Please select an exercise');
      return;
    }

    setIsAdding(true);
    try {
      await api.post(`/workout-plans/${planId}/exercises`, {
        exerciseId: selectedExerciseId,
        targetSets: parseInt(targetSets) || null,
        targetReps: parseInt(targetReps) || null,
        restTime: parseInt(restTime) || null,
      });

      showToast.success('Exercise added to plan!');

      // Refresh plan
      const response = await api.get(`/workout-plans/${planId}`);
      setPlan(response.data.data);

      // Reset form
      setSelectedExerciseId('');
      setTargetSets('3');
      setTargetReps('10');
      setRestTime('90');
      setIsAddDialogOpen(false);
    } catch (error: any) {
      showToast.error(error.response?.data?.error || 'Failed to add exercise');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveExercise = async () => {
    if (!removeExerciseId) return;

    const [planExerciseId, exerciseId] = removeExerciseId.split(':');

    try {
      await api.delete(`/workout-plans/${planId}/exercises/${exerciseId}`);
      showToast.success("Exercise removed");

      // Update local state
      if (plan) {
        setPlan({
          ...plan,
          exercises: plan.exercises.filter((pe) => pe.id !== planExerciseId),
        });
      }
    } catch (error: any) {
      showToast.error("Failed to remove exercise");
    } finally {
      setRemoveExerciseId(null);
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

  if (!plan) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader currentPage="/plans" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{plan.name}</h1>
            {plan.description && (
              <p className="text-gray-600">{plan.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {plan.exercises.length} exercise
              {plan.exercises.length !== 1 ? "s" : ""}
            </p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Exercise</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Exercise to Plan</DialogTitle>
                <DialogDescription>
                  Choose an exercise and set target sets and reps
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                {/* Filter */}
                <div>
                  <Label>Filter by Muscle Group</Label>
                  <Select
                    value={selectedMuscle}
                    onValueChange={setSelectedMuscle}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Muscles</SelectItem>
                      <SelectItem value="CHEST">Chest</SelectItem>
                      <SelectItem value="BACK">Back</SelectItem>
                      <SelectItem value="SHOULDERS">Shoulders</SelectItem>
                      <SelectItem value="BICEPS">Biceps</SelectItem>
                      <SelectItem value="TRICEPS">Triceps</SelectItem>
                      <SelectItem value="QUADS">Quads</SelectItem>
                      <SelectItem value="HAMSTRINGS">Hamstrings</SelectItem>
                      <SelectItem value="GLUTES">Glutes</SelectItem>
                      <SelectItem value="CALVES">Calves</SelectItem>
                      <SelectItem value="ABS">Abs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Exercise Selection */}
                <div>
                  <Label>Select Exercise</Label>
                  <Select
                    value={selectedExerciseId}
                    onValueChange={setSelectedExerciseId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an exercise" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredExercises.map((exercise) => (
                        <SelectItem key={exercise.id} value={exercise.id}>
                          {exercise.name} ({exercise.primaryMuscle})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Target Sets */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="targetSets">Target Sets</Label>
                    <Input
                      id="targetSets"
                      type="number"
                      value={targetSets}
                      onChange={(e) => setTargetSets(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetReps">Target Reps</Label>
                    <Input
                      id="targetReps"
                      type="number"
                      value={targetReps}
                      onChange={(e) => setTargetReps(e.target.value)}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="restTime">Rest (seconds)</Label>
                    <Input
                      id="restTime"
                      type="number"
                      value={restTime}
                      onChange={(e) => setRestTime(e.target.value)}
                      min="0"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleAddExercise}
                  disabled={isAdding || !selectedExerciseId}
                  className="w-full"
                >
                  {isAdding ? "Adding..." : "Add to Plan"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Exercises List */}
        {plan.exercises.length === 0 ? (
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
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No exercises yet</h3>
              <p className="text-gray-600 mb-4">
                Add exercises to this plan to get started
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {plan.exercises.map((planExercise, index) => (
              <Card key={planExercise.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">{index + 1}</Badge>
                        <CardTitle className="text-lg">
                          {planExercise.exercise.name}
                        </CardTitle>
                      </div>
                      <CardDescription>
                        {planExercise.exercise.primaryMuscle} •{" "}
                        {planExercise.exercise.equipment}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setRemoveExerciseId(`${planExercise.id}:${planExercise.exerciseId}`)
                      }
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Target Sets</p>
                      <p className="font-semibold">
                        {planExercise.targetSets || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Target Reps</p>
                      <p className="font-semibold">
                        {planExercise.targetReps || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Rest Time</p>
                      <p className="font-semibold">
                        {planExercise.restTime
                          ? `${planExercise.restTime}s`
                          : "-"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        {plan.exercises.length > 0 && (
          <div className="mt-8 flex gap-4">
            <Button size="lg" onClick={() => router.push("/workout/start")}>
              🏋️ Start Workout from Plan
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/plans")}
            >
              Back to Plans
            </Button>
          </div>
        )}
      </main>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={removeExerciseId !== null}
        onOpenChange={(open) => !open && setRemoveExerciseId(null)}
        onConfirm={handleRemoveExercise}
        title="Remove Exercise from Plan?"
        description="Are you sure you want to remove this exercise from the workout plan?"
        confirmText="Remove"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import type { Exercise, MuscleGroup, Equipment, Difficulty } from '@/types';
import ExerciseDetailModal from '@/components/ExerciseDetailModal';
import DashboardHeader from '@/components/DashboardHeader';
import { getMuscleImage } from '@/lib/muscleImages';

interface WorkoutSession {
  id: string;
  name: string;
  startTime: string;
  endTime: string | null;
  sets: Array<{
    exercise: {
      name: string;
    };
  }>;
}

interface Stats {
  totalWorkouts: number;
  totalPlans: number;
  totalPRs: number;
  totalSets: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, clearAuth, setUser } = useAuthStore();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('all');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Stats and recent activity
  const [stats, setStats] = useState<Stats>({
    totalWorkouts: 0,
    totalPlans: 0,
    totalPRs: 0,
    totalSets: 0,
  });
  const [recentSessions, setRecentSessions] = useState<WorkoutSession[]>([]);

  // Check authentication and fetch data
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
          return;
        }
      }

      // Fetch all data after authentication is confirmed
      await Promise.all([fetchExercises(), fetchStats()]);
    };

    const fetchExercises = async () => {
      try {
        const response = await api.get('/exercises');
        setExercises(response.data.data);
        setFilteredExercises(response.data.data);
      } catch (error: any) {
        showToast.error('Failed to load exercises');
      } finally {
        setIsLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        // Fetch workouts
        const sessionsResponse = await api.get('/workout-sessions');
        const sessions = sessionsResponse.data.data;

        // Fetch plans
        const plansResponse = await api.get('/workout-plans');
        const plans = plansResponse.data.data;

        // Fetch PRs
        const prsResponse = await api.get('/personal-records');
        const prs = prsResponse.data.data;

        // Calculate total sets
        const totalSets = sessions.reduce((sum: number, session: any) => {
          return sum + (session.sets?.length || 0);
        }, 0);

        // Count total PRs
        const totalPRCount = prs.reduce((sum: number, group: any) => {
          return sum + (group.records?.length || 0);
        }, 0);

        setStats({
          totalWorkouts: sessions.length,
          totalPlans: plans.length,
          totalPRs: totalPRCount,
          totalSets: totalSets,
        });

        // Get recent 3 workouts
        setRecentSessions(sessions.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    checkAuth();
  }, [user, router, setUser, clearAuth]);

  // Filter exercises by all criteria
  useEffect(() => {
    let filtered = exercises;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter((exercise) =>
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by muscle group
    if (selectedMuscle !== 'all') {
      filtered = filtered.filter(
        (exercise) => exercise.primaryMuscle === selectedMuscle
      );
    }

    // Filter by equipment
    if (selectedEquipment !== 'all') {
      filtered = filtered.filter(
        (exercise) => exercise.equipment === selectedEquipment
      );
    }

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(
        (exercise) => exercise.difficulty === selectedDifficulty
      );
    }

    setFilteredExercises(filtered);
  }, [searchQuery, selectedMuscle, selectedEquipment, selectedDifficulty, exercises]);

  const handleViewDetails = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedMuscle('all');
    setSelectedEquipment('all');
    setSelectedDifficulty('all');
  };

  const hasActiveFilters = searchQuery.trim() || selectedMuscle !== 'all' || selectedEquipment !== 'all' || selectedDifficulty !== 'all';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffHours < 24) {
      return 'Today';
    } else if (diffHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
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
      <DashboardHeader currentPage="/dashboard" />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user?.firstName || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mb-4">
            Ready to crush your workout? Check your stats below.
          </p>
          <Button size="lg" onClick={() => router.push('/workout/start')}>
            🏋️ Start Workout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Workouts</CardDescription>
              <CardTitle className="text-3xl">{stats.totalWorkouts}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">
                {stats.totalSets} total sets logged
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Workout Plans</CardDescription>
              <CardTitle className="text-3xl">{stats.totalPlans}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs"
                onClick={() => router.push('/plans')}
              >
                View all plans →
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Personal Records</CardDescription>
              <CardTitle className="text-3xl">{stats.totalPRs}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="link" 
                className="p-0 h-auto text-xs"
                onClick={() => router.push('/records')}
              >
                View all PRs →
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Exercise Library</CardDescription>
              <CardTitle className="text-3xl">{exercises.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-gray-500">
                Exercises available
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Workouts */}
        {recentSessions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Recent Workouts</h2>
              <Button 
                variant="ghost" 
                onClick={() => router.push('/history')}
              >
                View All →
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentSessions.map((session) => {
                const uniqueExercises = new Set(
                  session.sets.map((s) => s.exercise.name)
                ).size;
                
                return (
                  <Card 
                    key={session.id} 
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => router.push('/history')}
                  >
                    <CardHeader>
                      <CardTitle className="text-lg">{session.name}</CardTitle>
                      <CardDescription>
                        {formatDate(session.startTime)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{uniqueExercises} exercises</span>
                        <span>•</span>
                        <span>{session.sets.length} sets</span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Exercise Library Section */}
        <div className="mb-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Exercise Library</h2>
              <span className="text-sm text-gray-600">
                Showing {filteredExercises.length} of {exercises.length} exercises
              </span>
            </div>

            {/* Search Bar */}
            <div className="w-full">
              <Input
                type="text"
                placeholder="Search exercises by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Filter Buttons Row */}
            <div className="flex flex-wrap gap-3">
              {/* Muscle Group Filter */}
              <Select value={selectedMuscle} onValueChange={setSelectedMuscle}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Muscle Group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Muscles</SelectItem>
                  <SelectItem value="CHEST">Chest</SelectItem>
                  <SelectItem value="BACK">Back</SelectItem>
                  <SelectItem value="SHOULDERS">Shoulders</SelectItem>
                  <SelectItem value="BICEPS">Biceps</SelectItem>
                  <SelectItem value="TRICEPS">Triceps</SelectItem>
                  <SelectItem value="FOREARMS">Forearms</SelectItem>
                  <SelectItem value="QUADS">Quads</SelectItem>
                  <SelectItem value="HAMSTRINGS">Hamstrings</SelectItem>
                  <SelectItem value="GLUTES">Glutes</SelectItem>
                  <SelectItem value="CALVES">Calves</SelectItem>
                  <SelectItem value="ABS">Abs</SelectItem>
                  <SelectItem value="OBLIQUES">Obliques</SelectItem>
                  <SelectItem value="FULL_BODY">Full Body</SelectItem>
                </SelectContent>
              </Select>

              {/* Equipment Filter */}
              <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Equipment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Equipment</SelectItem>
                  <SelectItem value="BARBELL">Barbell</SelectItem>
                  <SelectItem value="DUMBBELL">Dumbbell</SelectItem>
                  <SelectItem value="KETTLEBELL">Kettlebell</SelectItem>
                  <SelectItem value="MACHINE">Machine</SelectItem>
                  <SelectItem value="CABLE">Cable</SelectItem>
                  <SelectItem value="BODYWEIGHT">Bodyweight</SelectItem>
                  <SelectItem value="RESISTANCE_BAND">Resistance Band</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>

              {/* Difficulty Filter */}
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="BEGINNER">Beginner</SelectItem>
                  <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                  <SelectItem value="ADVANCED">Advanced</SelectItem>
                </SelectContent>
              </Select>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="ml-auto"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>

          {/* Exercise Cards Grid */}
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No exercises found for this filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExercises.map((exercise) => (
                <Card key={exercise.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center p-2">
                        <Image
                          src={getMuscleImage(exercise.primaryMuscle)}
                          alt={exercise.primaryMuscle}
                          width={40}
                          height={40}
                          className="object-contain"
                        />
                      </div>
                      <Badge variant="secondary">{exercise.difficulty}</Badge>
                    </div>
                    <CardTitle className="text-lg">{exercise.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {exercise.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Primary Muscle:</span>
                        <Badge variant="outline">{exercise.primaryMuscle}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Equipment:</span>
                        <span className="font-medium">{exercise.equipment}</span>
                      </div>
                      <Button
                        className="w-full mt-4"
                        variant="outline"
                        onClick={() => handleViewDetails(exercise)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
        
        {/* Exercise Detail Modal */}
        <ExerciseDetailModal
          exercise={selectedExercise}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </main>  
    </div>
  );
}
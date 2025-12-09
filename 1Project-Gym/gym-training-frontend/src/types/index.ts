export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'GUEST' | 'REGISTERED' | 'ADMIN';
  createdAt: string;
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  primaryMuscle: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  equipment: Equipment;
  difficulty: Difficulty;
  imageUrl: string | null;
  videoUrl: string | null;
}

export type MuscleGroup = 
  | 'CHEST'
  | 'BACK'
  | 'SHOULDERS'
  | 'BICEPS'
  | 'TRICEPS'
  | 'FOREARMS'
  | 'ABS'
  | 'OBLIQUES'
  | 'QUADS'
  | 'HAMSTRINGS'
  | 'GLUTES'
  | 'CALVES'
  | 'FULL_BODY';

export type Equipment =
  | 'BARBELL'
  | 'DUMBBELL'
  | 'KETTLEBELL'
  | 'MACHINE'
  | 'CABLE'
  | 'BODYWEIGHT'
  | 'RESISTANCE_BAND'
  | 'OTHER';

export type Difficulty = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
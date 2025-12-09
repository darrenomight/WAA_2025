import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { Exercise } from '@/types';

interface ExerciseDetailModalProps {
  exercise: Exercise | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExerciseDetailModal({
  exercise,
  open,
  onOpenChange,
}: ExerciseDetailModalProps) {
  if (!exercise) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{exercise.name}</DialogTitle>
          <DialogDescription>
            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">{exercise.difficulty}</Badge>
              <Badge variant="outline">{exercise.primaryMuscle}</Badge>
              <Badge variant="outline">{exercise.equipment}</Badge>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-600">{exercise.description}</p>
          </div>

          {/* Video/Image */}
          {exercise.videoUrl && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Video Demonstration</h3>
              <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                <a
                  href={exercise.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Watch on YouTube →
                </a>
              </div>
            </div>
          )}

          {/* Secondary Muscles */}
          {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Secondary Muscles</h3>
              <div className="flex gap-2 flex-wrap">
                {exercise.secondaryMuscles.map((muscle) => (
                  <Badge key={muscle} variant="outline">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Instructions</h3>
            <p className="text-gray-600 whitespace-pre-line">
              {exercise.instructions || 'No instructions available.'}
            </p>
          </div>

          {/* Coaching Points */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Coaching Points</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {exercise.coachingPoints && exercise.coachingPoints.length > 0 ? (
                exercise.coachingPoints.map((point, index) => (
                  <li key={index}>{point}</li>
                ))
              ) : (
                <li>No coaching points available.</li>
              )}
            </ul>
          </div>

          {/* Common Mistakes */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Common Mistakes</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {exercise.commonMistakes && exercise.commonMistakes.length > 0 ? (
                exercise.commonMistakes.map((mistake, index) => (
                  <li key={index}>{mistake}</li>
                ))
              ) : (
                <li>No common mistakes listed.</li>
              )}
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
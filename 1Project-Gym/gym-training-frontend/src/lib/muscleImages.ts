import type { MuscleGroup } from "@/types";

/**
 * Maps muscle group names to their corresponding image paths.
 * Images should be placed in public/images/muscles/
 */
export function getMuscleImage(muscleGroup: MuscleGroup): string {
  const muscleImageMap: Record<MuscleGroup, string> = {
    CHEST: "/images/muscles/chest.png",
    BACK: "/images/muscles/back.png",
    SHOULDERS: "/images/muscles/shoulders.png",
    BICEPS: "/images/muscles/biceps.png",
    TRICEPS: "/images/muscles/triceps.png",
    FOREARMS: "/images/muscles/biceps.png", // Fallback to biceps
    ABS: "/images/muscles/abs.png",
    OBLIQUES: "/images/muscles/abs.png", // Fallback to abs
    QUADS: "/images/muscles/quads.png",
    HAMSTRINGS: "/images/muscles/hamstrings.png",
    GLUTES: "/images/muscles/hamstrings.png", // Fallback to hamstrings
    CALVES: "/images/muscles/quads.png", // Fallback to quads
    FULL_BODY: "/images/muscles/chest.png", // Fallback to chest
  };

  return muscleImageMap[muscleGroup] || "/images/muscles/chest.png";
}

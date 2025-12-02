import { Router, Response } from "express";
import { prisma } from "../utils/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// All workout plan routes require authentication
router.use(authenticateToken);

// ==================== GET ALL USER'S WORKOUT PLANS ====================
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const plans = await prisma.workoutPlan.findMany({
      where: { userId: req.user.userId },
      include: {
        exercises: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
                primaryMuscle: true,
                equipment: true,
                imageUrl: true,
              },
            },
          },
          orderBy: { orderIndex: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: plans,
    });
  } catch (error) {
    console.error("Get workout plans error:", error);
    res.status(500).json({ error: "Server error fetching workout plans" });
  }
});

// ==================== GET SINGLE WORKOUT PLAN ====================
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const plan = await prisma.workoutPlan.findUnique({
      where: { id },
      include: {
        exercises: {
          include: {
            exercise: true,
          },
          orderBy: { orderIndex: "asc" },
        },
      },
    });

    if (!plan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    // Check ownership
    if (plan.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to view this plan" });
    }

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error("Get workout plan error:", error);
    res.status(500).json({ error: "Server error fetching workout plan" });
  }
});

// ==================== CREATE WORKOUT PLAN ====================
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Plan name is required" });
    }

    const plan = await prisma.workoutPlan.create({
      data: {
        name,
        description: description || null,
        userId: req.user.userId,
      },
    });

    res.status(201).json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error("Create workout plan error:", error);
    res.status(500).json({ error: "Server error creating workout plan" });
  }
});

// ==================== ADD EXERCISE TO PLAN ====================
router.post("/:id/exercises", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { exerciseId, targetSets, targetReps, targetDuration, restTime, notes } = req.body;

    if (!exerciseId || !targetSets) {
      return res.status(400).json({ error: "Exercise ID and target sets are required" });
    }

    // Check plan ownership
    const plan = await prisma.workoutPlan.findUnique({
      where: { id },
      include: { exercises: true },
    });

    if (!plan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    if (plan.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to modify this plan" });
    }

    // Check if exercise exists
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    // Get next order index
    const maxOrder = plan.exercises.reduce(
      (max, ex) => Math.max(max, ex.orderIndex),
      -1
    );

    const planExercise = await prisma.planExercise.create({
      data: {
        planId: id,
        exerciseId,
        orderIndex: maxOrder + 1,
        targetSets,
        targetReps: targetReps || null,
        targetDuration: targetDuration || null,
        restTime: restTime || null,
        notes: notes || null,
      },
      include: {
        exercise: true,
      },
    });

    res.status(201).json({
      success: true,
      data: planExercise,
    });
  } catch (error) {
    console.error("Add exercise to plan error:", error);
    res.status(500).json({ error: "Server error adding exercise to plan" });
  }
});

// ==================== UPDATE WORKOUT PLAN ====================
router.put("/:id", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { name, description } = req.body;

    // Check ownership
    const existingPlan = await prisma.workoutPlan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    if (existingPlan.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to modify this plan" });
    }

    const plan = await prisma.workoutPlan.update({
      where: { id },
      data: {
        name: name || existingPlan.name,
        description: description !== undefined ? description : existingPlan.description,
      },
    });

    res.json({
      success: true,
      data: plan,
    });
  } catch (error) {
    console.error("Update workout plan error:", error);
    res.status(500).json({ error: "Server error updating workout plan" });
  }
});

// ==================== REMOVE EXERCISE FROM PLAN ====================
router.delete("/:planId/exercises/:exerciseId", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { planId, exerciseId } = req.params;

    // Check plan ownership
    const plan = await prisma.workoutPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    if (plan.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to modify this plan" });
    }

    await prisma.planExercise.delete({
      where: { id: exerciseId },
    });

    res.json({
      success: true,
      message: "Exercise removed from plan",
    });
  } catch (error) {
    console.error("Remove exercise from plan error:", error);
    res.status(500).json({ error: "Server error removing exercise from plan" });
  }
});

// ==================== DELETE WORKOUT PLAN ====================
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    // Check ownership
    const plan = await prisma.workoutPlan.findUnique({
      where: { id },
    });

    if (!plan) {
      return res.status(404).json({ error: "Workout plan not found" });
    }

    if (plan.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to delete this plan" });
    }

    await prisma.workoutPlan.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Workout plan deleted successfully",
    });
  } catch (error) {
    console.error("Delete workout plan error:", error);
    res.status(500).json({ error: "Server error deleting workout plan" });
  }
});

export default router;
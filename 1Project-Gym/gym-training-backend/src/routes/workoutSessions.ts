import { Router, Response } from "express";
import { prisma } from "../utils/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// All workout session routes require authentication
router.use(authenticateToken);

// ==================== GET ALL USER'S WORKOUT SESSIONS ====================
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { limit = "10", page = "1" } = req.query;
    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const skip = (pageNum - 1) * limitNum;

    const [sessions, total] = await Promise.all([
      prisma.workoutSession.findMany({
        where: { userId: req.user.userId },
        include: {
          plan: {
            select: {
              id: true,
              name: true,
            },
          },
          sets: {
            include: {
              exercise: {
                select: {
                  id: true,
                  name: true,
                  primaryMuscle: true,
                },
              },
            },
            orderBy: { completedAt: "asc" },
          },
        },
        orderBy: { startTime: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.workoutSession.count({
        where: { userId: req.user.userId },
      }),
    ]);

    res.json({
      success: true,
      data: sessions,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get workout sessions error:", error);
    res.status(500).json({ error: "Server error fetching workout sessions" });
  }
});

// ==================== GET SINGLE WORKOUT SESSION ====================
router.get("/:id", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    const session = await prisma.workoutSession.findUnique({
      where: { id },
      include: {
        plan: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
              orderBy: { orderIndex: "asc" },
            },
          },
        },
        sets: {
          include: {
            exercise: true,
          },
          orderBy: { completedAt: "asc" },
        },
      },
    });

    if (!session) {
      return res.status(404).json({ error: "Workout session not found" });
    }

    // Check ownership
    if (session.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to view this session" });
    }

    res.json({
      success: true,
      data: session,
    });
  } catch (error) {
    console.error("Get workout session error:", error);
    res.status(500).json({ error: "Server error fetching workout session" });
  }
});

// ==================== START WORKOUT SESSION ====================
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { planId, name, notes } = req.body;

    // If planId provided, verify it exists and belongs to user
    if (planId) {
      const plan = await prisma.workoutPlan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        return res.status(404).json({ error: "Workout plan not found" });
      }

      if (plan.userId !== req.user.userId) {
        return res.status(403).json({ error: "Not authorized to use this plan" });
      }
    }

    const session = await prisma.workoutSession.create({
      data: {
        userId: req.user.userId,
        planId: planId || null,
        name: name || null,
        notes: notes || null,
        startTime: new Date(),
      },
      include: {
        plan: {
          include: {
            exercises: {
              include: {
                exercise: true,
              },
              orderBy: { orderIndex: "asc" },
            },
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      data: session,
      message: "Workout session started",
    });
  } catch (error) {
    console.error("Start workout session error:", error);
    res.status(500).json({ error: "Server error starting workout session" });
  }
});

// ==================== LOG A SET ====================
router.post("/:id/sets", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { exerciseId, setNumber, weight, reps, duration } = req.body;

    if (!exerciseId || setNumber === undefined) {
      return res.status(400).json({ error: "Exercise ID and set number are required" });
    }

    // Verify session exists and belongs to user
    const session = await prisma.workoutSession.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({ error: "Workout session not found" });
    }

    if (session.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to modify this session" });
    }

    // Verify exercise exists
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    // Create the workout set
    const workoutSet = await prisma.workoutSet.create({
      data: {
        sessionId: id,
        exerciseId,
        setNumber,
        weight: weight || null,
        reps: reps || null,
        duration: duration || null,
      },
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
            primaryMuscle: true,
          },
        },
      },
    });

    // Check if this set is a personal record
    let isPersonalRecord = false;
    const newPRs = [];

    // Get existing PRs for this exercise
    const existingPRs = await prisma.personalRecord.findMany({
      where: {
        userId: req.user.userId,
        exerciseId,
      },
    });

    // Check for ONE_REP_MAX (highest weight for 1 rep)
    if (weight && reps === 1) {
      const currentMax = existingPRs.find((pr) => pr.recordType === "ONE_REP_MAX");
      if (!currentMax || (currentMax.weight && weight > currentMax.weight)) {
        const pr = await prisma.personalRecord.create({
          data: {
            userId: req.user.userId,
            exerciseId,
            recordType: "ONE_REP_MAX",
            weight,
            reps: 1,
          },
          include: {
            exercise: {
              select: {
                name: true,
              },
            },
          },
        });
        newPRs.push(pr);
        isPersonalRecord = true;
      }
    }

    // Check for BEST_SET (highest weight × reps)
    if (weight && reps) {
      const volume = weight * reps;
      const currentBest = existingPRs.find((pr) => pr.recordType === "BEST_SET");
      const currentBestVolume = currentBest?.weight && currentBest?.reps
        ? currentBest.weight * currentBest.reps
        : 0;

      if (!currentBest || volume > currentBestVolume) {
        const pr = await prisma.personalRecord.create({
          data: {
            userId: req.user.userId,
            exerciseId,
            recordType: "BEST_SET",
            weight,
            reps,
          },
          include: {
            exercise: {
              select: {
                name: true,
              },
            },
          },
        });
        newPRs.push(pr);
        isPersonalRecord = true;
      }
    }

    // Check for LONGEST_DURATION (for time-based exercises)
    if (duration) {
      const currentLongest = existingPRs.find((pr) => pr.recordType === "LONGEST_DURATION");
      if (!currentLongest || (currentLongest.duration && duration > currentLongest.duration)) {
        const pr = await prisma.personalRecord.create({
          data: {
            userId: req.user.userId,
            exerciseId,
            recordType: "LONGEST_DURATION",
            duration,
          },
          include: {
            exercise: {
              select: {
                name: true,
              },
            },
          },
        });
        newPRs.push(pr);
        isPersonalRecord = true;
      }
    }

    res.status(201).json({
      success: true,
      data: {
        ...workoutSet,
        isPersonalRecord,
      },
      personalRecords: newPRs.length > 0 ? newPRs : undefined,
      message: isPersonalRecord
        ? `🎉 NEW PERSONAL RECORD${newPRs.length > 1 ? 'S' : ''}! 🎉`
        : undefined,
    });
  } catch (error) {
    console.error("Log set error:", error);
    res.status(500).json({ error: "Server error logging set" });
  }
});

// ==================== UPDATE A SET ====================
router.put("/sets/:setId", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { setId } = req.params;
    const { weight, reps, duration } = req.body;

    // Get the set and verify ownership through session
    const existingSet = await prisma.workoutSet.findUnique({
      where: { id: setId },
      include: {
        session: true,
      },
    });

    if (!existingSet) {
      return res.status(404).json({ error: "Set not found" });
    }

    if (existingSet.session.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to modify this set" });
    }

    const updatedSet = await prisma.workoutSet.update({
      where: { id: setId },
      data: {
        weight: weight !== undefined ? weight : existingSet.weight,
        reps: reps !== undefined ? reps : existingSet.reps,
        duration: duration !== undefined ? duration : existingSet.duration,
      },
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: updatedSet,
    });
  } catch (error) {
    console.error("Update set error:", error);
    res.status(500).json({ error: "Server error updating set" });
  }
});

// ==================== DELETE A SET ====================
router.delete("/sets/:setId", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { setId } = req.params;

    // Get the set and verify ownership through session
    const existingSet = await prisma.workoutSet.findUnique({
      where: { id: setId },
      include: {
        session: true,
      },
    });

    if (!existingSet) {
      return res.status(404).json({ error: "Set not found" });
    }

    if (existingSet.session.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to delete this set" });
    }

    await prisma.workoutSet.delete({
      where: { id: setId },
    });

    res.json({
      success: true,
      message: "Set deleted successfully",
    });
  } catch (error) {
    console.error("Delete set error:", error);
    res.status(500).json({ error: "Server error deleting set" });
  }
});

// ==================== COMPLETE WORKOUT SESSION ====================
router.put("/:id/complete", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;
    const { notes } = req.body;

    // Verify session exists and belongs to user
    const session = await prisma.workoutSession.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({ error: "Workout session not found" });
    }

    if (session.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to modify this session" });
    }

    if (session.endTime) {
      return res.status(400).json({ error: "Session already completed" });
    }

    const completedSession = await prisma.workoutSession.update({
      where: { id },
      data: {
        endTime: new Date(),
        notes: notes !== undefined ? notes : session.notes,
      },
      include: {
        sets: {
          include: {
            exercise: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      data: completedSession,
      message: "Workout session completed",
    });
  } catch (error) {
    console.error("Complete session error:", error);
    res.status(500).json({ error: "Server error completing session" });
  }
});

// ==================== DELETE WORKOUT SESSION ====================
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    // Verify session exists and belongs to user
    const session = await prisma.workoutSession.findUnique({
      where: { id },
    });

    if (!session) {
      return res.status(404).json({ error: "Workout session not found" });
    }

    if (session.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to delete this session" });
    }

    await prisma.workoutSession.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Workout session deleted successfully",
    });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ error: "Server error deleting session" });
  }
});

export default router;
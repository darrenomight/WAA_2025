import { Router, Response } from "express";
import { prisma } from "../utils/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// All PR routes require authentication
router.use(authenticateToken);

// ==================== GET ALL USER'S PERSONAL RECORDS ====================
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const prs = await prisma.personalRecord.findMany({
      where: { userId: req.user.userId },
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
      orderBy: { achievedAt: "desc" },
    });

    // Group PRs by exercise
    const groupedPRs = prs.reduce((acc: any, pr) => {
      const exerciseId = pr.exerciseId;
      if (!acc[exerciseId]) {
        acc[exerciseId] = {
          exercise: pr.exercise,
          records: [],
        };
      }
      acc[exerciseId].records.push({
        id: pr.id,
        recordType: pr.recordType,
        weight: pr.weight,
        reps: pr.reps,
        duration: pr.duration,
        achievedAt: pr.achievedAt,
      });
      return acc;
    }, {});

    res.json({
      success: true,
      data: Object.values(groupedPRs),
      total: prs.length,
    });
  } catch (error) {
    console.error("Get personal records error:", error);
    res.status(500).json({ error: "Server error fetching personal records" });
  }
});

// ==================== GET PRS FOR SPECIFIC EXERCISE ====================
router.get("/exercise/:exerciseId", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { exerciseId } = req.params;

    const prs = await prisma.personalRecord.findMany({
      where: {
        userId: req.user.userId,
        exerciseId,
      },
      include: {
        exercise: {
          select: {
            id: true,
            name: true,
            primaryMuscle: true,
            equipment: true,
          },
        },
      },
      orderBy: { achievedAt: "desc" },
    });

    res.json({
      success: true,
      data: prs,
    });
  } catch (error) {
    console.error("Get exercise PRs error:", error);
    res.status(500).json({ error: "Server error fetching exercise PRs" });
  }
});

// ==================== CHECK AND CREATE PR ====================
router.post("/check", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { exerciseId, weight, reps, duration } = req.body;

    if (!exerciseId) {
      return res.status(400).json({ error: "Exercise ID is required" });
    }

    // Get existing PRs for this exercise
    const existingPRs = await prisma.personalRecord.findMany({
      where: {
        userId: req.user.userId,
        exerciseId,
      },
    });

    const newPRs = [];

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
      }
    }

    // Check for BEST_VOLUME (total weight × reps across workout)
    // This would require tracking across entire session, skip for now

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
      }
    }

    if (newPRs.length > 0) {
      res.json({
        success: true,
        isPR: true,
        data: newPRs,
        message: `Congratulations! New personal record${newPRs.length > 1 ? 's' : ''}!`,
      });
    } else {
      res.json({
        success: true,
        isPR: false,
        message: "Keep pushing! No new PRs this time.",
      });
    }
  } catch (error) {
    console.error("Check PR error:", error);
    res.status(500).json({ error: "Server error checking personal records" });
  }
});

// ==================== MANUALLY CREATE PR ====================
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { exerciseId, recordType, weight, reps, duration } = req.body;

    if (!exerciseId || !recordType) {
      return res.status(400).json({ error: "Exercise ID and record type are required" });
    }

    // Verify exercise exists
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });

    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    const pr = await prisma.personalRecord.create({
      data: {
        userId: req.user.userId,
        exerciseId,
        recordType,
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

    res.status(201).json({
      success: true,
      data: pr,
    });
  } catch (error) {
    console.error("Create PR error:", error);
    res.status(500).json({ error: "Server error creating personal record" });
  }
});

// ==================== DELETE PR ====================
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { id } = req.params;

    // Verify PR exists and belongs to user
    const pr = await prisma.personalRecord.findUnique({
      where: { id },
    });

    if (!pr) {
      return res.status(404).json({ error: "Personal record not found" });
    }

    if (pr.userId !== req.user.userId) {
      return res.status(403).json({ error: "Not authorized to delete this record" });
    }

    await prisma.personalRecord.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Personal record deleted successfully",
    });
  } catch (error) {
    console.error("Delete PR error:", error);
    res.status(500).json({ error: "Server error deleting personal record" });
  }
});

export default router;
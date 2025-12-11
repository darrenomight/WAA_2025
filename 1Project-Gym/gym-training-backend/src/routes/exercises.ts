import { Router, Request, Response } from "express";
import { prisma } from "../utils/prisma";
import { authenticateToken, AuthRequest } from "../middleware/auth";

const router = Router();

// ==================== GET ALL EXERCISES ====================
// Public route - anyone can view exercises
router.get("/", async (req: Request, res: Response) => {
  try {
    const { 
      page = "1", 
      limit = "20",
      muscle,
      equipment,
      difficulty,
      search
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    // Build filter object
    const where: any = {};

    if (muscle) {
      where.primaryMuscle = muscle;
    }

    if (equipment) {
      where.equipment = equipment;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: "insensitive" } },
        { description: { contains: search as string, mode: "insensitive" } },
      ];
    }

    // Get exercises with pagination
    const [exercises, total] = await Promise.all([
      prisma.exercise.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          description: true,
          instructions: true,
          primaryMuscle: true,
          secondaryMuscles: true,
          equipment: true,
          difficulty: true,
          movementType: true,
          imageUrl: true,
          videoUrl: true,
          coachingPoints: true,
          commonMistakes: true,
        },
      }),
      prisma.exercise.count({ where }),
    ]);

    res.json({
      success: true,
      data: exercises,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error("Get exercises error:", error);
    res.status(500).json({ error: "Server error fetching exercises" });
  }
});

// ==================== SEARCH EXERCISES ====================
router.get("/search", async (req: Request, res: Response) => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Search query is required" });
    }

    const exercises = await prisma.exercise.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { instructions: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 20,
      select: {
        id: true,
        name: true,
        description: true,
        primaryMuscle: true,
        equipment: true,
        difficulty: true,
        imageUrl: true,
      },
    });

    res.json({
      success: true,
      data: exercises,
      count: exercises.length,
    });
  } catch (error) {
    console.error("Search exercises error:", error);
    res.status(500).json({ error: "Server error searching exercises" });
  }
});

// ==================== GET SINGLE EXERCISE ====================
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const exercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    res.json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    console.error("Get exercise error:", error);
    res.status(500).json({ error: "Server error fetching exercise" });
  }
});

// ==================== CREATE EXERCISE (Protected - Admin only for now) ====================
router.post("/", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const {
      name,
      description,
      instructions,
      videoUrl,
      imageUrl,
      primaryMuscle,
      secondaryMuscles,
      equipment,
      difficulty,
      movementType,
      coachingPoints,
      commonMistakes,
    } = req.body;

    // Validation
    if (!name || !description || !instructions || !primaryMuscle || !equipment || !difficulty) {
      return res.status(400).json({ 
        error: "Missing required fields: name, description, instructions, primaryMuscle, equipment, difficulty" 
      });
    }

    const exercise = await prisma.exercise.create({
      data: {
        name,
        description,
        instructions,
        videoUrl: videoUrl || null,
        imageUrl: imageUrl || null,
        primaryMuscle,
        secondaryMuscles: secondaryMuscles || [],
        equipment,
        difficulty,
        movementType: movementType || "STRENGTH",
        coachingPoints: coachingPoints || [],
        commonMistakes: commonMistakes || [],
      },
    });

    res.status(201).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    console.error("Create exercise error:", error);
    res.status(500).json({ error: "Server error creating exercise" });
  }
});

// ==================== UPDATE EXERCISE (Protected - Admin only) ====================
router.put("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if exercise exists
    const existingExercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!existingExercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    const exercise = await prisma.exercise.update({
      where: { id },
      data: req.body,
    });

    res.json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    console.error("Update exercise error:", error);
    res.status(500).json({ error: "Server error updating exercise" });
  }
});

// ==================== DELETE EXERCISE (Protected - Admin only) ====================
router.delete("/:id", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Check if exercise exists
    const existingExercise = await prisma.exercise.findUnique({
      where: { id },
    });

    if (!existingExercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    await prisma.exercise.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: "Exercise deleted successfully",
    });
  } catch (error) {
    console.error("Delete exercise error:", error);
    res.status(500).json({ error: "Server error deleting exercise" });
  }
});

export default router;
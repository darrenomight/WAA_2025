import { PrismaClient, MuscleGroup, Equipment, Difficulty, MovementType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Clear existing exercises (optional - remove if you want to keep existing data)
  await prisma.exercise.deleteMany({});
  console.log("🧹 Cleared existing exercises");

  // Seed 20 exercises
  const exercises = [
    // ==================== CHEST (3) ====================
    {
      name: "Barbell Bench Press",
      description: "A compound exercise that primarily targets the chest, shoulders, and triceps.",
      instructions: "Lie on a flat bench with feet flat on the floor. Grip the bar slightly wider than shoulder width. Lower the bar to mid-chest, then press back up to starting position. Keep your shoulder blades retracted throughout the movement.",
      videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",
      imageUrl: "/images/exercises/bench-press.jpg",
      primaryMuscle: MuscleGroup.CHEST,
      secondaryMuscles: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.INTERMEDIATE,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep your feet planted firmly on the ground",
        "Maintain a slight arch in your lower back",
        "Lower the bar in a controlled manner",
        "Press through your chest, not your arms"
      ],
      commonMistakes: [
        "Bouncing the bar off the chest",
        "Lifting hips off the bench",
        "Flaring elbows too wide",
        "Not using full range of motion"
      ]
    },
    {
      name: "Incline Dumbbell Press",
      description: "Targets the upper portion of the chest with dumbbells on an incline bench.",
      instructions: "Set bench to 30-45 degree incline. Start with dumbbells at shoulder height, palms facing forward. Press dumbbells up until arms are extended, then lower back down with control.",
      videoUrl: "https://www.youtube.com/watch?v=8iPEnn-ltC8",
      imageUrl: "/images/exercises/incline-press.jpg",
      primaryMuscle: MuscleGroup.CHEST,
      secondaryMuscles: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS],
      equipment: Equipment.DUMBBELL,
      difficulty: Difficulty.INTERMEDIATE,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep your back flat against the bench",
        "Don't lock out elbows at the top",
        "Control the descent",
        "Press in a slight arc toward the center"
      ],
      commonMistakes: [
        "Setting incline too steep (over 45 degrees)",
        "Using momentum to lift",
        "Not going through full range of motion",
        "Letting dumbbells drift too far apart"
      ]
    },
    {
      name: "Push-ups",
      description: "Classic bodyweight exercise for chest, shoulders, and triceps.",
      instructions: "Start in plank position with hands slightly wider than shoulders. Lower your body until chest nearly touches the ground, keeping elbows at 45-degree angle. Push back up to starting position.",
      videoUrl: "https://www.youtube.com/watch?v=IODxDxX7oi4",
      imageUrl: "/images/exercises/pushups.jpg",
      primaryMuscle: MuscleGroup.CHEST,
      secondaryMuscles: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS, MuscleGroup.ABS],
      equipment: Equipment.BODYWEIGHT,
      difficulty: Difficulty.BEGINNER,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep your body in a straight line",
        "Engage your core throughout",
        "Breathe in on the way down, out on the way up",
        "Go as low as possible while maintaining form"
      ],
      commonMistakes: [
        "Sagging hips",
        "Flaring elbows out too wide",
        "Not going low enough",
        "Looking up instead of keeping neck neutral"
      ]
    },

    // ==================== BACK (3) ====================
    {
      name: "Deadlift",
      description: "The king of compound exercises, working the entire posterior chain.",
      instructions: "Stand with feet hip-width apart, bar over mid-foot. Bend down and grip bar just outside legs. Keep back straight, chest up. Drive through heels and pull bar up along legs until standing tall. Lower with control.",
      videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",
      imageUrl: "/images/exercises/deadlift.jpg",
      primaryMuscle: MuscleGroup.BACK,
      secondaryMuscles: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS, MuscleGroup.QUADS],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.ADVANCED,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep the bar close to your body",
        "Maintain neutral spine throughout",
        "Drive through your heels",
        "Engage your lats by pulling the bar into you"
      ],
      commonMistakes: [
        "Rounding the back",
        "Starting with hips too high or too low",
        "Bar drifting away from body",
        "Hyperextending at the top"
      ]
    },
    {
      name: "Pull-ups",
      description: "Compound bodyweight exercise primarily targeting the lats and upper back.",
      instructions: "Hang from bar with hands slightly wider than shoulders, palms facing away. Pull yourself up until chin is over the bar. Lower with control back to dead hang.",
      videoUrl: "https://www.youtube.com/watch?v=eGo4IYlbE5g",
      imageUrl: "/images/exercises/pullups.jpg",
      primaryMuscle: MuscleGroup.BACK,
      secondaryMuscles: [MuscleGroup.BICEPS, MuscleGroup.SHOULDERS],
      equipment: Equipment.BODYWEIGHT,
      difficulty: Difficulty.INTERMEDIATE,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Start from a dead hang position",
        "Pull with your back, not your arms",
        "Lead with your chest",
        "Control the descent"
      ],
      commonMistakes: [
        "Using momentum (kipping)",
        "Not achieving full range of motion",
        "Shrugging shoulders",
        "Pulling with arms instead of back"
      ]
    },
    {
      name: "Bent Over Barbell Row",
      description: "Compound movement targeting the middle back, lats, and rhomboids.",
      instructions: "Bend forward at hips with slight knee bend, back flat. Grip bar with hands shoulder-width apart. Pull bar to lower chest, squeezing shoulder blades together. Lower with control.",
      videoUrl: "https://www.youtube.com/watch?v=FWJR5Ve8bnQ",
      imageUrl: "/images/exercises/barbell-row.jpg",
      primaryMuscle: MuscleGroup.BACK,
      secondaryMuscles: [MuscleGroup.BICEPS, MuscleGroup.SHOULDERS],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.INTERMEDIATE,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep your back flat and core braced",
        "Pull the bar to your lower chest/upper abs",
        "Keep elbows close to body",
        "Squeeze shoulder blades at the top"
      ],
      commonMistakes: [
        "Rounding the back",
        "Using too much momentum",
        "Standing too upright",
        "Not pulling high enough"
      ]
    },

    // ==================== LEGS (4) ====================
    {
      name: "Barbell Back Squat",
      description: "The king of leg exercises, targeting quads, glutes, and hamstrings.",
      instructions: "Place bar on upper back. Stand with feet shoulder-width apart. Descend by bending knees and hips, keeping chest up. Go as low as comfortable while maintaining form. Drive through heels to stand.",
      videoUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8",
      imageUrl: "/images/exercises/squat.jpg",
      primaryMuscle: MuscleGroup.QUADS,
      secondaryMuscles: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS, MuscleGroup.ABS],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.INTERMEDIATE,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep chest up and back straight",
        "Knees should track over toes",
        "Drive through your heels",
        "Breathe in on descent, out on ascent"
      ],
      commonMistakes: [
        "Knees caving inward",
        "Leaning too far forward",
        "Not going deep enough",
        "Rising up on toes"
      ]
    },
    {
      name: "Leg Press",
      description: "Machine-based compound exercise for overall leg development.",
      instructions: "Sit in machine with back against pad. Place feet shoulder-width apart on platform. Lower weight by bending knees until 90 degrees or slightly below. Press back up without locking knees.",
      videoUrl: "https://www.youtube.com/watch?v=IZxyjW7MPJQ",
      imageUrl: "/images/exercises/leg-press.jpg",
      primaryMuscle: MuscleGroup.QUADS,
      secondaryMuscles: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
      equipment: Equipment.MACHINE,
      difficulty: Difficulty.BEGINNER,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep your back flat against the pad",
        "Don't lock out your knees at the top",
        "Control the weight on the way down",
        "Keep feet flat on the platform"
      ],
      commonMistakes: [
        "Lifting hips off the seat",
        "Locking knees at the top",
        "Going too deep and losing back position",
        "Using partial range of motion"
      ]
    },
    {
      name: "Walking Lunges",
      description: "Dynamic leg exercise targeting quads, glutes, and balance.",
      instructions: "Stand tall holding dumbbells. Step forward with one leg, lowering hips until both knees are bent at 90 degrees. Push through front heel to step forward with back leg into next lunge.",
      videoUrl: "https://www.youtube.com/watch?v=L8fvypPrzzs",
      imageUrl: "/images/exercises/lunges.jpg",
      primaryMuscle: MuscleGroup.QUADS,
      secondaryMuscles: [MuscleGroup.GLUTES, MuscleGroup.HAMSTRINGS],
      equipment: Equipment.DUMBBELL,
      difficulty: Difficulty.BEGINNER,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep torso upright",
        "Don't let front knee go past toes",
        "Back knee should nearly touch ground",
        "Take controlled steps"
      ],
      commonMistakes: [
        "Steps too short or too long",
        "Leaning too far forward",
        "Not lowering back knee enough",
        "Poor balance and wobbling"
      ]
    },
    {
      name: "Romanian Deadlift",
      description: "Hip-hinge movement emphasizing hamstrings and glutes.",
      instructions: "Stand holding barbell at hip level. Keeping legs relatively straight, push hips back and lower bar down front of legs. Feel stretch in hamstrings, then drive hips forward to return to start.",
      videoUrl: "https://www.youtube.com/watch?v=2SHsk9AzdjA",
      imageUrl: "/images/exercises/rdl.jpg",
      primaryMuscle: MuscleGroup.HAMSTRINGS,
      secondaryMuscles: [MuscleGroup.GLUTES, MuscleGroup.BACK],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.INTERMEDIATE,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Maintain slight bend in knees",
        "Keep bar close to legs",
        "Push hips back, not down",
        "Feel the stretch in hamstrings"
      ],
      commonMistakes: [
        "Squatting instead of hinging",
        "Rounding the back",
        "Bar drifting away from body",
        "Bending knees too much"
      ]
    },

    // ==================== SHOULDERS (3) ====================
    {
      name: "Overhead Press",
      description: "Compound pressing movement for shoulders and upper body strength.",
      instructions: "Stand with bar at shoulder height. Press bar straight overhead until arms are extended. Lower with control back to shoulders. Keep core tight throughout.",
      videoUrl: "https://www.youtube.com/watch?v=2yjwXTZQDDI",
      imageUrl: "/images/exercises/ohp.jpg",
      primaryMuscle: MuscleGroup.SHOULDERS,
      secondaryMuscles: [MuscleGroup.TRICEPS, MuscleGroup.ABS],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.INTERMEDIATE,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep your core braced",
        "Press the bar in a straight line",
        "Tuck your chin to let bar pass",
        "Squeeze glutes to prevent arching"
      ],
      commonMistakes: [
        "Excessive back arch",
        "Pressing forward instead of straight up",
        "Not achieving full lockout",
        "Using leg drive (unless doing push press)"
      ]
    },
    {
      name: "Lateral Raises",
      description: "Isolation exercise targeting the side deltoids.",
      instructions: "Stand holding dumbbells at sides. Raise arms out to sides until parallel to ground, leading with elbows. Slowly lower back down.",
      videoUrl: "https://www.youtube.com/watch?v=3VcKaXpzqRo",
      imageUrl: "/images/exercises/lateral-raise.jpg",
      primaryMuscle: MuscleGroup.SHOULDERS,
      secondaryMuscles: [],
      equipment: Equipment.DUMBBELL,
      difficulty: Difficulty.BEGINNER,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Lead with your elbows, not hands",
        "Keep slight bend in elbows",
        "Don't use momentum",
        "Control on the way down"
      ],
      commonMistakes: [
        "Using too much weight",
        "Swinging the weights",
        "Shrugging shoulders",
        "Raising arms too high"
      ]
    },
    {
      name: "Face Pulls",
      description: "Cable exercise for rear deltoids and upper back health.",
      instructions: "Set cable at face height with rope attachment. Pull rope toward face, separating hands and pulling rope apart. Squeeze shoulder blades together. Return with control.",
      videoUrl: "https://www.youtube.com/watch?v=rep-qVOkqgk",
      imageUrl: "/images/exercises/face-pulls.jpg",
      primaryMuscle: MuscleGroup.SHOULDERS,
      secondaryMuscles: [MuscleGroup.BACK],
      equipment: Equipment.CABLE,
      difficulty: Difficulty.BEGINNER,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Pull rope apart at the end of the movement",
        "Keep elbows high",
        "Focus on rear delts and upper back",
        "Don't let shoulders roll forward"
      ],
      commonMistakes: [
        "Using too much weight",
        "Pulling too low",
        "Not externally rotating shoulders",
        "Using momentum"
      ]
    },

    // ==================== ARMS (4) ====================
    {
      name: "Barbell Bicep Curls",
      description: "Classic arm builder targeting the biceps.",
      instructions: "Stand holding barbell with underhand grip at hip level. Curl bar up toward shoulders, keeping elbows stationary. Squeeze at top, then lower with control.",
      videoUrl: "https://www.youtube.com/watch?v=kwG2ipFRgfo",
      imageUrl: "/images/exercises/bicep-curl.jpg",
      primaryMuscle: MuscleGroup.BICEPS,
      secondaryMuscles: [MuscleGroup.FOREARMS],
      equipment: Equipment.BARBELL,
      difficulty: Difficulty.BEGINNER,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep elbows locked at your sides",
        "Don't swing or use momentum",
        "Full extension at the bottom",
        "Squeeze at the top"
      ],
      commonMistakes: [
        "Swinging the body",
        "Moving elbows forward",
        "Not fully extending arms",
        "Using too much weight"
      ]
    },
    {
      name: "Tricep Dips",
      description: "Bodyweight exercise for triceps and chest development.",
      instructions: "Position hands on parallel bars. Lower body by bending elbows until upper arms are parallel to ground. Press back up to starting position.",
      videoUrl: "https://www.youtube.com/watch?v=2z8JmcrW-As",
      imageUrl: "/images/exercises/dips.jpg",
      primaryMuscle: MuscleGroup.TRICEPS,
      secondaryMuscles: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS],
      equipment: Equipment.BODYWEIGHT,
      difficulty: Difficulty.INTERMEDIATE,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep body upright for triceps emphasis",
        "Lower until elbows at 90 degrees",
        "Don't flare elbows out",
        "Control the descent"
      ],
      commonMistakes: [
        "Going too deep (shoulder strain)",
        "Leaning too far forward",
        "Flaring elbows",
        "Using momentum"
      ]
    },
    {
      name: "Hammer Curls",
      description: "Dumbbell curl variation emphasizing brachialis and forearms.",
      instructions: "Stand holding dumbbells with neutral grip (palms facing each other). Curl weights up keeping palms facing in. Lower with control.",
      videoUrl: "https://www.youtube.com/watch?v=zC3nLlEvin4",
      imageUrl: "/images/exercises/hammer-curl.jpg",
      primaryMuscle: MuscleGroup.BICEPS,
      secondaryMuscles: [MuscleGroup.FOREARMS],
      equipment: Equipment.DUMBBELL,
      difficulty: Difficulty.BEGINNER,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep palms facing each other throughout",
        "Elbows stay at sides",
        "No swinging",
        "Squeeze at the top"
      ],
      commonMistakes: [
        "Rotating wrists during movement",
        "Using momentum",
        "Moving elbows",
        "Incomplete range of motion"
      ]
    },
    {
      name: "Cable Tricep Pushdown",
      description: "Cable isolation exercise for triceps.",
      instructions: "Stand at cable machine with rope or bar attachment. Push down by extending elbows fully. Return with control, keeping upper arms stationary.",
      videoUrl: "https://www.youtube.com/watch?v=2-LAMcpzODU",
      imageUrl: "/images/exercises/pushdown.jpg",
      primaryMuscle: MuscleGroup.TRICEPS,
      secondaryMuscles: [],
      equipment: Equipment.CABLE,
      difficulty: Difficulty.BEGINNER,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep elbows pinned at sides",
        "Full extension at bottom",
        "Control on the way up",
        "Don't lean into the movement"
      ],
      commonMistakes: [
        "Moving elbows away from body",
        "Using body weight to push",
        "Not fully extending",
        "Going too heavy"
      ]
    },

    // ==================== CORE (3) ====================
    {
      name: "Plank",
      description: "Isometric core exercise for abs and overall stability.",
      instructions: "Start in forearm plank position, elbows under shoulders. Keep body in straight line from head to heels. Hold position, engaging core throughout.",
      videoUrl: "https://www.youtube.com/watch?v=pSHjTRCQxIw",
      imageUrl: "/images/exercises/plank.jpg",
      primaryMuscle: MuscleGroup.ABS,
      secondaryMuscles: [MuscleGroup.SHOULDERS, MuscleGroup.GLUTES],
      equipment: Equipment.BODYWEIGHT,
      difficulty: Difficulty.BEGINNER,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep hips level with shoulders",
        "Engage your glutes",
        "Breathe normally",
        "Keep neck neutral"
      ],
      commonMistakes: [
        "Sagging hips",
        "Raising hips too high",
        "Holding breath",
        "Looking up instead of down"
      ]
    },
    {
      name: "Russian Twists",
      description: "Rotational core exercise targeting obliques.",
      instructions: "Sit on ground with knees bent, lean back slightly. Hold weight at chest. Rotate torso side to side, touching weight to ground beside you.",
      videoUrl: "https://www.youtube.com/watch?v=wkD8rjkodUI",
      imageUrl: "/images/exercises/russian-twist.jpg",
      primaryMuscle: MuscleGroup.OBLIQUES,
      secondaryMuscles: [MuscleGroup.ABS],
      equipment: Equipment.BODYWEIGHT,
      difficulty: Difficulty.BEGINNER,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Keep core engaged throughout",
        "Rotate from torso, not arms",
        "Keep chest up",
        "Control the movement"
      ],
      commonMistakes: [
        "Using too much momentum",
        "Rounding the back",
        "Moving only arms",
        "Not rotating fully"
      ]
    },
    {
      name: "Hanging Leg Raises",
      description: "Advanced ab exercise requiring grip strength and core control.",
      instructions: "Hang from pull-up bar with straight arms. Keeping legs straight, raise them up until parallel to ground. Lower with control.",
      videoUrl: "https://www.youtube.com/watch?v=Pr1ieGZ5atk",
      imageUrl: "/images/exercises/leg-raise.jpg",
      primaryMuscle: MuscleGroup.ABS,
      secondaryMuscles: [MuscleGroup.FOREARMS],
      equipment: Equipment.BODYWEIGHT,
      difficulty: Difficulty.INTERMEDIATE,
      movementType: MovementType.STRENGTH,
      coachingPoints: [
        "Don't swing or use momentum",
        "Keep legs straight (or bent for easier version)",
        "Control the descent",
        "Engage core throughout"
      ],
      commonMistakes: [
        "Swinging body",
        "Using momentum",
        "Not raising legs high enough",
        "Dropping legs too fast"
      ]
    },
  ];

  // Insert exercises
  for (const exercise of exercises) {
    await prisma.exercise.create({
      data: exercise,
    });
  }

  console.log(`✅ Seeded ${exercises.length} exercises`);
  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
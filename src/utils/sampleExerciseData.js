// src/utils/sampleExerciseData.js

const sampleExercises = [
    {
      name: "Barbell Bench Press",
      primaryMuscleGroup: "Chest",
      secondaryMuscleGroups: ["Triceps", "Shoulders"],
      equipment: "Barbell",
      difficulty: "Beginner",
      description: "A compound exercise that targets the chest, shoulders, and triceps.",
      instructions: [
        "Lie on a flat bench with your feet planted firmly on the ground.",
        "Grip the barbell slightly wider than shoulder-width apart.",
        "Unrack the barbell and lower it to your mid-chest.",
        "Press the barbell back up to the starting position.",
        "Repeat for the desired number of repetitions."
      ],
      tips: [
        "Keep your wrists straight throughout the movement.",
        "Maintain a slight arch in your lower back.",
        "Keep your feet planted and drive through your legs for stability."
      ]
    },
    {
      name: "Barbell Back Squat",
      primaryMuscleGroup: "Quadriceps",
      secondaryMuscleGroups: ["Glutes", "Hamstrings", "Lower Back"],
      equipment: "Barbell",
      difficulty: "Beginner",
      description: "A compound lower body exercise that primarily targets the quadriceps, hamstrings, and glutes.",
      instructions: [
        "Position the barbell on your upper back, resting on your traps.",
        "Stand with feet shoulder-width apart, toes slightly pointed out.",
        "Brace your core and maintain a neutral spine.",
        "Bend at the hips and knees to lower your body down.",
        "Lower until your thighs are parallel to the ground or slightly below.",
        "Drive through your heels to return to the starting position."
      ],
      tips: [
        "Keep your chest up and back flat throughout the movement.",
        "Push your knees out in line with your toes.",
        "Maintain a neutral head position by looking straight ahead or slightly down."
      ]
    },
    {
      name: "Conventional Deadlift",
      primaryMuscleGroup: "Lower Back",
      secondaryMuscleGroups: ["Hamstrings", "Glutes", "Traps", "Forearms"],
      equipment: "Barbell",
      difficulty: "Intermediate",
      description: "A compound exercise that targets multiple muscle groups including the back, glutes, and hamstrings.",
      instructions: [
        "Stand with feet hip-width apart, with the barbell over your mid-foot.",
        "Bend at the hips and knees, gripping the bar just outside your legs.",
        "Keep your back flat, chest up, and shoulders down and back.",
        "Drive through your heels and stand up, keeping the bar close to your body.",
        "Return the weight to the ground with control by hinging at the hips."
      ],
      tips: [
        "Engage your lats before initiating the pull.",
        "Think about pushing the floor away rather than pulling the weight up.",
        "Keep the bar close to your body throughout the entire movement.",
        "Avoid rounding your lower back."
      ]
    },
    {
      name: "Pull-Up",
      primaryMuscleGroup: "Back",
      secondaryMuscleGroups: ["Biceps", "Shoulders"],
      equipment: "Pull-Up Bar",
      difficulty: "Intermediate",
      description: "A bodyweight exercise that targets the back, biceps, and shoulders.",
      instructions: [
        "Hang from a pull-up bar with hands slightly wider than shoulder-width apart.",
        "Engage your core and pull your shoulder blades down and back.",
        "Pull your body up until your chin clears the bar.",
        "Lower yourself with control back to the starting position."
      ],
      tips: [
        "Initiate the movement by pulling your shoulder blades down and back.",
        "Keep your core engaged throughout the movement.",
        "Avoid swinging or using momentum to complete the rep."
      ]
    },
    {
      name: "Dumbbell Overhead Press",
      primaryMuscleGroup: "Shoulders",
      secondaryMuscleGroups: ["Triceps", "Upper Chest"],
      equipment: "Dumbbells",
      difficulty: "Beginner",
      description: "An upper body exercise that primarily targets the shoulders and triceps.",
      instructions: [
        "Sit or stand holding a dumbbell in each hand at shoulder height.",
        "Keep your core tight and maintain a neutral spine.",
        "Press the dumbbells overhead until your arms are fully extended.",
        "Lower the dumbbells back to shoulder height with control."
      ],
      tips: [
        "Avoid arching your lower back during the movement.",
        "Keep your shoulders down and away from your ears.",
        "Maintain a neutral wrist position throughout the exercise."
      ]
    },
    {
      name: "Romanian Deadlift",
      primaryMuscleGroup: "Hamstrings",
      secondaryMuscleGroups: ["Glutes", "Lower Back"],
      equipment: "Barbell",
      difficulty: "Intermediate",
      description: "A hip-hinge movement that targets the posterior chain, particularly the hamstrings and glutes.",
      instructions: [
        "Stand with feet hip-width apart, holding a barbell in front of your thighs.",
        "Keep a slight bend in your knees throughout the movement.",
        "Hinge at your hips and lower the barbell toward the ground.",
        "Keep your back flat and shoulders pulled back.",
        "Lower until you feel a stretch in your hamstrings, typically just below the knees.",
        "Drive your hips forward to return to the starting position."
      ],
      tips: [
        "Focus on hinging at the hips rather than squatting.",
        "Keep the barbell close to your body throughout the movement.",
        "Maintain a neutral spine and avoid rounding your back."
      ]
    },
    {
      name: "Barbell Row",
      primaryMuscleGroup: "Back",
      secondaryMuscleGroups: ["Biceps", "Rear Deltoids"],
      equipment: "Barbell",
      difficulty: "Beginner",
      description: "A compound pulling exercise that targets the back, biceps, and rear deltoids.",
      instructions: [
        "Stand with feet shoulder-width apart, holding a barbell with an overhand grip.",
        "Hinge at the hips until your torso is nearly parallel to the ground.",
        "Keep your back flat and core engaged.",
        "Pull the barbell toward your lower ribcage by driving your elbows back.",
        "Lower the barbell with control and repeat."
      ],
      tips: [
        "Keep your shoulder blades pulled together throughout the movement.",
        "Avoid using momentum or jerking the weight up.",
        "Maintain a neutral neck position by looking at the ground a few feet in front of you."
      ]
    },
    {
      name: "Dumbbell Bicep Curl",
      primaryMuscleGroup: "Biceps",
      secondaryMuscleGroups: ["Forearms"],
      equipment: "Dumbbells",
      difficulty: "Beginner",
      description: "An isolation exercise that targets the biceps.",
      instructions: [
        "Stand with feet shoulder-width apart, holding a dumbbell in each hand.",
        "Keep your elbows close to your sides throughout the movement.",
        "Curl the dumbbells up toward your shoulders, rotating your palms upward.",
        "Squeeze your biceps at the top of the movement.",
        "Lower the dumbbells with control back to the starting position."
      ],
      tips: [
        "Keep your upper arms stationary throughout the movement.",
        "Avoid swinging or using momentum to lift the weights.",
        "Focus on a full range of motion for maximum bicep activation."
      ]
    },
    {
      name: "Tricep Dip",
      primaryMuscleGroup: "Triceps",
      secondaryMuscleGroups: ["Chest", "Shoulders"],
      equipment: "Dip Bars",
      difficulty: "Intermediate",
      description: "A compound exercise that primarily targets the triceps, with secondary emphasis on the chest and shoulders.",
      instructions: [
        "Grip the parallel bars with your palms facing inward.",
        "Support your weight with your arms fully extended.",
        "Lower your body by bending your elbows until they reach a 90-degree angle.",
        "Push yourself back up to the starting position by extending your elbows."
      ],
      tips: [
        "Keep your elbows pointing backward, not flaring outward.",
        "Maintain an upright torso for more tricep emphasis, or lean forward for more chest engagement.",
        "Control the descent to prevent injury to your shoulders."
      ]
    },
    {
      name: "Leg Press",
      primaryMuscleGroup: "Quadriceps",
      secondaryMuscleGroups: ["Glutes", "Hamstrings"],
      equipment: "Leg Press Machine",
      difficulty: "Beginner",
      description: "A machine-based compound exercise that targets the quadriceps, hamstrings, and glutes.",
      instructions: [
        "Sit in the leg press machine with your back against the pad and feet on the platform.",
        "Position your feet shoulder-width apart.",
        "Release the safety handles and lower the platform by bending your knees.",
        "Lower until your knees form approximately a 90-degree angle.",
        "Push through your heels to extend your legs back to the starting position."
      ],
      tips: [
        "Avoid locking out your knees at the top of the movement.",
        "Keep your knees in line with your toes throughout the exercise.",
        "Control the weight during both the lowering and lifting phases."
      ]
    }
  ];
  
  export default sampleExercises;
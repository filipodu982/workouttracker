// src/utils/newExercises.js

const newExercises = [
    {
        name: "Barbell Front Squat",
        primaryMuscleGroup: "Quadriceps",
        secondaryMuscleGroups: ["Core", "Glutes", "Upper Back"],
        equipment: "Barbell",
        difficulty: "Intermediate",
        description: "A compound lower body exercise that emphasizes the quadriceps while requiring significant core stability and upper back strength.",
        instructions: [
            "Position the barbell on your front deltoids and clavicle, with elbows high and parallel to the ground",
            "Stand with feet shoulder-width apart, toes slightly pointed out",
            "Keeping your torso upright, descend by breaking at the hips and knees",
            "Continue until thighs are parallel to the ground or slightly below",
            "Drive through your heels to stand back up, maintaining an upright torso"
        ],
        tips: [
            "Keep your elbows high throughout the movement",
            "Maintain an upright torso position",
            "Focus on breathing and bracing your core",
            "If wrist mobility is limited, try using a cross-arm grip"
        ]
    },
    {
        name: "Split Squat",
        primaryMuscleGroup: "Quadriceps",
        secondaryMuscleGroups: ["Glutes", "Hamstrings", "Core"],
        equipment: "Bodyweight",
        difficulty: "Beginner",
        description: "A unilateral lower body exercise that develops single-leg strength, balance, and stability.",
        instructions: [
            "Stand in a split stance with one foot about 2-3 feet in front of the other",
            "Keep your torso upright and core engaged",
            "Lower your back knee toward the ground by bending both knees",
            "Continue until your back knee nearly touches the ground",
            "Push through the front foot to return to the starting position",
            "Complete all reps on one side before switching legs"
        ],
        tips: [
            "Keep your front knee aligned with your toes",
            "Maintain an upright posture throughout the movement",
            "Use a shorter stance for more quad focus, longer for more glute/hamstring emphasis",
            "For added challenge, hold dumbbells or place the back foot on an elevated surface"
        ]
    },
    {
        name: "Calf Raises",
        primaryMuscleGroup: "Calves",
        secondaryMuscleGroups: [],
        equipment: "Bodyweight",
        difficulty: "Beginner",
        description: "An isolation exercise that targets the calf muscles, improving ankle strength and stability.",
        instructions: [
            "Stand with feet hip-width apart, balls of your feet on an elevated surface",
            "Let your heels hang off the edge",
            "Push through the balls of your feet to raise your heels as high as possible",
            "Hold the contracted position briefly",
            "Lower your heels below the level of your toes to feel a stretch in your calves"
        ],
        tips: [
            "Perform the movement through a full range of motion",
            "Keep your legs straight but not locked",
            "For added resistance, hold dumbbells or use a calf raise machine",
            "Try both straight-leg and bent-knee variations to target different parts of the calves"
        ]
    },
    {
        name: "Power Clean",
        primaryMuscleGroup: "Full Body",
        secondaryMuscleGroups: ["Quadriceps", "Hamstrings", "Glutes", "Traps", "Shoulders", "Core"],
        equipment: "Barbell",
        difficulty: "Advanced",
        description: "An explosive Olympic weightlifting movement that develops power, speed, and coordination while engaging multiple muscle groups throughout the body.",
        instructions: [
            "Start with the barbell on the ground, feet hip-width apart",
            "Grip the bar slightly wider than shoulder width with a hook grip",
            "Position your shoulders over the bar, hips higher than knees",
            "Explosively extend your hips and knees (first pull)",
            "As the bar passes your knees, accelerate by aggressively extending hips, knees, and ankles (second pull)",
            "Pull yourself under the bar as it reaches maximum height",
            "Catch the bar on your front deltoids in a quarter squat position",
            "Stand up to complete the lift"
        ],
        tips: [
            "Keep the bar close to your body throughout the movement",
            "Focus on explosive hip extension in the second pull",
            "Stay over the bar until you begin the second pull",
            "Catch the bar with your elbows high and torso upright",
            "Start with light weights to master proper technique"
        ]
    }
];

module.exports = newExercises; 
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/activities - Get all activities for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const activities = await db.activity.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

// POST /api/activities - Create a new activity
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, activityType, duration, intensity, description, calories } = body;

    if (!userId || !activityType || !duration || !intensity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate calories burned if not provided (simplified formula)
    const calculatedCalories = calories || Math.floor(duration * (intensity === "high" ? 10 : intensity === "moderate" ? 7 : 5));

    // Generate DNA-based feedback
    const feedback = generateActivityFeedback(activityType, intensity, duration);

    const activity = await db.activity.create({
      data: {
        userId,
        activityType,
        duration,
        intensity,
        description,
        calories: calculatedCalories,
        feedback,
      },
    });

    // Update activity streak
    await updateStreak(userId, "activity");

    return NextResponse.json(activity, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}

// Helper function to generate activity feedback based on DNA profile
function generateActivityFeedback(activityType: string, intensity: string, duration: number): string {
  const feedbacks = {
    cardio: {
      high: "Excellent cardio session! Your DNA profile shows great cardiovascular adaptation.",
      moderate: "Good cardio workout. Consider increasing intensity gradually for better results.",
      low: "Light cardio is good for recovery. Your genes respond well to consistent moderate exercise.",
    },
    strength: {
      high: "Intense strength training! Your power-oriented muscle type is responding well.",
      moderate: "Good strength session. Focus on progressive overload for muscle growth.",
      low: "Light strength training helps maintain muscle mass. Good for recovery days.",
    },
    flexibility: {
      high: "Great flexibility work! Your joints benefit from regular stretching.",
      moderate: "Good flexibility session. Consistency is key for improving range of motion.",
      low: "Light stretching helps prevent injury. Your DNA profile shows good joint mobility.",
    },
    balance: {
      high: "Excellent balance training! Your proprioception is improving well.",
      moderate: "Good balance work. This complements your other training perfectly.",
      low: "Light balance exercises help prevent falls and improve coordination.",
    },
  };

  const activityFeedbacks = feedbacks[activityType as keyof typeof feedbacks];
  if (activityFeedbacks) {
    return activityFeedbacks[intensity as keyof typeof activityFeedbacks] || "Good activity session!";
  }

  return "Good activity session! Keep up the great work.";
}

// Helper function to update streaks
async function updateStreak(userId: string, streakType: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingStreak = await db.streak.findFirst({
    where: {
      userId,
      type: streakType,
      isActive: true,
    },
  });

  if (existingStreak) {
    const lastDate = new Date(existingStreak.lastDate);
    lastDate.setHours(0, 0, 0, 0);

    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day, increment streak
      await db.streak.update({
        where: { id: existingStreak.id },
        data: {
          count: existingStreak.count + 1,
          lastDate: today,
        },
      });
    } else if (diffDays > 1) {
      // Reset streak
      await db.streak.update({
        where: { id: existingStreak.id },
        data: {
          count: 1,
          lastDate: today,
        },
      });
    }
  } else {
    // Create new streak
    await db.streak.create({
      data: {
        userId,
        type: streakType,
        count: 1,
        lastDate: today,
      },
    });
  }
}
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/meals - Get all meals for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const meals = await db.meal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    return NextResponse.json({ error: "Failed to fetch meals" }, { status: 500 });
  }
}

// POST /api/meals - Create a new meal
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, mealType, description, calories, protein, carbs, fat, fiber } = body;

    if (!userId || !name || !mealType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Calculate DNA alignment score (simplified algorithm)
    const dnaAlignment = Math.floor(Math.random() * 30) + 70; // 70-100 for demo

    // Generate feedback based on DNA alignment
    let feedback = "";
    if (dnaAlignment >= 90) {
      feedback = "Excellent choice! This meal aligns perfectly with your DNA profile.";
    } else if (dnaAlignment >= 80) {
      feedback = "Good meal choice. Consider adding more vegetables for better alignment.";
    } else {
      feedback = "This meal is okay, but consider alternatives that better match your genetic profile.";
    }

    const meal = await db.meal.create({
      data: {
        userId,
        name,
        mealType,
        description,
        calories: calories || null,
        protein: protein || null,
        carbs: carbs || null,
        fat: fat || null,
        fiber: fiber || null,
        dnaAlignment,
        feedback,
      },
    });

    // Update meal logging streak
    await updateStreak(userId, "mealLogging");

    return NextResponse.json(meal, { status: 201 });
  } catch (error) {
    console.error("Error creating meal:", error);
    return NextResponse.json({ error: "Failed to create meal" }, { status: 500 });
  }
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
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/streaks - Get all streaks for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const streaks = await db.streak.findMany({
      where: { userId },
      orderBy: { count: "desc" },
    });

    return NextResponse.json(streaks);
  } catch (error) {
    console.error("Error fetching streaks:", error);
    return NextResponse.json({ error: "Failed to fetch streaks" }, { status: 500 });
  }
}

// POST /api/streaks - Update or create a streak
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, streakType } = body;

    if (!userId || !streakType) {
      return NextResponse.json({ error: "User ID and streak type are required" }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingStreak = await db.streak.findFirst({
      where: {
        userId,
        type: streakType,
        isActive: true,
      },
    });

    let updatedStreak;

    if (existingStreak) {
      const lastDate = new Date(existingStreak.lastDate);
      lastDate.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        // Already updated today, return existing streak
        updatedStreak = existingStreak;
      } else if (diffDays === 1) {
        // Consecutive day, increment streak
        updatedStreak = await db.streak.update({
          where: { id: existingStreak.id },
          data: {
            count: existingStreak.count + 1,
            lastDate: today,
          },
        });
      } else {
        // Reset streak
        updatedStreak = await db.streak.update({
          where: { id: existingStreak.id },
          data: {
            count: 1,
            lastDate: today,
          },
        });
      }
    } else {
      // Create new streak
      updatedStreak = await db.streak.create({
        data: {
          userId,
          type: streakType,
          count: 1,
          lastDate: today,
        },
      });
    }

    // Check for milestone achievements
    const milestone = checkMilestone(updatedStreak.count, streakType);

    return NextResponse.json({
      streak: updatedStreak,
      milestone,
      message: "Streak updated successfully",
    });
  } catch (error) {
    console.error("Error updating streak:", error);
    return NextResponse.json({ error: "Failed to update streak" }, { status: 500 });
  }
}

// GET /api/streaks/summary - Get streak summary for a user
export async function GET_summary(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const streaks = await db.streak.findMany({
      where: { userId },
    });

    const summary = {
      totalActiveStreaks: streaks.filter(s => s.isActive).length,
      totalStreakCount: streaks.reduce((sum, s) => sum + s.count, 0),
      longestStreak: Math.max(...streaks.map(s => s.count), 0),
      streaksByType: {
        mealLogging: streaks.find(s => s.type === "mealLogging")?.count || 0,
        proteinGoal: streaks.find(s => s.type === "proteinGoal")?.count || 0,
        activity: streaks.find(s => s.type === "activity")?.count || 0,
        learning: streaks.find(s => s.type === "learning")?.count || 0,
      },
      recentMilestones: streaks
        .filter(s => s.count >= 7)
        .map(s => ({ type: s.type, count: s.count, achieved: new Date(s.lastDate) })),
    };

    return NextResponse.json(summary);
  } catch (error) {
    console.error("Error generating streak summary:", error);
    return NextResponse.json({ error: "Failed to generate streak summary" }, { status: 500 });
  }
}

// Helper function to check milestones
function checkMilestone(count: number, streakType: string): string | null {
  const milestones = [1, 3, 7, 14, 21, 30, 60, 90, 180, 365];
  
  if (milestones.includes(count)) {
    const messages = {
      1: `Started your ${streakType} journey!`,
      3: `3 days of ${streakType} - building momentum!`,
      7: `One week of ${streakType} - great habit forming!`,
      14: `Two weeks of ${streakType} - you're on a roll!`,
      21: `Three weeks of ${streakType} - amazing consistency!`,
      30: `One month of ${streakType} - incredible dedication!`,
      60: `Two months of ${streakType} - you're a champion!`,
      90: `Three months of ${streakType} - legendary status!`,
      180: `Six months of ${streakType} - absolutely remarkable!`,
      365: `One year of ${streakType} - you're an inspiration!`,
    };
    
    return messages[count as keyof typeof messages] || null;
  }
  
  return null;
}
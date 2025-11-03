import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/streaks/summary - Get streak summary for a user
export async function GET(request: NextRequest) {
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
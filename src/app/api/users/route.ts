import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/users - Get user information
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");

    if (!userId && !email) {
      return NextResponse.json({ error: "User ID or email is required" }, { status: 400 });
    }

    let user;
    if (userId) {
      user = await db.user.findUnique({
        where: { id: userId },
        include: {
          dnaProfiles: {
            include: { traits: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          meals: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
          activities: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
          streaks: {
            where: { isActive: true },
          },
          learningProgress: {
            orderBy: { updatedAt: "desc" },
            take: 5,
          },
        },
      });
    } else {
      user = await db.user.findUnique({
        where: { email: email as string },
        include: {
          dnaProfiles: {
            include: { traits: true },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
          meals: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
          activities: {
            orderBy: { createdAt: "desc" },
            take: 5,
          },
          streaks: {
            where: { isActive: true },
          },
          learningProgress: {
            orderBy: { updatedAt: "desc" },
            take: 5,
          },
        },
      });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Calculate user statistics
    const stats = {
      totalMeals: user.meals.length,
      totalActivities: user.activities.length,
      activeStreaks: user.streaks.filter(s => s.isActive).length,
      totalStreakCount: user.streaks.reduce((sum, s) => sum + s.count, 0),
      learningProgress: user.learningProgress.length,
      completedLearning: user.learningProgress.filter(p => p.completed).length,
      hasDNAProfile: user.dnaProfiles.length > 0,
      averageMealAlignment: user.meals.length > 0 
        ? user.meals.reduce((sum, meal) => sum + meal.dnaAlignment, 0) / user.meals.length 
        : 0,
    };

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      stats,
      latestDNAProfile: user.dnaProfiles[0] || null,
      recentMeals: user.meals,
      recentActivities: user.activities,
      activeStreaks: user.streaks,
      recentLearning: user.learningProgress,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    // Create new user
    const user = await db.user.create({
      data: {
        email,
        name: name || null,
      },
    });

    // Initialize default streaks for the new user
    const defaultStreaks = ["mealLogging", "proteinGoal", "activity", "learning"];
    await Promise.all(
      defaultStreaks.map(streakType =>
        db.streak.create({
          data: {
            userId: user.id,
            type: streakType,
            count: 0,
            lastDate: new Date(),
            isActive: true,
          },
        })
      )
    );

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      message: "User created successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
  }
}

// PUT /api/users - Update user information
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, name, email } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if user exists
    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if email is being changed and already exists
    if (email && email !== existingUser.email) {
      const emailExists = await db.user.findUnique({
        where: { email },
      });

      if (emailExists) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 });
      }
    }

    // Update user
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: name || existingUser.name,
        email: email || existingUser.email,
      },
    });

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
      message: "User updated successfully",
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}
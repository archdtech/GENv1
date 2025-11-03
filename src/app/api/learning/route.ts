import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/learning - Get learning progress and content for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const contentType = searchParams.get("contentType"); // Optional filter

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get user's learning progress
    const whereClause: any = { userId };
    if (contentType) {
      whereClause.contentType = contentType;
    }

    const progress = await db.learningProgress.findMany({
      where: whereClause,
      orderBy: { updatedAt: "desc" },
    });

    // Get personalized learning recommendations based on DNA traits
    const recommendations = await getPersonalizedRecommendations(userId);

    // Calculate overall learning stats
    const totalItems = progress.length;
    const completedItems = progress.filter(p => p.completed).length;
    const averageProgress = totalItems > 0 
      ? progress.reduce((sum, p) => sum + p.progress, 0) / totalItems 
      : 0;

    const response = {
      progress,
      recommendations,
      stats: {
        totalItems,
        completedItems,
        averageProgress: Math.round(averageProgress),
        completionRate: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching learning data:", error);
    return NextResponse.json({ error: "Failed to fetch learning data" }, { status: 500 });
  }
}

// POST /api/learning - Update learning progress
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, contentType, contentId, title, progress, completed } = body;

    if (!userId || !contentType || !contentId || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if progress record exists
    const existingProgress = await db.learningProgress.findFirst({
      where: {
        userId,
        contentType,
        contentId,
      },
    });

    let updatedProgress;

    if (existingProgress) {
      // Update existing progress
      updatedProgress = await db.learningProgress.update({
        where: { id: existingProgress.id },
        data: {
          progress: progress || existingProgress.progress,
          completed: completed !== undefined ? completed : existingProgress.completed,
        },
      });
    } else {
      // Create new progress record
      updatedProgress = await db.learningProgress.create({
        data: {
          userId,
          contentType,
          contentId,
          title,
          progress: progress || 0,
          completed: completed || false,
        },
      });
    }

    // Update learning streak if progress was made
    if (progress > 0 || completed) {
      await updateLearningStreak(userId);
    }

    return NextResponse.json({
      progress: updatedProgress,
      message: "Learning progress updated successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error updating learning progress:", error);
    return NextResponse.json({ error: "Failed to update learning progress" }, { status: 500 });
  }
}

// Helper function to get personalized learning recommendations
async function getPersonalizedRecommendations(userId: string) {
  // Get user's DNA traits to personalize recommendations
  const latestProfile = await db.dNAProfile.findFirst({
    where: { userId },
    include: { traits: true },
    orderBy: { createdAt: "desc" },
  });

  const baseRecommendations = [
    {
      id: "nutrition-basics",
      title: "Nutrition Fundamentals",
      type: "article",
      description: "Learn the basics of balanced nutrition",
      difficulty: "beginner",
      estimatedTime: "15 min",
    },
    {
      id: "dna-nutrition",
      title: "DNA and Nutrition",
      type: "article",
      description: "How your genes affect your nutritional needs",
      difficulty: "intermediate",
      estimatedTime: "20 min",
    },
    {
      id: "meal-planning",
      title: "Smart Meal Planning",
      type: "video",
      description: "Plan meals that work with your genetics",
      difficulty: "intermediate",
      estimatedTime: "25 min",
    },
    {
      id: "exercise-genetics",
      title: "Exercise and Your Genes",
      type: "article",
      description: "Optimize your workout based on DNA",
      difficulty: "intermediate",
      estimatedTime: "18 min",
    },
    {
      id: "supplement-guide",
      title: "Supplement Guide",
      type: "article",
      description: "Personalized supplement recommendations",
      difficulty: "advanced",
      estimatedTime: "30 min",
    },
  ];

  // Personalize based on DNA traits if available
  if (latestProfile && latestProfile.traits.length > 0) {
    const traits = latestProfile.traits;
    
    // Add specific recommendations based on high-risk traits
    const highRiskTraits = traits.filter(t => t.riskLevel >= 4);
    
    if (highRiskTraits.some(t => t.category === "vitamin")) {
      baseRecommendations.push({
        id: "vitamin-optimization",
        title: "Vitamin Optimization",
        type: "article",
        description: "Maximize your vitamin absorption based on genetics",
        difficulty: "intermediate",
        estimatedTime: "22 min",
      });
    }
    
    if (highRiskTraits.some(t => t.category === "metabolism")) {
      baseRecommendations.push({
        id: "metabolism-boost",
        title: "Metabolism Optimization",
        type: "video",
        description: "Natural ways to support your metabolic health",
        difficulty: "intermediate",
        estimatedTime: "28 min",
      });
    }
    
    if (highRiskTraits.some(t => t.category === "circadian")) {
      baseRecommendations.push({
        id: "circadian-health",
        title: "Circadian Health",
        type: "article",
        description: "Align your lifestyle with your body clock",
        difficulty: "beginner",
        estimatedTime: "16 min",
      });
    }
  }

  return baseRecommendations;
}

// Helper function to update learning streak
async function updateLearningStreak(userId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingStreak = await db.streak.findFirst({
    where: {
      userId,
      type: "learning",
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
        type: "learning",
        count: 1,
        lastDate: today,
      },
    });
  }
}
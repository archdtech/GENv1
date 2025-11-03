import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/balance - Get nutrient balance data for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const period = searchParams.get("period") || "today"; // today, week, month

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    let startDate: Date;
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    if (period === "today") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "week") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
    } else if (period === "month") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      startDate.setHours(0, 0, 0, 0);
    } else {
      return NextResponse.json({ error: "Invalid period" }, { status: 400 });
    }

    // Get meals for the period
    const meals = await db.meal.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Calculate nutrient totals
    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + (meal.calories || 0),
        protein: acc.protein + (meal.protein || 0),
        carbs: acc.carbs + (meal.carbs || 0),
        fat: acc.fat + (meal.fat || 0),
        fiber: acc.fiber + (meal.fiber || 0),
        mealCount: acc.mealCount + 1,
        totalAlignment: acc.totalAlignment + meal.dnaAlignment,
      }),
      {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        mealCount: 0,
        totalAlignment: 0,
      }
    );

    // Calculate averages and percentages
    const averageAlignment = totals.mealCount > 0 ? totals.totalAlignment / totals.mealCount : 0;

    // Recommended daily values (simplified)
    const recommendations = {
      calories: 2000,
      protein: 60,
      carbs: 200,
      fat: 70,
      fiber: 25,
    };

    // Calculate percentages of recommendations
    const percentages = {
      calories: Math.min(100, (totals.calories / recommendations.calories) * 100),
      protein: Math.min(100, (totals.protein / recommendations.protein) * 100),
      carbs: Math.min(100, (totals.carbs / recommendations.carbs) * 100),
      fat: Math.min(100, (totals.fat / recommendations.fat) * 100),
      fiber: Math.min(100, (totals.fiber / recommendations.fiber) * 100),
    };

    // Calculate overall balance score
    const balanceScore = calculateBalanceScore(percentages);

    // Generate recommendations
    const recommendationsList = generateRecommendations(percentages, totals);

    const balanceData = {
      period,
      totals,
      percentages,
      recommendations,
      averageAlignment,
      balanceScore,
      recommendationsList,
      mealCount: totals.mealCount,
    };

    return NextResponse.json(balanceData);
  } catch (error) {
    console.error("Error calculating balance:", error);
    return NextResponse.json({ error: "Failed to calculate balance" }, { status: 500 });
  }
}

// Helper function to calculate overall balance score
function calculateBalanceScore(percentages: any): number {
  const { calories, protein, carbs, fat, fiber } = percentages;
  
  // Calculate how close each nutrient is to the ideal 100%
  const scores = [
    Math.abs(100 - calories),
    Math.abs(100 - protein),
    Math.abs(100 - carbs),
    Math.abs(100 - fat),
    Math.abs(100 - fiber),
  ];

  // Average the deviation from ideal and subtract from 100
  const averageDeviation = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.max(0, 100 - averageDeviation);
}

// Helper function to generate personalized recommendations
function generateRecommendations(percentages: any, totals: any): string[] {
  const recommendations: string[] = [];

  if (percentages.protein < 80) {
    recommendations.push("Increase protein intake. Consider adding lean meats, fish, or plant-based proteins.");
  }

  if (percentages.fiber < 60) {
    recommendations.push("Add more fiber-rich foods like vegetables, fruits, and whole grains.");
  }

  if (percentages.carbs > 120) {
    recommendations.push("Consider reducing carbohydrate intake, especially refined carbs.");
  }

  if (percentages.fat > 110) {
    recommendations.push("Monitor fat intake. Focus on healthy fats from avocados, nuts, and olive oil.");
  }

  if (percentages.calories > 110) {
    recommendations.push("Calorie intake is high. Consider portion control and more nutrient-dense foods.");
  }

  if (percentages.calories < 70) {
    recommendations.push("Calorie intake is low. Ensure you're eating enough to meet your energy needs.");
  }

  // Add general recommendations if specific ones aren't needed
  if (recommendations.length === 0) {
    recommendations.push("Great job maintaining balanced nutrition! Keep up the good work.");
    recommendations.push("Consider varying your food choices to ensure diverse nutrient intake.");
  }

  return recommendations;
}
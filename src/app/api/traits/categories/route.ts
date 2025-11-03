import { NextResponse } from "next/server";

// GET /api/traits/categories - Get available trait categories
export async function GET() {
  try {
    const categories = [
      { id: "metabolism", name: "Metabolism", description: "How your body processes nutrients" },
      { id: "vitamin", name: "Vitamins & Minerals", description: "Nutrient absorption and utilization" },
      { id: "circadian", name: "Circadian Rhythm", description: "Your body's natural clock" },
      { id: "fitness", name: "Fitness & Exercise", description: "Exercise response and muscle type" },
      { id: "digestion", name: "Digestion", description: "Food tolerance and digestive health" },
      { id: "cardiovascular", name: "Cardiovascular", description: "Heart and blood vessel health" },
    ];

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching trait categories:", error);
    return NextResponse.json({ error: "Failed to fetch trait categories" }, { status: 500 });
  }
}
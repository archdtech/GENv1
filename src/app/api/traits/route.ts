import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/traits - Get DNA traits for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const category = searchParams.get("category"); // Optional filter by category

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Get the latest DNA profile for the user
    const latestProfile = await db.dNAProfile.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (!latestProfile) {
      return NextResponse.json({ error: "No DNA profile found for user" }, { status: 404 });
    }

    // Get traits for the profile
    const whereClause: any = { profileId: latestProfile.id };
    if (category) {
      whereClause.category = category;
    }

    const traits = await db.dNATrait.findMany({
      where: whereClause,
      orderBy: [{ riskLevel: "desc" }, { traitName: "asc" }],
    });

    // Group traits by category
    const traitsByCategory = traits.reduce((acc, trait) => {
      if (!acc[trait.category]) {
        acc[trait.category] = [];
      }
      acc[trait.category].push(trait);
      return acc;
    }, {} as Record<string, any[]>);

    // Calculate overall risk assessment
    const avgRiskLevel = traits.length > 0 
      ? traits.reduce((sum, trait) => sum + trait.riskLevel, 0) / traits.length 
      : 0;

    const response = {
      profileId: latestProfile.id,
      traits,
      traitsByCategory,
      overallRiskLevel: Math.round(avgRiskLevel * 10) / 10,
      totalTraits: traits.length,
      highRiskTraits: traits.filter(t => t.riskLevel >= 4),
      categories: Object.keys(traitsByCategory),
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching DNA traits:", error);
    return NextResponse.json({ error: "Failed to fetch DNA traits" }, { status: 500 });
  }
}

// POST /api/traits - Add or update DNA traits
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profileId, traits } = body;

    if (!profileId || !traits || !Array.isArray(traits)) {
      return NextResponse.json({ error: "Profile ID and traits array are required" }, { status: 400 });
    }

    // Verify the profile exists
    const profile = await db.dNAProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      return NextResponse.json({ error: "DNA profile not found" }, { status: 404 });
    }

    // Delete existing traits for this profile (if updating)
    await db.dNATrait.deleteMany({
      where: { profileId },
    });

    // Create new traits
    const createdTraits = await Promise.all(
      traits.map((trait: any) =>
        db.dNATrait.create({
          data: {
            profileId,
            traitName: trait.traitName,
            traitValue: trait.traitValue,
            category: trait.category,
            riskLevel: trait.riskLevel,
            description: trait.description,
          },
        })
      )
    );

    // Update profile risk level based on traits
    const avgRiskLevel = createdTraits.length > 0
      ? createdTraits.reduce((sum, trait) => sum + trait.riskLevel, 0) / createdTraits.length
      : 0;

    await db.dNAProfile.update({
      where: { id: profileId },
      data: { riskLevel: Math.round(avgRiskLevel) },
    });

    return NextResponse.json({
      traits: createdTraits,
      profileRiskLevel: Math.round(avgRiskLevel),
      message: "DNA traits updated successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error updating DNA traits:", error);
    return NextResponse.json({ error: "Failed to update DNA traits" }, { status: 500 });
  }
}

// GET /api/traits/categories - Get available trait categories
export async function GET_categories() {
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
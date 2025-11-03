import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/dna - Get DNA profiles for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const profiles = await db.dNAProfile.findMany({
      where: { userId },
      include: {
        traits: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(profiles);
  } catch (error) {
    console.error("Error fetching DNA profiles:", error);
    return NextResponse.json({ error: "Failed to fetch DNA profiles" }, { status: 500 });
  }
}

// POST /api/dna - Upload and process DNA file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId") as string;
    const file = formData.get("file") as File;

    if (!userId || !file) {
      return NextResponse.json({ error: "User ID and file are required" }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = buffer.toString("base64");

    // Create DNA profile
    const profile = await db.dNAProfile.create({
      data: {
        userId,
        fileName: file.name,
        fileData: base64Data,
        riskLevel: Math.floor(Math.random() * 5) + 1, // Random risk level for demo
      },
    });

    // Simulate DNA analysis and create traits
    const traits = await analyzeDNAAndCreateTraits(profile.id);

    return NextResponse.json({
      profile,
      traits,
      message: "DNA file uploaded and processed successfully",
    }, { status: 201 });
  } catch (error) {
    console.error("Error processing DNA file:", error);
    return NextResponse.json({ error: "Failed to process DNA file" }, { status: 500 });
  }
}

// Helper function to simulate DNA analysis
async function analyzeDNAAndCreateTraits(profileId: string) {
  // Simulated DNA traits based on common genetic markers
  const simulatedTraits = [
    {
      traitName: "Fat Metabolism",
      traitValue: "Sensitive",
      category: "metabolism",
      riskLevel: 3,
      description: "Your body is sensitive to saturated fats. Opt for lean proteins and healthy fats.",
    },
    {
      traitName: "Vitamin D Absorption",
      traitValue: "Low",
      category: "vitamin",
      riskLevel: 4,
      description: "Reduced ability to absorb vitamin D. Consider supplementation and sun exposure.",
    },
    {
      traitName: "Circadian Type",
      traitValue: "Morning",
      category: "circadian",
      riskLevel: 1,
      description: "You naturally function better in the morning. Schedule important tasks early.",
    },
    {
      traitName: "Muscle Type",
      traitValue: "Power",
      category: "fitness",
      riskLevel: 2,
      description: "Your muscles are suited for power activities. Focus on strength training.",
    },
    {
      traitName: "Carbohydrate Sensitivity",
      traitValue: "Moderate",
      category: "metabolism",
      riskLevel: 2,
      description: "Moderate sensitivity to carbs. Balance complex carbs with protein.",
    },
    {
      traitName: "Lactose Tolerance",
      traitValue: "Intolerant",
      category: "digestion",
      riskLevel: 3,
      description: "Lactose intolerance detected. Choose dairy alternatives or lactose-free products.",
    },
    {
      traitName: "Caffeine Metabolism",
      traitValue: "Fast",
      category: "metabolism",
      riskLevel: 1,
      description: "Fast caffeine metabolism. You may need more frequent caffeine intake.",
    },
    {
      traitName: "Salt Sensitivity",
      traitValue: "High",
      category: "cardiovascular",
      riskLevel: 4,
      description: "High salt sensitivity. Monitor sodium intake and choose low-sodium options.",
    },
  ];

  const createdTraits = await Promise.all(
    simulatedTraits.map((trait) =>
      db.dNATrait.create({
        data: {
          profileId,
          ...trait,
        },
      })
    )
  );

  return createdTraits;
}
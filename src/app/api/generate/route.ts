import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import { generateEventProposal } from "@/lib/gemini";
import EventProposal from "@/models/EventProposal";
import { GenerateRequest } from "@/types/event";

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { query } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { success: false, error: "Event description is required." },
        { status: 400 }
      );
    }

    const trimmed = query.trim();
    if (trimmed.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide a more detailed event description (at least 10 characters).",
        },
        { status: 400 }
      );
    }

    if (trimmed.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Event description must be under 2000 characters." },
        { status: 400 }
      );
    }

    const proposal = await generateEventProposal(trimmed);

    await connectToDatabase();

    const saved = await EventProposal.create({
      query: trimmed,
      venueName: proposal.venueName,
      location: proposal.location,
      estimatedCost: proposal.estimatedCost,
      justification: proposal.justification,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: saved._id.toString(),
          query: saved.query,
          venueName: saved.venueName,
          location: saved.location,
          estimatedCost: saved.estimatedCost,
          justification: saved.justification,
          createdAt: saved.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[/api/generate] Error:", error);

    const message =
      error instanceof Error ? error.message : "An unexpected error occurred.";

    if (message.includes("Groq") || message.includes("JSON")) {
      return NextResponse.json(
        { success: false, error: "AI failed to generate a proposal. Please try again." },
        { status: 502 }
      );
    }

    if (message.includes("MONGODB") || message.includes("connect")) {
      return NextResponse.json(
        { success: false, error: "Database connection failed. Please try again." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to generate proposal. Please try again." },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import EventProposal from "@/models/EventProposal";

export async function GET() {
  try {
    await connectToDatabase();

    const proposals = await EventProposal.find({})
      .sort({ createdAt: -1 })
      .lean();

    const serialized = proposals.map((p) => ({
      _id: p._id.toString(),
      query: p.query,
      venueName: p.venueName,
      location: p.location,
      estimatedCost: p.estimatedCost,
      justification: p.justification,
      createdAt: p.createdAt,
    }));

    return NextResponse.json({ success: true, data: serialized }, { status: 200 });
  } catch (error: unknown) {
    console.error("[/api/history] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch history. Please try again." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import connectToDatabase from "@/lib/mongodb";
import EventProposal from "@/models/EventProposal";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid proposal ID." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const deleted = await EventProposal.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Proposal not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    console.error("[/api/history/[id]] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete proposal. Please try again." },
      { status: 500 }
    );
  }
}

import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEventProposal extends Document {
  query: string;
  venueName: string;
  location: string;
  estimatedCost: string;
  justification: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventProposalSchema = new Schema<IEventProposal>(
  {
    query: {
      type: String,
      required: [true, "Query is required"],
      trim: true,
      maxlength: [2000, "Query cannot exceed 2000 characters"],
    },
    venueName: {
      type: String,
      required: [true, "Venue name is required"],
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    estimatedCost: {
      type: String,
      required: [true, "Estimated cost is required"],
      trim: true,
    },
    justification: {
      type: String,
      required: [true, "Justification is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

EventProposalSchema.index({ createdAt: -1 });

const EventProposal: Model<IEventProposal> =
  mongoose.models.EventProposal ||
  mongoose.model<IEventProposal>("EventProposal", EventProposalSchema);

export default EventProposal;

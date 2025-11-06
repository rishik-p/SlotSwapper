import mongoose, { Document, Schema } from "mongoose";

export type EventStatus = "BUSY" | "SWAPPABLE" | "SWAP_PENDING";

export interface IEvent extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  startTime: Date;
  endTime: Date;
  status: EventStatus;
}

const eventSchema = new Schema<IEvent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["BUSY", "SWAPPABLE", "SWAP_PENDING"],
      default: "BUSY",
    },
  },
  { timestamps: true }
);

export const Event = mongoose.model<IEvent>("Event", eventSchema);

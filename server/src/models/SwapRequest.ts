import mongoose, { Document, Schema } from "mongoose";

export type SwapStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface ISwapRequest extends Document {
  requesterId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  requesterSlotId: mongoose.Types.ObjectId;
  receiverSlotId: mongoose.Types.ObjectId;
  status: SwapStatus;
}

const swapRequestSchema = new Schema<ISwapRequest>(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requesterSlotId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    receiverSlotId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    status: { type: String, enum: ["PENDING", "ACCEPTED", "REJECTED"], default: "PENDING" },
  },
  { timestamps: true }
);

export const SwapRequest = mongoose.model<ISwapRequest>("SwapRequest", swapRequestSchema);

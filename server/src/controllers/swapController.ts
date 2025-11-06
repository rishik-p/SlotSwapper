import { Request, Response } from "express";
import { Event } from "../models/Event";
import { AuthRequest } from "../middleware/authMiddleware";
import { SwapRequest } from "../models/SwapRequest";
import mongoose from "mongoose";
import { io, userSocketMap } from "../index";


export const getSwapRequests = async (req: AuthRequest, res: Response) => {
  try {
    const myId = req.user!.id;

    const incoming = await SwapRequest.find({ receiverId: myId })
      .populate("requesterId", "name email")
      .populate("requesterSlotId")
      .populate("receiverSlotId");

    const outgoing = await SwapRequest.find({ requesterId: myId })
      .populate("receiverId", "name email")
      .populate("requesterSlotId")
      .populate("receiverSlotId");

    res.json({ incoming, outgoing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getSwappableSlots=async (req:AuthRequest,res:Response)=>{
    try{
        const myId=req.user!.id;
        const swappable=await Event.find({
            status:"SWAPPABLE",
            userId:{$ne:myId},
        }).populate("userId","name email");

        res.json({swappable});
    }
    catch(err){
        console.error(err);
        console.log("Error swap controller 1");
        res.status(500).json({message:"Server error"});
    }
}

export const createSwapRequest=async(req:AuthRequest,res:Response)=>{
    try{
        const {mySlotId,theirSlotId}=req.body;
        const myId = req.user!.id;
        if (!mySlotId || !theirSlotId)
            return res.status(400).json({ message: "Both slot IDs required" });

        const mySlot = await Event.findOne({ _id: mySlotId, userId: myId });
        const theirSlot = await Event.findOne({ _id: theirSlotId });

        if (!mySlot || !theirSlot)
            return res.status(404).json({ message: "One or both slots not found" });

        if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE")
            return res.status(400).json({ message: "Slots must be swappable" });
        const swapReq = new SwapRequest({
            requesterId: myId,
            receiverId: theirSlot.userId,
            requesterSlotId: mySlotId,
            receiverSlotId: theirSlotId,
        });
        await swapReq.save();
        const receiverId = theirSlot.userId.toString();           // user receiving request
        const receiverSocketId = userSocketMap.get(receiverId);   // get socket for that user

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("swap:new", {
            message: "📨 You have a new swap request!",
            fromUser: myId,          // the requester (who offered)
            swapId: swapReq._id,     // the new swap request id
        });
        console.log(`🔔 Sent swap:new to receiver ${receiverId}`);
}

        mySlot.status = "SWAP_PENDING";
        theirSlot.status = "SWAP_PENDING";
        await mySlot.save();
        await theirSlot.save();

        res.status(201).json({ message: "Swap request sent", swap: swapReq });
    }
    catch(err){
        console.error(err);
        console.log("error swapcontroller 1");
        res.status(500).json({message:"Server error"});
    }
}

export const respondToSwap=async (req: AuthRequest, res: Response) => {
    try{
        const {accepted}=req.body;
        const {id}=req.params;
        const myId=req.user!.id;

        const swap=await SwapRequest.findById(id);
        if(!swap) return res.status(404).json({message:"Swap not found"});
        if (swap.receiverId.toString() !== myId)
            return res.status(403).json({ message: "Not authorized" });

        const mySlot = await Event.findById(swap.receiverSlotId);
        const theirSlot = await Event.findById(swap.requesterSlotId);

        if (!mySlot || !theirSlot)
            return res.status(404).json({ message: "Slots not found" });

        if (!accepted) {
            swap.status = "REJECTED";
            await swap.save();
            mySlot.status = "SWAPPABLE";
            theirSlot.status = "SWAPPABLE";
            await mySlot.save();
            await theirSlot.save();
            // Inside "if (!accepted)" block
            const requesterId = swap.requesterId.toString();
            const requesterSocketId = userSocketMap.get(requesterId);

            if (requesterSocketId) {
            io.to(requesterSocketId).emit("swap:rejected", {
                message: "❌ Your swap request was rejected.",
                swapId: swap._id,
            });
            console.log(`🔔 Sent swap:rejected to requester ${requesterId}`);
            }

            return res.json({ message: "Swap rejected", swap });
        }

        const session=await mongoose.startSession();
        session.startTransaction();
        try{
            const receiverId=mySlot.userId;
            const requesterId=theirSlot.userId;

            mySlot.userId=requesterId;
            theirSlot.userId=receiverId;

            mySlot.status="BUSY";
            theirSlot.status="BUSY";

            swap.status = "ACCEPTED";

            await mySlot.save({ session });
            await theirSlot.save({ session });
            await swap.save({ session });

            await session.commitTransaction();
            session.endSession();
            const requesterSocketId = userSocketMap.get(requesterId.toString());

            if (requesterSocketId) {
            io.to(requesterSocketId).emit("swap:accepted", {
                message: "✅ Your swap request was accepted!",
                swapId: swap._id,
            });
            console.log(`🔔 Sent swap:accepted to requester ${requesterId}`);
}
            res.json({ message: "Swap accepted", swap });
        }catch(err){
            await session.abortTransaction();
            console.log("session error swapcontroller 1");
            session.endSession();
            throw err;
        }
    }
    catch(err){
        console.error(err);
        res.status(500).json({message:"Server error"});
    }
}
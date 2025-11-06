import {Request,Response} from "express";
import {Event} from "../models/Event";
import { AuthRequest } from "../middleware/authMiddleware";

export const createEvent= async(req:AuthRequest,res:Response)=>{
    try{
        const{title,startTime,endTime}=req.body;
        if(!title || !startTime || !endTime){
            return res.status(400).json({message:"All filed required"});
        }

        const event= new Event({
            userId:req.user!.id,
            title,
            startTime,
            endTime,
            status:"BUSY",
        })
        await event.save();
        res.status(201).json({message:"Event created",event});
    }
    catch(err){
        console.log("Create event event controller");
        console.error(err);
        res.status(500).json({message:"server error"});
    }
};

//get all my events
export const getMyEvents=async(req:AuthRequest,res:Response)=>{
    try{
        const events=await Event.find({userId:req.user?.id}).sort({startTime:1});
        res.json(events);
    }
    catch(err){
        res.status(500).json({message:"Service error"});
    }
};

//update event
export const updateEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    console.log("update called");
    console.log("User ID:", req.user!.id);
    console.log("Event ID:", req.params.id);
    const check = await Event.findOne({ _id: req.params.id });
    console.log("Event Exists:", check ? true : false);


    const checkOwner = await Event.findOne({ _id: req.params.id, userId: req.user!.id });
    console.log("Event With Correct Owner:", checkOwner ? true : false);
    console.log("Received Body:", req.body);

    const updated = await Event.findOneAndUpdate(
      { _id: id, userId: req.user!.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event updated", event: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

//delete event
export const deleteEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await Event.findOneAndDelete({ _id: id, userId: req.user!.id });
    if (!deleted) return res.status(404).json({ message: "Event not found" });
    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
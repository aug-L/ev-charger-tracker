import { db } from "../db/index.js";
import { sessions } from "../db/schema.js";
import { eq } from "drizzle-orm";

export const startCharging = async (req, res, io) => {
  try {
    const { id } = req.params;
    const [session] = await db.select().from(sessions).where(eq(sessions.id, parseInt(id)));
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    if (session.status !== "idle") {
      return res.status(400).json({ error: "Only idle sessions can be started" });
    }
    
    const [updatedSession] = await db.update(sessions)
      .set({ 
        status: "charging", 
        startTime: new Date() 
      })
      .where(eq(sessions.id, parseInt(id)))
      .returning();
    
    io.to("dashboard").emit("session-updated", updatedSession);
    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const stopCharging = async (req, res, io) => {
  try {
    const { id } = req.params;
    const [session] = await db.select().from(sessions).where(eq(sessions.id, parseInt(id)));
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    if (session.status !== "charging") {
      return res.status(400).json({ error: "Only charging sessions can be stopped" });
    }
    
    const cost = parseFloat((session.energyKwh * 2.5).toFixed(2));
    
    const [updatedSession] = await db.update(sessions)
      .set({ 
        status: "finished", 
        endTime: new Date(),
        cost: cost
      })
      .where(eq(sessions.id, parseInt(id)))
      .returning();
    
    io.to("dashboard").emit("session-updated", updatedSession);
    res.json(updatedSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

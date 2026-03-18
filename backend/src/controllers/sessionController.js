import { db } from "../db/index.js";
import { sessions } from "../db/schema.js";
import { eq, desc } from "drizzle-orm";

export const getSessions = async (req, res) => {
  try {
    const status = req.query.status;
    let query = db.select().from(sessions).orderBy(desc(sessions.createdAt));
    
    if (status) {
      query = query.where(eq(sessions.status, status));
    }
    
    const results = await query;
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [session] = await db.select().from(sessions).where(eq(sessions.id, parseInt(id)));
    
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSession = async (req, res, io) => {
  try {
    const { chargerId, initialEnergyKwh = 0 } = req.body;
    
    if (!chargerId) {
      return res.status(400).json({ error: "chargerId is required" });
    }
    
    const [newSession] = await db.insert(sessions).values({
      chargerId,
      energyKwh: initialEnergyKwh,
      status: "idle",
    }).returning();
    
    if (io) {
      io.to("dashboard").emit("session-updated", newSession);
    }
    
    res.status(201).json(newSession);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

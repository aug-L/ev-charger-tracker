import { db } from "../db/index.js";
import { sessions } from "../db/schema.js";
import { eq, sql } from "drizzle-orm";

export const startSimulator = (io) => {
  console.log("Starting charger simulator...");
  
  setInterval(async () => {
    try {
      // Find all active charging sessions
      const activeSessions = await db.select()
        .from(sessions)
        .where(eq(sessions.status, "charging"));
      
      if (activeSessions.length === 0) return;
      
      for (const session of activeSessions) {
        // Simulate energy accumulation: +0.05 to +0.15 kWh per step
        const increment = parseFloat((Math.random() * 0.1 + 0.05).toFixed(3));
        const newEnergy = parseFloat((session.energyKwh + increment).toFixed(3));
        
        await db.update(sessions)
          .set({ energyKwh: newEnergy })
          .where(eq(sessions.id, session.id));
        
        // Broadcast individual update
        io.to("dashboard").emit("energy-update", {
          sessionId: session.id,
          chargerId: session.chargerId,
          currentKwh: newEnergy,
          timestamp: new Date().toISOString()
        });
      }
      
      // Calculate and broadcast dashboard stats
      const totalKwhResult = await db.select({ 
        total: sql`sum(${sessions.energyKwh})`.mapWith(Number),
        count: sql`count(*)`.mapWith(Number)
      })
      .from(sessions)
      .where(eq(sessions.status, "charging"));
      
      io.to("dashboard").emit("dashboard-stats", {
        activeCount: totalKwhResult[0].count || 0,
        totalKwh: parseFloat((totalKwhResult[0].total || 0).toFixed(2))
      });
      
    } catch (error) {
      console.error("Simulator error:", error);
    }
  }, 4000); // Every 4 seconds
};

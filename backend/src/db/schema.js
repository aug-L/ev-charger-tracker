import { pgTable, serial, text, real, timestamp } from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  chargerId: text("charger_id").notNull(),
  status: text("status").default("idle").notNull(), // 'idle', 'charging', 'finished'
  energyKwh: real("energy_kwh").default(0).notNull(),
  startTime: timestamp("start_time", { withTimezone: true }),
  endTime: timestamp("end_time", { withTimezone: true }),
  cost: real("cost").default(0).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

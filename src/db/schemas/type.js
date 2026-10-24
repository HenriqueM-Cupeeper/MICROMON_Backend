// db/schema.js
import {
    pgTable,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* TIPOS                                                               */
/* ------------------------------------------------------------------ */
export const types = pgTable("types", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 50 }).notNull().unique(),
    weaknessId: uuid("weakness_id").references(() => types.id, {
        onDelete: "set null",
    }),
    resistanceId: uuid("resistencia_id").references(() => types.id, {
        onDelete: "set null",
    }),
});

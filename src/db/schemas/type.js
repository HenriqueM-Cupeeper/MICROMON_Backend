// db/schema.js
import {
    pgTable,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";

/* ------------------------------------------------------------------ */
/* TIPOS                                                               */
/* ------------------------------------------------------------------ */
export const tipos = pgTable("tipos", {
    id: uuid("id").primaryKey().defaultRandom(),
    nome: varchar("nome", { length: 50 }).notNull().unique(),
    fraquezaId: uuid("fraqueza_id").references(() => tipos.id, {
        onDelete: "set null",
    }),
    resistenciaId: uuid("resistencia_id").references(() => tipos.id, {
        onDelete: "set null",
    }),
});

import {
    pgTable,
    integer,
    varchar,
    uuid,
    text
} from "drizzle-orm/pg-core";
import { tipos } from "./type.js ";
/* ------------------------------------------------------------------ */
/* POKEMON                                                             */
/* ------------------------------------------------------------------ */
export const pokemon = pgTable("pokemon", {
    id: uuid("id").primaryKey().defaultRandom(),
    nome: varchar("nome", { length: 100 }).notNull(),
    hp: integer("hp").notNull().default(0),
    status: varchar("status", { length: 30 }).notNull().default("normal"),
    sprite: text("sprite"),
    tipoId: uuid("tipo_id")
        .notNull()
        .references(() => tipos.id, { onDelete: "restrict" }),
});
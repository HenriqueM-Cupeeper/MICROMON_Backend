
/* ------------------------------------------------------------------ */
/* POKEMON                                                             */
/* ------------------------------------------------------------------ */
import {
    pgTable,
    integer,
    varchar,
    uuid,
    text
} from "drizzle-orm/pg-core";

import { types } from "./type.js";

export const pokemon = pgTable("pokemon", {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", { length: 100 }).notNull(),

    hp: integer("hp").notNull().default(0),

    status: varchar("status", { length: 30 })
        .notNull()
        .default("normal"),

    sprite: text("sprite"),

    typeId: uuid("type_id")
        .notNull()
        .references(() => types.id, {
            onDelete: "restrict"
        }),
});
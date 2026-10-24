import {
    pgTable,
    integer,
    varchar,
    uuid,
    text
} from "drizzle-orm/pg-core";

import { types } from "./type.js";

export const moves = pgTable("movimentos", {
    id: uuid("id").primaryKey().defaultRandom(),

    name: varchar("name", { length: 100 })
        .notNull()
        .unique(),

    typeId: uuid("type_id")
        .notNull()
        .references(() => types.id, {
            onDelete: "restrict"
        }),

    category: varchar("category", { length: 20 }).notNull(),

    power: integer("power"),

    precision: integer("precision"),

    description: text("description"),
});
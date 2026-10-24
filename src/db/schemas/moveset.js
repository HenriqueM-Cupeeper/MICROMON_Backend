// db/schema/moveset.js
import {
  pgTable,
  uuid,
  integer,
  primaryKey,
  unique,
  check,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { pokemon } from "./micromon.js";
import { moves } from "./moves.js";

export const moveset = pgTable(
  "moveset",
  {
    pokemonId: uuid("pokemon_id")
      .notNull()
      .references(() => pokemon.id, { onDelete: "cascade" }),

    moveId: uuid("move_id")
      .notNull()
      .references(() => moves.id, { onDelete: "restrict" }),

    // 1..4 — which of the 4 slots this move occupies
    slot: integer("slot").notNull(),
  },
  (t) => ({
    // one move per slot per pokemon
    pk: primaryKey({ columns: [t.pokemonId, t.slot] }),

    // same move can't be equipped twice on the same pokemon
    uniqueMove: unique().on(t.pokemonId, t.moveId),

    // max 4 moves, slots 1..4
    slotCheck: check("moveset_slot_1_to_4", sql`${t.slot} BETWEEN 1 AND 4`),

    // fast lookups: "all moves of this pokemon"
    pokemonIdx: index("idx_moveset_pokemon").on(t.pokemonId),
  })
);
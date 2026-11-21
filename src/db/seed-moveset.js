// src/db/seed-moveset.js
// Starter assignments for the five Micromons currently in the database.
// Edit MOVE_ASSIGNMENTS whenever you change your game design.
// Run after seed-types.js, seed-micromon.js and seed-moves.js.

import { db } from "./index.js";
import { pokemon } from "./schemas/micromon.js";
import { moves } from "./schemas/moves.js";
import { moveset } from "./schemas/moveset.js";

const MOVE_ASSIGNMENTS = [
  { pokemonName: "Penicillium", moveNames: ["Penicilin"] },
  { pokemonName: "Bacteriophage", moveNames: ["Phagocytosis"] },
  { pokemonName: "Myxococcus", moveNames: ["Phagocytosis"] },
  { pokemonName: "Microalgae", moveNames: ["Penicilin"] },
  { pokemonName: "Paramecium", moveNames: ["Phagocytosis"] },
];

async function seedMoveset() {
  try {
    const [pokemonRows, moveRows] = await Promise.all([
      db.select().from(pokemon),
      db.select().from(moves),
    ]);

    const pokemonByName = new Map(pokemonRows.map((item) => [item.name, item]));
    const moveByName = new Map(moveRows.map((item) => [item.name, item]));
    const assignmentsToInsert = [];

    for (const assignment of MOVE_ASSIGNMENTS) {
      const micromon = pokemonByName.get(assignment.pokemonName);
      if (!micromon) {
        throw new Error(`Micromon '${assignment.pokemonName}' was not found. Seed it first.`);
      }
      if (!Array.isArray(assignment.moveNames) || assignment.moveNames.length === 0) {
        throw new Error(`Assign at least one move to ${assignment.pokemonName}.`);
      }
      if (assignment.moveNames.length > 4) {
        throw new Error(`${assignment.pokemonName} has more than four moves.`);
      }

      assignment.moveNames.forEach((moveName, index) => {
        const move = moveByName.get(moveName);
        if (!move) {
          throw new Error(`Move '${moveName}' was not found. Seed it first.`);
        }
        assignmentsToInsert.push({
          pokemonId: micromon.id,
          moveId: move.id,
          slot: index + 1,
        });
      });
    }

    if (assignmentsToInsert.length > 0) {
      await db.insert(moveset).values(assignmentsToInsert).onConflictDoNothing();
    }

    console.log(`Moveset seed complete (${assignmentsToInsert.length} starter assignments checked).`);
    console.log("Review MOVE_ASSIGNMENTS in src/db/seed-moveset.js to customize each Micromon's attacks.");
  } catch (error) {
    console.error("Error seeding moveset:", error);
    process.exitCode = 1;
  }
}

seedMoveset();

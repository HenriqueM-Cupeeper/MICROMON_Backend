// src/server/controllers/micromon-controller.js
import { asc, eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { pokemon } from "../../db/schemas/micromon.js";
import { types } from "../../db/schemas/type.js";
import { moves } from "../../db/schemas/moves.js";
import { moveset } from "../../db/schemas/moveset.js";

export const createMicromon = async (req, res) => {
  try {
    const {
      name,
      hp,
      maxHp,
      status = "normal",
      sprite = null,
      type: typeName,
    } = req.body ?? {};

    if (typeof name !== "string" || !name.trim() || typeof typeName !== "string" || !typeName.trim()) {
      return res.status(400).json({ error: "Name and type are required." });
    }

    const parsedMaxHp = Number.isInteger(Number(maxHp)) && maxHp !== undefined
      ? Number(maxHp)
      : (Number.isInteger(Number(hp)) && hp !== undefined ? Number(hp) : 100);
    const parsedHp = Number.isInteger(Number(hp)) && hp !== undefined
      ? Number(hp)
      : parsedMaxHp;

    if (parsedMaxHp <= 0 || parsedHp < 0 || parsedHp > parsedMaxHp) {
      return res.status(400).json({
        error: "HP must be between 0 and maxHp, and maxHp must be greater than 0.",
      });
    }

    const [foundType] = await db
      .select()
      .from(types)
      .where(eq(types.name, typeName.trim()))
      .limit(1);

    if (!foundType) {
      return res.status(404).json({ error: `Type '${typeName}' not found.` });
    }

    const [newPokemon] = await db
      .insert(pokemon)
      .values({
        name: name.trim(),
        hp: parsedHp,
        maxHp: parsedMaxHp,
        status,
        sprite,
        typeId: foundType.id,
      })
      .returning();

    return res.status(201).json(newPokemon);
  } catch (error) {
    console.error("Error creating Micromon:", error);

    if (error?.code === "23505") {
      return res.status(409).json({ error: "A Micromon with this name already exists." });
    }

    return res.status(500).json({ error: "Internal server error." });
  }
};

// Returns each Micromon once, with its equipped moves ordered by moveset slot.
export async function getMicromons(req, res) {
  try {
    const rows = await db
      .select({
        id: pokemon.id,
        name: pokemon.name,
        hp: pokemon.hp,
        maxHp: pokemon.maxHp,
        status: pokemon.status,
        sprite: pokemon.sprite,
        typeId: pokemon.typeId,
        typeName: types.name,
        moveId: moves.id,
        moveName: moves.name,
        moveCategory: moves.category,
        movePower: moves.power,
        movePrecision: moves.precision,
        moveDescription: moves.description,
        moveSlot: moveset.slot,
      })
      .from(pokemon)
      .leftJoin(moveset, eq(moveset.pokemonId, pokemon.id))
      .leftJoin(moves, eq(moveset.moveId, moves.id))
      .leftJoin(types, eq(pokemon.typeId, types.id))
      .orderBy(asc(pokemon.name), asc(moveset.slot));

    const micromonMap = new Map();

    for (const row of rows) {
      if (!micromonMap.has(row.id)) {
        micromonMap.set(row.id, {
          id: row.id,
          name: row.name,
          hp: row.hp,
          maxHp: row.maxHp,
          status: row.status,
          sprite: row.sprite,
          typeId: row.typeId,
          typeName: row.typeName,
          moves: [],
        });
      }

      if (row.moveId) {
        micromonMap.get(row.id).moves.push({
          id: row.moveId,
          name: row.moveName,
          category: row.moveCategory,
          power: row.movePower,
          precision: row.movePrecision,
          description: row.moveDescription,
          slot: row.moveSlot,
        });
      }
    }

    return res.status(200).json(Array.from(micromonMap.values()));
  } catch (error) {
    console.error("Error retrieving Micromons with moves:", error);
    return res.status(500).json({ message: "Could not retrieve Micromons." });
  }
}

// src/server/controllers/micromon.controller.js
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { pokemon } from "../../db/schemas/micromon.js";
import { types } from "../../db/schemas/type.js";


export const createMicromon = async (req, res) => {
  try {

    // 1. Receive data from the request
    const { name, hp, status, sprite, type: typeName } = req.body;

    // 2. Basic validation
    if (!name || !typeName) {
      return res.status(400).json({
        error: "Name and type are required"
      });
    }

    // 3. Find the type in the database
    const [foundType] = await db
      .select()
      .from(types)
      .where(eq(types.name, typeName))
      .limit(1);

    // 4. Check if the type exists
    if (!foundType) {
      return res.status(404).json({
        error: `Type '${typeName}' not found`
      });
    }

    // 5. Insert the Micromon using the retrieved UUID
    const [newPokemon] = await db
      .insert(pokemon)
      .values({
        name,
        hp,
        status,
        sprite,
        typeId: foundType.id
      })
      .returning();

    // 6. Return the created Micromon
    return res.status(201).json(newPokemon);

  } catch (error) {

    console.error("Error creating Micromon:", error);

    if (error.code === "23505") {
      return res.status(409).json({
        error: "A Micromon with this name already exists"
      });
    }

    return res.status(500).json({
      error: "Internal server error"
    });
  }
};

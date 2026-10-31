
import { db } from "./index.js";
import { moves } from "./schemas/moves.js";
import { types } from "./schemas/type.js";

// Initial moves available in the Micromon game
const initialMoves = [
    {
        name: "Penicilin",
        typeName: "Fungi",
        category: "special",
        power: 100,
        precision: 75,
        description: "Releases antibiotic molecules that harm the opponent.",
    },
    {
        name: "Phagocytosis",
        typeName: "Protozoan",
        category: "physical",
        power: 70,
        precision: 80,
        description: "Engulfs part of the foe into its plasma membrane.",
    },
];

async function seedMoves() {
    try {

        // 1. Retrieve all existing types from the database
        const existingTypes = await db
            .select()
            .from(types);

        // 2. Create a Map connecting type names to their UUIDs
        const typeMap = new Map(
            existingTypes.map(type => [
                type.name,
                type.id
            ])
        );

        // 3. Associate each move with its corresponding type UUID
        const movesToInsert = initialMoves.map(
            ({ typeName, ...move }) => {

                const typeId = typeMap.get(typeName);

                if (!typeId) {
                    throw new Error(
                        `Type "${typeName}" was not found in the database.`
                    );
                }

                return {
                    ...move,
                    typeId: typeId,
                };
            }
        );

        // 4. Insert moves into the database
        await db
            .insert(moves)
            .values(movesToInsert)
            .onConflictDoNothing();

        console.log("Moves seeded successfully!");

    } catch (error) {

        console.error("Error seeding moves:", error);

        process.exitCode = 1;
    }
}

seedMoves();

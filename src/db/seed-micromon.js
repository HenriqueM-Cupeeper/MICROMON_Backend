
import { db } from "./index.js";
import { pokemon } from "./schemas/micromon.js";
import { types } from "./schemas/type.js";

// Initial Micromons
const initialMicromons = [
    {
        name: "Penicillium",
        hp: 100,
        status: "normal",
        sprite: null,
        typeName: "Fungi",
    },
    {
        name: "Myxococcus",
        hp: 150,
        status: "normal",
        sprite: null,
        typeName: "Bacteria",
    },
    {
        name: "Paramecium",
        hp: 110,
        status: "normal",
        sprite: null,
        typeName: "Protozoan",
    },
    {
        name: "Bacteriophage",
        hp: 80,
        status: "normal",
        sprite: null,
        typeName: "Virus",
    },
    {
        name: "Microalgae",
        hp: 90,
        status: "normal",
        sprite: null,
        typeName: "Autothropic",
    },
];

async function seedMicromons() {
    try {

        // 1. Get all existing types from the database
        const existingTypes = await db
            .select()
            .from(types);

        // 2. Create a map connecting type names to their UUIDs
        const typeMap = new Map(
            existingTypes.map(type => [
                type.name,
                type.id
            ])
        );

        // 3. Associate each Micromon with its type UUID
        const micromonsToInsert = initialMicromons.map(
            ({ typeName, ...micromon }) => {

                const typeId = typeMap.get(typeName);

                if (!typeId) {
                    throw new Error(
                        `Type "${typeName}" was not found in the database.`
                    );
                }

                return {
                    ...micromon,
                    typeId: typeId,
                };
            }
        );

        // 4. Insert Micromons into the database
        await db
            .insert(pokemon)
            .values(micromonsToInsert)
            .onConflictDoNothing();

        console.log("Micromons seeded successfully!");

    } catch (error) {

        console.error("Error seeding Micromons:", error);

        process.exitCode = 1;
    }
}

seedMicromons();

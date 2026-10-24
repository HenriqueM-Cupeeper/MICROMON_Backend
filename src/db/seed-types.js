

import { db } from "./index.js";
import { types } from "./schemas/type.js";

const initialTypes = [
  { name: "Bacteria" },
  { name: "Fungi" },
  { name: "Protozoan" },
  { name: "Virus" },
  { name: "Autothropic"},
];

async function seedTypes() {
  try {
    await db
      .insert(types)
      .values(initialTypes)
      .onConflictDoNothing();

    console.log("Types seeded successfully!");
  } catch (error) {
    console.error("Error seeding types:", error);
    process.exitCode = 1;
  }
}

seedTypes();

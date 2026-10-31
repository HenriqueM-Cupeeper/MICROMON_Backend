import express from "express";
import micromonRoutes from "./routers/micromon-router.js";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/micromon", micromonRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

import express from "express";
import micromonRoutes from "./routers/micromon-router.js";
import cors from "cors";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.use("/api/micromon", micromonRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
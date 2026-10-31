import express from "express";
import { createMicromon } from "../controllers/micromon-controller.js";

const router = express.Router();

router.post("/", createMicromon);

export default router;

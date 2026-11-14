import express from "express";
import { createMicromon ,
    getMicromons
} from "../controllers/micromon-controller.js";

const router = express.Router();

router.get("/", getMicromons);
router.post("/", createMicromon);

export default router;

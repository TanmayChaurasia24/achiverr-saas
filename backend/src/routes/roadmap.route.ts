import { Router } from "express";
import { createRoadmapDatabase, generateRoadmapAi } from "../controllers/roadmap.controller";

const router = Router();

router.post("/generate", generateRoadmapAi)
router.post("/create/:goalId", createRoadmapDatabase)

export default router
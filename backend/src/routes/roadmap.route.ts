import { Router } from "express";
import { createRoadmapDatabase, fetchParticularRoadmap, generateRoadmapAi } from "../controllers/roadmap.controller";

const router = Router();

router.post("/generate", generateRoadmapAi)
router.post("/create/:goalId", createRoadmapDatabase)
router.get("/fetch/:goalId", fetchParticularRoadmap)

export default router
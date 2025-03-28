import { Router } from "express";
import { createGoal } from "../controllers/goals.controller";

const router = Router();

router.post("/create/:userId", createGoal)

export default router
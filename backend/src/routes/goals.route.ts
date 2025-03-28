import { Router } from "express";
import { createGoal, getGoal, goalsBulk} from "../controllers/goals.controller";

const router = Router();

router.post("/create/:userId", createGoal)
router.get("/get/:goalId", getGoal) 
router.post("/bulk", goalsBulk) 

export default router
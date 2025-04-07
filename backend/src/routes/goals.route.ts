import { Router } from "express";
import { createGoal, getGoal, goalsBulk, updateGoal} from "../controllers/goals.controller";

const router = Router();

router.post("/create/:userId", createGoal)
router.get("/get/:goalId", getGoal) 
router.post("/bulk", goalsBulk) 
router.put("/update/starttime/:goalId", updateGoal) 

export default router
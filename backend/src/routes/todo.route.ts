import { Router } from "express";
import { CreateTodo, createTodoWithAI, fetchTodoGoal } from "../controllers/todo.controller";

const router = Router();

router.post("/create/:goalId", CreateTodo);
router.get("/fetch/:goalId", fetchTodoGoal)
router.post("/generate/ai", createTodoWithAI)

export default router;
import { Router } from "express";
import { CreateTodo, createTodoWithAI, fetchTodoGoal, updateTodoDatabase } from "../controllers/todo.controller";

const router = Router();

router.post("/create/:goalId", CreateTodo);
router.get("/fetch/:goalId", fetchTodoGoal)
router.post("/generate/ai", createTodoWithAI)
router.put("/update/completed/:todoId", updateTodoDatabase)

export default router;
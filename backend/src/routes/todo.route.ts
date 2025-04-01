import { Router } from "express";
import { CreateTodo, fetchTodoGoal } from "../controllers/todo.controller";

const router = Router();

router.post("/create/:goalId", CreateTodo);
router.get("/fetch/:goalId", fetchTodoGoal)

export default router;
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const CreateTodo = async (req: Request, res: Response): Promise<any> => {
  try {
    const { goalId } = req.params;
    const { description, day, completed } = req.body;

    if (!goalId || !day || !description) {
      return res.status(400).json({ message: "Please fill in all fields." });
    }

    const todo = await prisma.todo.create({
      data: {
        description,
        goalId,
        day,
        completed,
      },
    });

    if (!todo) {
      return res.status(400).json({ message: "Failed to create task." });
    }

    return res.status(201).json({
      message: "task created successfully",
      todo,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while creating the todo",
      error,
    });
  }
};

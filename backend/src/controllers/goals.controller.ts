import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createGoal = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;
    const { title, description, timeframe, deadline } = req.body;

    if (!userId || !title || !description || !timeframe || !deadline) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }

    const isthere = await prisma.goal.findFirst({
      where: {
        title: title,
        userId: userId,
      },
    });

    if (isthere) {
      return res.status(500).json({
        message: `goal with the title ${title} is already there for the user with id ${userId}`,
      });
    }

    const createGoal = await prisma.goal.create({
      data: {
        title: title,
        description: description,
        timeframe: timeframe,
        deadline: deadline,
        userId: userId,
      },
    });

    if (!createGoal) {
      return res.status(500).json({ message: "Goal was not created" });
    }

    return res.status(201).json({
      message: "goal created successfully",
      data: createGoal,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "error while creating goals",
      error: error.message,
    });
  }
};

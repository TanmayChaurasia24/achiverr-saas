import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createGoal = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;
    const { title, description, timeframe } = req.body;

    if (!userId || !title || !description || !timeframe) {
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
        userId: userId,
      },
    });

    if (!createGoal) {
      return res.status(500).json({ message: "Goal was not created" });
    }

    return res.status(201).json({
      message: "goal created successfully",
      goalId: createGoal.id,
      data: createGoal,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "error while creating goals",
      error: error.message,
    });
  }
};

export const getGoal = async (req: Request, res: Response): Promise<any> => {
  try {
    const { goalId } = req.params;

    if (!goalId) {
      return res.status(400).json({
        message: "goal id is required",
      });
    }

    const goal = await prisma.goal.findUnique({
      where: {
        id: goalId,
      },
      include: {
        roadmapItems: true,
        tasks: true,
      },
    });

    if (!goal) {
      return res.status(404).json({
        message: "goal not found",
      });
    }

    return res.status(200).json({
      message: "goal fetched successfully",
      goal,
    });
  } catch (error: any) {
    return res.status(500).json({
      message: "error while getting goal",
      error: error.message,
    });
  }
};

export const goalsBulk = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.body;

    if(!userId) {
      return res.status(400).json({
        message: "userId not present",
        userId: userId
      })
    }

    const allGoals = await prisma.goal.findMany({
      where: {
        userId,
      }
    })
    
    if(!allGoals) {
      return res.status(500).json({
        message: "error while fetching all goals"
      })
    }

    console.log("fetched goals from backend: ", allGoals);

    return res.status(200).json({
      message: "goals fetched successfully",
      goals: allGoals,
    })
    
  } catch (error) {
    return res.status(500).json({
      message: "error while getting goals",
      error: error,
    });
  }
}
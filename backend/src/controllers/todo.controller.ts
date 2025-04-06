import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { GoogleGenAI } from "@google/genai";

const prisma = new PrismaClient();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

export const createTodoWithAI = async (req: Request, res: Response) => {
  try {
    const { goalId, userId } = req.body;

    if (!goalId || !userId) {
      return res
        .status(400)
        .json({ message: "goalId and userId are required" });
    }

    // 1. Fetch roadmap from your backend
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/roadmap/fetch/${goalId}`
    );
    if (!response.ok) throw new Error("Failed to fetch roadmap data");

    const fetchRoadmapResponse: {
      message: string;
      GoalRoadmap: {
        id: string;
        goalId: string;
        day: string;
        description: string;
        completed: boolean;
        createdAt: Date;
        updatedAt: Date;
      }[];
    } = await response.json();

    const roadmap = fetchRoadmapResponse.GoalRoadmap;

    // Get goal start date
    const goal: any = await prisma.goal.findFirst({
      where: {
        id: goalId,
      },
    });
    if (!goal || !goal.startDate) {
      return res
        .status(404)
        .json({ message: "Goal not found or startDate missing" });
    }

    const startDate = new Date(goal.startDate);
    const today = new Date();
    const dayDiff =
      Math.floor(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      ) + 1;

    // get all completed tasks from database
    const completedTodos: any = await prisma.todo.findMany({
      where: { goalId, completed: true },
    });
    const completedTaskTitles = completedTodos.map((todo: any) => todo.description);
    
    // get all the not completed task from database
    const notCompletedTodos: any = await prisma.todo.findMany({
      where: { goalId, completed: false },
    })
    const notcompletedTodos = notCompletedTodos.map((todo: any) => todo.description);


    // match current day with roadmap item
    const todayRoadmap = roadmap.find((r) => r.day === `Day ${dayDiff}`);
    if (!todayRoadmap) {
      return res
        .status(200)
        .json({ message: "No tasks scheduled for today", todos: [] });
    }

    const remainingTasks = todayRoadmap.description
      .split("\n")
      .map((t) => t.trim())
      .filter((task) => task && !completedTaskTitles.includes(task));

    if (remainingTasks.length === 0) {
      return res
        .status(200)
        .json({ message: "All tasks completed for today", todos: [] });
    }

    // 5. AI Prompt
    const prompt = `
      Generate a structured Todos in array format containing json objects based on the given details.
      You are a productivity assistant. Given a high-level task from a roadmap and a user’s progress, generate a daily TODO list by breaking down remaining tasks into smaller actionable subtasks.

      ### Input:
      - Remaining todos till now: ${JSON.stringify(notcompletedTodos)}
      - Completed todos so far: ${JSON.stringify(completedTaskTitles)}
      - Current day: ${dayDiff}
      - Roadmap duration: ${roadmap.length} days

      ### Instructions:
      - Break each task into 2–3 actionable subtasks if possible.
      - Only include tasks relevant to the current day and not yet completed.
      - Ensure the output is in the following format:

      [
        "Subtask 1",
        "Subtask 2",
        ...
      ]
    `.trim();

    const AiTodoResponse = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    const generatedText: string | undefined = AiTodoResponse?.text
    if(generatedText == undefined) {
      return res.status(400).json({
        message: "Failed to generate todo"
      })
    }

    const finalText = generatedText.trim().replace(/^```json|```$/g, '')

    if(!finalText) {
      return res.status(400).json({
        message: "Failed to generate todo"
      })
    }

    const todos = JSON.parse(finalText)

    return res.status(200).json({
      message: "Todos generated successfully",
      date: today.toISOString().split("T")[0],
      todos
    });
  } catch (error) {
    console.error("AI TODO generation error:", error);
    return res.status(500).json({
      message: "Error while generating the todo with AI",
      error,
    });
  }
};

export const fetchTodoGoal = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { goalId } = req.params;

    if (!goalId) {
      return res.status(500).json({
        message: "error while fetching the todos of the goal",
      });
    }

    const GoalTodos: {
      id: string;
      goalId: string;
      description: string;
      day: string;
      completed: boolean;
      createdAt: Date;
      updatedAt: Date;
    }[] = await prisma.todo.findMany({
      where: {
        goalId,
      },
    });

    if (!GoalTodos) {
      return res.status(500).json({
        message: "error while fetching the todos of the goal",
      });
    }

    return res.status(201).json({
      message: "todos for the goals fetched successfully",
      GoalTodos,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while fetching the todo of the goal",
      error: error,
    });
  }
};

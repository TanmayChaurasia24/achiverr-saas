import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { GoogleGenAI } from "@google/genai";
import { findPackageJSON } from "module";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const prisma = new PrismaClient();

export const createRoadmapDatabase = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { goalId } = req.params;
    const { roadmapitems } = req.body;

    if (!Array.isArray(roadmapitems) || !goalId || roadmapitems.length === 0) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    const Currentroadmap = [];

    for (const item of roadmapitems) {
      const { timeperiod, tasks } = item;

      if (!timeperiod || !Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({
          message: "Each roadmap item must have a time period and tasks.",
        });
      }

      const roadmapitem = await prisma.roadmapItem.create({
        data: {
          goalId,
          day: timeperiod,
          description: tasks.join(", "),
        },
      });

      if (!roadmapitem) {
        return res
          .status(400)
          .json({ message: "Failed to create roadmap item." });
      }

      Currentroadmap.push(roadmapitem);
    }

    return res.status(201).json({
      message: "roadmap created",
      Currentroadmap,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while creating roadmap",
      error: error,
    });
  }
};


export const generateRoadmapAi = async (req: Request, res: Response): Promise<any> => {
  try {
    const { goalTitle, goalDescription, timeframe } = req.body;

    if (!goalDescription || !goalTitle || !timeframe) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    const prompt = `
      Generate a structured roadmap in array format containing json objects based on the given details.
      
      ### Input Details:
      - Title: "${goalTitle}"
      - Description: "${goalDescription}"
      - Timeframe: "${timeframe} days"

      ### Instructions:
      - Divide the timeframe into logical periods (e.g., "Day 1-3", "Day 4-6").
      - Each time period should contain relevant tasks in a "tasks" array.
      - Ensure that the output is **ONLY** valid JSON with no extra text.
      
      ### Expected Format:
      [
          { "timeperiod": "Day 1-3", "tasks": ["Task 1", "Task 2"] },
          { "timeperiod": "Day 4-6", "tasks": ["Task 3", "Task 4"] }
      ]
    `.trim();

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const generatedText: string | undefined = response?.text
    if(generatedText == undefined) {
      return res.status(400).json({ message: "Failed to generate roadmap" });
    }
    const finalText = generatedText.trim().replace(/^```json|```$/g, '')
    
    if (!finalText) {
      return res.status(500).json({ message: "Failed to generate roadmap." });
    }
    // console.log(generatedText);
    
    const roadmap = JSON.parse(finalText);

    return res.status(200).json({ success: true, data: roadmap });
  } catch (error: any) {
    console.error("Error generating roadmap:", error);
    return res.status(500).json({
      message: "Error while generating roadmap",
      error: error.message || error,
    });
  }
};

export const fetchParticularRoadmap = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { goalId } = req.params;

    if (!goalId) {
      return res.status(500).json({
        message: "goal id is not present in fetch particular roadmap",
        goalId,
      });
    }

    const GoalRoadmap: {
      id: string;
      goalId: string;
      day: string;
      description: string;
      completed: boolean;
      createdAt: Date;
      updatedAt: Date;
    }[] = await prisma.roadmapItem.findMany({
      where: {
        goalId,
      },
    });

    if (!GoalRoadmap) {
      return res.status(500).json({
        message: "error while fetching the roadmap"
      })
    }

    return res.status(201).json({
      message: "roadmap for the goal fetched successfully",
      GoalRoadmap
    })
  } catch (error: any) {
    return res.status(500).json({
      message: "error while fetching the roadmap for a goal",
      error: error.message,
    });
  }
};

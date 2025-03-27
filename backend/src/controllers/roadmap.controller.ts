import { PrismaClient } from "@prisma/client";
import { timeEnd } from "console";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const createRoadmapDatabase = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { goalId } = req.params;
    const { day, description } = req.body;

    if (!goalId || !day || !description) {
      return res.status(400).json({ message: "Please fill all fields." });
    }

    const roadmap = await prisma.roadmapItem.create({
      data: {
        goalId,
        day,
        description,
      },
    });

    if (!roadmap) {
      return res
        .status(400)
        .json({ message: "Failed to create roadmap item." });
    }

    return res.status(201).json({
      message: "roadmap created",
      roadmap,
    });
  } catch (error) {
    return res.status(500).json({
      message: "error while creating roadmap",
      error: error,
    });
  }
};


export const generateRoadmapAi = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const { goalTitle, goalDescription, timeframe } = req.body;

    if (!goalDescription || !goalTitle || !timeframe) {
      return res.status(400).json({ message: "Please fill all fields." });
    }
    const response = await fetch(
        "https://api.cloudflare.com/client/v4/accounts/a08822ecd78ffb3acede87da0e234c0e/ai/run/@cf/meta/llama-3-8b-instruct",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            messages: [
              {
                role: "system",
                content: "You are an AI assistant that strictly follows the prompt and returns responses accurately in JSON format only.",
              },
              {
                role: "user",
                content: `
                  Generate a structured roadmap in JSON format based on the given details.
      
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
                      { "timePeriod": "Day 1-3", "tasks": ["Task 1", "Task 2"] },
                      { "timePeriod": "Day 4-6", "tasks": ["Task 3", "Task 4"] }
                  ]
                `.trim(),
              },
            ],
            max_tokens: 500,
            stream: false,
          }),
        }
      );
      
    
    if (!response.ok) {
        return res.status(response.status).json({ message: response.statusText });
    }
    console.log("response is: ", response);
    
    const data = await response.json();

    console.log("data is: ", data);
    

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error("Error generating roadmap:", error);
    return res.status(500).json({
      message: "Error while generating roadmap",
      error: error.message || error,
    });
  }
};

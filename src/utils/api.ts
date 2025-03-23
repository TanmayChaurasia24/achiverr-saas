
import { Goal, RoadmapItem, Task } from "@/types";

const apikey = "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";


export const generateRoadmap = async (
  goalTitle: string,
  goalDescription: string,
  timeframe: number
): Promise<RoadmapItem[]> => {
  console.log("Generating roadmap for:", { goalTitle, goalDescription, timeframe });
  if(!apikey) {
    console.error("No API key found");
    return getFallbackRoadmap(timeframe);
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apikey}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Create a ${timeframe}-day roadmap for achieving "${goalTitle}". 

                **Roadmap Requirements:**
                1️⃣ Split the roadmap into specific days or day ranges (e.g., "Day 1-3", "Day 4").
                2️⃣ Create a detailed, actionable plan with specific tasks for each time period.
                3️⃣ Start from the basics and progressively move to advanced concepts.
                4️⃣ Respect user preferences from this description: "${goalDescription}". 
                    - For example: if the user mentions leave from Day 3-5, no tasks should be scheduled for those days.
                5️⃣ Return ONLY the roadmap as JSON, with this exact format:
                   [
                     { "timePeriod": "Day 1-3", "tasks": ["Learn the basics", "Set up environment"] },
                     { "timePeriod": "Day 4-6", "tasks": ["Intermediate topics", "Build a mini-project"] }
                   ]

                Important: Return the output as a clean JSON array — no extra text, no markdown formatting like \`\`\`json.
                Just the raw JSON array.
                `,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Failed to fetch roadmap from API:", await response.text());
      throw new Error("Failed to fetch roadmap from API");
    }

    const data = await response.json();
    console.log("AI response data:", data);
        
    // Extract the AI-generated roadmap
    let roadmapData = data.choices?.[0]?.message?.content;
    if (!roadmapData) {
      console.error("Invalid response format from AI:", data);
      throw new Error("Invalid response format from AI");
    }
    
    console.log("Raw roadmap data:", roadmapData);
    
    // Clean the response by removing any markdown code block syntax
    roadmapData = roadmapData.replace(/```json|```/g, "").trim();
    console.log("Cleaned roadmap data:", roadmapData);
    
    // Try to parse the JSON
    let parsedRoadmapData;
    try {
      parsedRoadmapData = JSON.parse(roadmapData);
    } catch (error) {
      console.error("Error parsing roadmap data:", error);
      // Fallback to a basic roadmap if parsing fails
      return getFallbackRoadmap(timeframe);
    }
    
    if (!Array.isArray(parsedRoadmapData)) {
      console.error("Parsed roadmap data is not an array:", parsedRoadmapData);
      return getFallbackRoadmap(timeframe);
    }

    const roadmap: RoadmapItem[] = parsedRoadmapData.map((item: any) => ({
      id: crypto.randomUUID(),
      timePeriod: item.timePeriod,
      tasks: item.tasks || [],
      completed: false,
    }));
    
    console.log("Final roadmap:", roadmap);
    return roadmap;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return getFallbackRoadmap(timeframe);
  }
};

function getFallbackRoadmap(timeframe: number): RoadmapItem[] {
  console.log("Using fallback roadmap");
  
  // Create sections based on timeframe
  const sections = Math.min(5, Math.max(3, Math.ceil(timeframe / 7)));
  const daysPerSection = Math.ceil(timeframe / sections);
  
  const roadmap: RoadmapItem[] = [];
  
  for (let i = 0; i < sections; i++) {
    const startDay = i * daysPerSection + 1;
    const endDay = Math.min((i + 1) * daysPerSection, timeframe);
    
    const tasks = [
      i === 0 ? "Research and understand the basics" : `Continue building on previous knowledge`,
      i === 0 ? "Set up required tools and environment" : `Practice core skills from days ${startDay-daysPerSection}-${startDay-1}`,
      `Create a plan for days ${startDay}-${endDay}`,
      i === sections-1 ? "Review overall progress and achievements" : `Prepare for the next phase`
    ];
    
    roadmap.push({
      id: crypto.randomUUID(),
      timePeriod: `Day ${startDay}-${endDay}`,
      tasks,
      completed: false
    });
  }
  
  return roadmap;
}

export const generateDailyTasks = async (
  goal: Goal,
  day: number
): Promise<Task[]> => {
  console.log("Generating tasks for day:", day, "of goal:", goal.title);

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apikey}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        model: "google/gemma-3-27b-it:free",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Generate a list of specific tasks for Day ${day} of my goal: "${goal.title}".

                **Goal Description:** ${goal.description || "No specific description provided"}
                **Overall Timeframe:** ${goal.timeframe} days
                **Current Progress:** ${goal.progress}% complete

                **Task Generation Guidelines:**
                1. Create 3-5 specific, actionable tasks for Day ${day}.
                2. Tasks should be appropriate for the current stage of the goal (${day} out of ${goal.timeframe} days).
                3. Each task should be clear, specific, and achievable within a day.
                4. If it's an early day (first 25% of timeline): focus on research, planning, and setup.
                5. If it's a middle day (25-75% of timeline): focus on implementation and execution.
                6. If it's a late day (last 75% of timeline): focus on refinement, testing, and review.

                Return ONLY a clean JSON array of task descriptions:
                ["Task 1 description", "Task 2 description", "Task 3 description"]
                
                NO other text or formatting. Just the raw JSON array.
                `
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("Failed to fetch tasks from API:", await response.text());
      throw new Error("Failed to fetch tasks from API");
    }

    const data = await response.json();
    console.log("Tasks API response:", data);
    
    // Extract the AI-generated tasks
    const tasksData = data.choices?.[0]?.message?.content;
    if (!tasksData) {
      console.error("Invalid response format from AI:", data);
      throw new Error("Invalid response format from AI");
    }
    
    console.log("Raw tasks data:", tasksData);
    
    // Clean the response and parse JSON
    const cleanedTasksData = tasksData.replace(/```json|```/g, "").trim();
    console.log("Cleaned tasks data:", cleanedTasksData);
    
    let parsedTasks;
    try {
      parsedTasks = JSON.parse(cleanedTasksData);
    } catch (error) {
      console.error("Error parsing tasks data:", error);
      return fallbackTasks(goal, day);
    }
    
    if (!Array.isArray(parsedTasks)) {
      console.error("Parsed tasks data is not an array:", parsedTasks);
      return fallbackTasks(goal, day);
    }
    
    // Create task objects
    const tasks: Task[] = parsedTasks.map((description: string) => ({
      id: crypto.randomUUID(),
      goalId: goal.id,
      description,
      day: day,
      completed: false,
      createdAt: new Date().toISOString(),
    }));
    
    console.log("Final tasks:", tasks);
    return tasks;
  } catch (error) {
    console.error("Error generating daily tasks:", error);
    // Fallback to some basic tasks if API fails
    return fallbackTasks(goal, day);
  }
};

// Fallback function for when the API fails
function fallbackTasks(goal: Goal, day: number): Task[] {
  console.log("Using fallback tasks generation");
  const tasksCount = Math.floor(Math.random() * 3) + 2; // 2-4 tasks
  const tasks: Task[] = [];
  
  for (let i = 1; i <= tasksCount; i++) {
    tasks.push({
      id: crypto.randomUUID(),
      goalId: goal.id,
      description: `Task ${i} for day ${day}: ${getRandomTask(
        goal.title,
        goal.progress,
        day,
        goal.timeframe
      )}`,
      day: day,
      completed: false,
      createdAt: new Date().toISOString(),
    });
  }
  
  return tasks;
}

// Helper function to generate random tasks based on context
function getRandomTask(
  goalTitle: string,
  progress: number,
  day: number,
  totalDays: number
): string {
  const researchTasks = [
    `Research best practices for ${goalTitle}`,
    `Find resources about ${goalTitle}`,
    `Study successful examples of ${goalTitle}`,
    `Look for tools that can help with ${goalTitle}`,
    `Create a list of references for ${goalTitle}`,
  ];

  const planningTasks = [
    `Create a detailed plan for today's work on ${goalTitle}`,
    `Break down today's goals into smaller steps`,
    `Set specific milestones for ${goalTitle}`,
    `Schedule time blocks for working on ${goalTitle}`,
    `Prioritize today's actions for ${goalTitle}`,
  ];

  const executionTasks = [
    `Implement key aspects of ${goalTitle}`,
    `Work on the core components of ${goalTitle}`,
    `Execute the main tasks for ${goalTitle}`,
    `Focus on building the essential parts of ${goalTitle}`,
    `Complete the primary objectives for ${goalTitle} today`,
  ];

  const reviewTasks = [
    `Review progress on ${goalTitle}`,
    `Identify areas of improvement for ${goalTitle}`,
    `Get feedback on your work on ${goalTitle}`,
    `Evaluate the results of ${goalTitle} so far`,
    `Assess what's working and what's not for ${goalTitle}`,
  ];

  // Early days focus on research and planning
  if (day <= totalDays * 0.25) {
    return progress < 30
      ? researchTasks[Math.floor(Math.random() * researchTasks.length)]
      : planningTasks[Math.floor(Math.random() * planningTasks.length)];
  }
  // Middle days focus on execution
  else if (day <= totalDays * 0.75) {
    return executionTasks[Math.floor(Math.random() * executionTasks.length)];
  }
  // Final days focus on review and refinement
  else {
    return reviewTasks[Math.floor(Math.random() * reviewTasks.length)];
  }
}

import { Goal, RoadmapItem, Task } from "@/types";


const apikey ="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";

export const generateRoadmap = async (
  goalTitle: string,
  goalDescription: string,
  timeframe: number
): Promise<RoadmapItem[]> => {
  console.log("Generating roadmap for:", { goalTitle, goalDescription, timeframe });
  if(!apikey) {
    console.log("not api key");
    
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
                1️⃣ Start from the basics and progressively move to advanced concepts.
                2️⃣ Split the roadmap into day ranges (e.g., "Day 1-3") — each block must contain a list of tasks for that period.
                3️⃣ Respect user preferences from this description: "${goalDescription}". 
                    - For example: if the user mentions leave from Day 3-5, no tasks should be scheduled for those days.
                4️⃣ Return the roadmap as an array of JSON objects. Each object must have:
                  - **timePeriod**: A string representing the days (e.g., "Day 1-3")
                  - **tasks**: An array of tasks or milestones for this period.

                Expected Output (example):[
                  { "timePeriod": "Day 1-3", "tasks": ["Learn the basics", "Set up environment"] },
                  { "timePeriod": "Day 4-6", "tasks": ["Intermediate topics", "Build a mini-project"] },
                  { "timePeriod": "Day 7", "tasks": ["Review and prepare for advanced concepts"] }
                ]

                important: Return the output as a clean JSON array — no extra text, no formatting, and no backticks like \` \`\`\`json \`. Only the raw JSON array itself.
                `,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) throw new Error("Failed to fetch roadmap from API");

    const data = await response.json();
    console.log("data is: ", data);
        
    // Extract the AI-generated roadmap
    const roadmapData = data.choices?.[0]?.message?.content;
    if (!roadmapData) throw new Error("Invalid response format from AI");
    console.log("editing response");
    
    await roadmapData.replace(/```json|```/g, "").trim();
    console.log("roadmapdata is: ", roadmapData);
    const parsedRoadmapData = JSON.parse(roadmapData); 

    const roadmap: RoadmapItem[] = parsedRoadmapData.map((item: any) => ({
      id: crypto.randomUUID(),
      timePeriod: item.timePeriod,
      tasks: item.tasks,
      completed: false,
    }));
    console.log("final roadmap is: ", roadmap);
    

    return roadmap;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    return [];
  }
};


export const generateDailyTasks = async (
  goal: Goal,
  day: number
): Promise<Task[]> => {
  console.log("Generating tasks for day:", day, "of goal:", goal.title);

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // This is a simulation - in real life, this would make a call to Gemini API
  const tasks: Task[] = [];
  const currentProgress = goal.progress;

  // Logic to determine number of tasks based on progress and day
  const tasksCount = Math.floor(Math.random() * 3) + 2; // 2-4 tasks

  for (let i = 1; i <= tasksCount; i++) {
    tasks.push({
      id: crypto.randomUUID(),
      goalId: goal.id,
      description: `Task ${i} for day ${day}: ${getRandomTask(
        goal.title,
        currentProgress,
        day,
        goal.timeframe
      )}`,
      day: day,
      completed: false,
      createdAt: new Date().toISOString(),
    });
  }

  return tasks;
};

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

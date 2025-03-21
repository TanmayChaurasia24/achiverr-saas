
import { Goal, RoadmapItem, Task } from "@/types";

// For development purposes, we'll simulate API calls
// In production, this would be replaced with actual Gemini API calls

export const generateRoadmap = async (
  goalTitle: string,
  goalDescription: string,
  timeframe: number
): Promise<RoadmapItem[]> => {
  console.log("Generating roadmap for:", { goalTitle, goalDescription, timeframe });
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // This is a simulation - in real life, this would make a call to Gemini API
  const roadmap: RoadmapItem[] = [];
  
  // Generate a simple roadmap based on the timeframe
  for (let i = 1; i <= timeframe; i++) {
    roadmap.push({
      id: crypto.randomUUID(),
      day: i,
      description: i === 1 
        ? `Start working on ${goalTitle} by researching and planning your approach.` 
        : i === timeframe 
        ? `Complete your goal of ${goalTitle} and review your progress.`
        : `Continue making progress on ${goalTitle} - day ${i} of ${timeframe}.`,
      completed: false
    });
  }
  
  return roadmap;
};

export const generateDailyTasks = async (
  goal: Goal,
  day: number
): Promise<Task[]> => {
  console.log("Generating tasks for day:", day, "of goal:", goal.title);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This is a simulation - in real life, this would make a call to Gemini API
  const tasks: Task[] = [];
  const currentProgress = goal.progress;
  
  // Logic to determine number of tasks based on progress and day
  const tasksCount = Math.floor(Math.random() * 3) + 2; // 2-4 tasks
  
  for (let i = 1; i <= tasksCount; i++) {
    tasks.push({
      id: crypto.randomUUID(),
      goalId: goal.id,
      description: `Task ${i} for day ${day}: ${getRandomTask(goal.title, currentProgress, day, goal.timeframe)}`,
      day: day,
      completed: false,
      createdAt: new Date().toISOString()
    });
  }
  
  return tasks;
};

// Helper function to generate random tasks based on context
function getRandomTask(goalTitle: string, progress: number, day: number, totalDays: number): string {
  const researchTasks = [
    `Research best practices for ${goalTitle}`,
    `Find resources about ${goalTitle}`,
    `Study successful examples of ${goalTitle}`,
    `Look for tools that can help with ${goalTitle}`,
    `Create a list of references for ${goalTitle}`
  ];
  
  const planningTasks = [
    `Create a detailed plan for today's work on ${goalTitle}`,
    `Break down today's goals into smaller steps`,
    `Set specific milestones for ${goalTitle}`,
    `Schedule time blocks for working on ${goalTitle}`,
    `Prioritize today's actions for ${goalTitle}`
  ];
  
  const executionTasks = [
    `Implement key aspects of ${goalTitle}`,
    `Work on the core components of ${goalTitle}`,
    `Execute the main tasks for ${goalTitle}`,
    `Focus on building the essential parts of ${goalTitle}`,
    `Complete the primary objectives for ${goalTitle} today`
  ];
  
  const reviewTasks = [
    `Review progress on ${goalTitle}`,
    `Identify areas of improvement for ${goalTitle}`,
    `Get feedback on your work on ${goalTitle}`,
    `Evaluate the results of ${goalTitle} so far`,
    `Assess what's working and what's not for ${goalTitle}`
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

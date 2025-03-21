
import { Goal, Task } from "@/types";

// Local storage keys
const GOALS_KEY = "dreamplan-goals";
const TASKS_KEY = "dreamplan-tasks";

// Goals
export const getGoals = (): Goal[] => {
  const goals = localStorage.getItem(GOALS_KEY);
  return goals ? JSON.parse(goals) : [];
};

export const saveGoal = (goal: Goal): void => {
  const goals = getGoals();
  const existingGoalIndex = goals.findIndex((g) => g.id === goal.id);
  
  if (existingGoalIndex >= 0) {
    goals[existingGoalIndex] = goal;
  } else {
    goals.push(goal);
  }
  
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
};

export const deleteGoal = (goalId: string): void => {
  const goals = getGoals().filter((goal) => goal.id !== goalId);
  localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  
  // Also delete associated tasks
  const tasks = getTasks().filter((task) => task.goalId !== goalId);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const getGoalById = (goalId: string): Goal | undefined => {
  return getGoals().find((goal) => goal.id === goalId);
};

// Tasks
export const getTasks = (): Task[] => {
  const tasks = localStorage.getItem(TASKS_KEY);
  return tasks ? JSON.parse(tasks) : [];
};

export const getTasksByGoalId = (goalId: string): Task[] => {
  return getTasks().filter((task) => task.goalId === goalId);
};

export const saveTask = (task: Task): void => {
  const tasks = getTasks();
  const existingTaskIndex = tasks.findIndex((t) => t.id === task.id);
  
  if (existingTaskIndex >= 0) {
    tasks[existingTaskIndex] = task;
  } else {
    tasks.push(task);
  }
  
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const deleteTask = (taskId: string): void => {
  const tasks = getTasks().filter((task) => task.id !== taskId);
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

export const markTaskComplete = (taskId: string, completed: boolean): void => {
  const tasks = getTasks();
  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  
  if (taskIndex >= 0) {
    tasks[taskIndex].completed = completed;
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  }
};

export const calculateGoalProgress = (goalId: string): number => {
  const tasks = getTasksByGoalId(goalId);
  if (tasks.length === 0) return 0;
  
  const completedTasks = tasks.filter((task) => task.completed).length;
  return Math.round((completedTasks / tasks.length) * 100);
};

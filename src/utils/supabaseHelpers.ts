import { supabase } from "@/integrations/supabase/client";
import { Goal, RoadmapItem, Task } from "@/types";

// Goal operations
export const fetchGoals = async () => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (error) {
    console.error('Error fetching goals:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchGoalById = async (id: string) => {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) {
    console.error('Error fetching goal:', error);
    throw error;
  }
  
  return data;
};

export const createGoal = async (goal: Omit<Goal, 'id' | 'createdAt' | 'progress'>) => {
  // Get the current authenticated user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User must be authenticated to create a goal');
  }
  
  const { data, error } = await supabase
    .from('goals')
    .insert({
      title: goal.title,
      description: goal.description,
      timeframe: goal.timeframe,
      deadline: goal.deadline,
      user_id: user.id  // Add the user_id from the authenticated user
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating goal:', error);
    throw error;
  }
  
  return data;
};

export const updateGoal = async (id: string, updates: Partial<Goal>) => {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating goal:', error);
    throw error;
  }
  
  return data;
};

export const deleteGoalFromDB = async (id: string) => {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id);
    
  if (error) {
    console.error('Error deleting goal:', error);
    throw error;
  }
  
  return true;
};

// Roadmap operations
export const fetchRoadmapItems = async (goalId: string) => {
  const { data, error } = await supabase
    .from('roadmap_items')
    .select('*')
    .eq('goal_id', goalId)
    .order('day', { ascending: true });
    
  if (error) {
    console.error('Error fetching roadmap items:', error);
    throw error;
  }
  
  return data || [];
};

export const createRoadmapItems = async (goalId: string, items: Omit<RoadmapItem, 'id' | 'goalId'>[]) => {
  const roadmapItems = items.map(item => ({
    goal_id: goalId,
    day: item.day || 1, // Provide default value if day is not specified
    description: item.description || item.timePeriod, // Use timePeriod as description if description is not specified
    completed: item.completed || false
  }));
  
  const { data, error } = await supabase
    .from('roadmap_items')
    .insert(roadmapItems)
    .select();
    
  if (error) {
    console.error('Error creating roadmap items:', error);
    throw error;
  }
  
  return data;
};

export const updateRoadmapItem = async (id: string, updates: Partial<RoadmapItem>) => {
  const { data, error } = await supabase
    .from('roadmap_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating roadmap item:', error);
    throw error;
  }
  
  return data;
};

// Task operations
export const fetchTasks = async (goalId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('goal_id', goalId)
    .order('day', { ascending: true });
    
  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
  
  return data || [];
};

export const createTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert({
      goal_id: task.goalId,
      description: task.description,
      day: task.day,
      completed: task.completed || false
    })
    .select()
    .single();
    
  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }
  
  return data;
};

export const updateTask = async (id: string, updates: Partial<Task>) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }
  
  return data;
};

// Calculate goal progress based on completed tasks and roadmap items
export const calculateGoalProgressFromDB = async (goalId: string) => {
  // Fetch tasks
  const tasks = await fetchTasks(goalId);
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  
  // Fetch roadmap items
  const roadmapItems = await fetchRoadmapItems(goalId);
  const completedRoadmapItems = roadmapItems.filter(item => item.completed).length;
  const totalRoadmapItems = roadmapItems.length;
  
  // Calculate progress (tasks count more than roadmap items)
  let progress = 0;
  if (totalTasks > 0) {
    progress = Math.round((completedTasks / totalTasks) * 100);
  } else if (totalRoadmapItems > 0) {
    progress = Math.round((completedRoadmapItems / totalRoadmapItems) * 100);
  }
  
  // Update goal with progress
  await updateGoal(goalId, { progress });
  
  return progress;
};

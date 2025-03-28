
export interface Goal {
  id: String;
  userId: String;
  title: String;
  description: String;
  timeframe: String;
  createdAt: Date;
  updatedAt: Date;
  roadmapItems: RoadmapItem[]
  tasks:Todo[]
}

export interface RoadmapItem {
  id: string;
  timePeriod: string;
  tasks: string[];
  completed: boolean;
  day?: number; // Added day property that's used in supabaseHelpers.ts
  description?: string; // Added description property that's used in supabaseHelpers.ts
}

export interface Todo {
  id: string;
  goalId: string;
  description: string;
  day: number;
  completed: boolean;
  createdAt: string;
}

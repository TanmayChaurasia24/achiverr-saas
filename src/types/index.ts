
export interface Goal {
  id: string;
  title: string;
  description: string;
  timeframe: number; // days
  createdAt: string;
  roadmap: RoadmapItem[];
  progress: number; // 0-100
  tasks: Task[];
  deadline: string; // Added deadline property
}

export interface RoadmapItem {
  id: string;
  timePeriod: string;
  tasks: string[];
  completed: boolean;
  day?: number; // Added day property that's used in supabaseHelpers.ts
  description?: string; // Added description property that's used in supabaseHelpers.ts
}

export interface Task {
  id: string;
  goalId: string;
  description: string;
  day: number;
  completed: boolean;
  createdAt: string;
}

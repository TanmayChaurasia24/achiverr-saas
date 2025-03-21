
export interface Goal {
  id: string;
  title: string;
  description: string;
  timeframe: number; // days
  createdAt: string;
  roadmap: RoadmapItem[];
  progress: number; // 0-100
  tasks: Task[];
}

export interface RoadmapItem {
  id: string;
  day: number;
  description: string;
  completed: boolean;
}

export interface Task {
  id: string;
  goalId: string;
  description: string;
  day: number;
  completed: boolean;
  createdAt: string;
}

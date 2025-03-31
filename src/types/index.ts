export interface Goal {
  id: string;
  userId: String;
  title: String;
  description: String;
  timeframe: String;
  createdAt: Date;
  updatedAt: Date;
  roadmapItems?: RoadmapItem[];
  tasks:Todo[]
}

export interface RoadmapItem {
  id: string;
  day: string;
  description: string;
  completed: boolean;
  goalId: string;
}

export interface Todo {
  id: string;
  goalId: string;
  description: string;
  day: number;
  completed: boolean;
  createdAt: string;
}

export interface GoalResponse {
  message: string;
  goal: Goal;
}

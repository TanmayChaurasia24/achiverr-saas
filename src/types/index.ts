export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  timeframe: string;
  createdAt: Date;
  completed: boolean;
  updatedAt: Date;
  roadmapItems?: RoadmapItem[];
  tasks:Todo[]
}

export interface RoadmapItem {
  timePeriod: any;
  tasks: any[];
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
  day: string;
  completed: boolean;
  createdAt: string;
}

export interface GoalResponse {
  message: string;
  goal: Goal;
}

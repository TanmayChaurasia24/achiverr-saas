
import { useState } from "react";
import { Task, Goal } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { markTaskComplete, saveTask } from "@/utils/storage";
import { generateDailyTasks } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { CalendarDays, ListChecks, Loader2, PlusCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TaskListProps {
  goal: Goal;
  tasks: Task[];
  onTasksUpdated: () => void;
}

export function TaskList({ goal, tasks, onTasksUpdated }: TaskListProps) {
  const [loading, setLoading] = useState(false);
  
  const currentDay = Math.min(
    Math.max(
      1,
      Math.ceil(
        (new Date().getTime() - new Date(goal.createdAt).getTime()) / 
        (1000 * 60 * 60 * 24)
      )
    ),
    goal.timeframe
  );
  
  // Group tasks by day
  const tasksByDay = tasks.reduce<Record<number, Task[]>>((acc, task) => {
    if (!acc[task.day]) {
      acc[task.day] = [];
    }
    acc[task.day].push(task);
    return acc;
  }, {});
  
  const handleTaskCheck = (taskId: string, checked: boolean) => {
    markTaskComplete(taskId, checked);
    onTasksUpdated();
  };
  
  const generateTasksForToday = async () => {
    if (loading) return;
    
    setLoading(true);
    
    try {
      const newTasks = await generateDailyTasks(goal, currentDay);
      
      // Save tasks
      newTasks.forEach(task => {
        saveTask(task);
      });
      
      onTasksUpdated();
    } catch (error) {
      console.error("Error generating tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center">
          <ListChecks className="mr-2 h-5 w-5" /> Tasks
        </h2>
        
        <Button
          variant="outline"
          size="sm"
          onClick={generateTasksForToday}
          disabled={loading}
          className="group"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
          )}
          Generate Tasks for Today
        </Button>
      </div>
      
      {Object.keys(tasksByDay).length === 0 ? (
        <Card className="bg-accent/5">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">
              No tasks generated yet. Generate tasks to start making progress!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(tasksByDay)
            .sort(([dayA], [dayB]) => parseInt(dayB) - parseInt(dayA))
            .map(([day, dayTasks]) => (
              <Card key={day} className="overflow-hidden">
                <CardHeader className="pb-3 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Day {day}
                    </CardTitle>
                    <CardDescription>
                      {dayTasks.filter(t => t.completed).length} of {dayTasks.length} completed
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {dayTasks.map((task) => (
                      <li key={task.id} className="flex space-x-2">
                        <Checkbox
                          id={task.id}
                          checked={task.completed}
                          onCheckedChange={(checked) => 
                            handleTaskCheck(task.id, checked as boolean)
                          }
                          className="mt-0.5"
                        />
                        <label
                          htmlFor={task.id}
                          className={`text-sm ${
                            task.completed ? "line-through text-muted-foreground" : ""
                          }`}
                        >
                          {task.description}
                        </label>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}

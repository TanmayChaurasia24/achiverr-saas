import { useState, useEffect } from "react";
import { Todo, Goal } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { markTaskComplete, saveTask } from "@/utils/storage";

import { Button } from "@/components/ui/button";
import {
  CalendarDays,
  ListChecks,
  Loader2,
  PlusCircle,
  AlertCircle,
  Calendar,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import axios from "axios";

interface TaskListProps {
  goal: Goal;
  tasks: Todo[];
  onTasksUpdated: () => void;
}

export function TaskList({ goal, tasks, onTasksUpdated }: TaskListProps) {
  const [loading, setLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [nextDay, setNextDay] = useState<number | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(
    tasks.length === 0
  );
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [isDateOpen, setIsDateOpen] = useState(false);
  const [isChecked, setisChecked] = useState<Record<string,boolean>>({});

  const currentDay = 10;
  // Group tasks by day
  const tasksByDay = tasks.reduce<Record<number, Todo[]>>((acc, task) => {
    if (!acc[task.day]) {
      acc[task.day] = [];
    }
    acc[task.day].push(task);
    return acc;
  }, {});

  useEffect(() => {
    // Show date picker if no tasks exist
    if (tasks.length === 0) {
      setShowStartDatePicker(true);
    }
  }, [tasks]);

  useEffect(() => {
    // Check if all tasks for the current day are completed
    const currentDayTasks = tasksByDay[currentDay] || [];
    const allCurrentTasksCompleted =
      currentDayTasks.length > 0 &&
      currentDayTasks.every((task) => task.completed);

    // Check if we already have tasks for the next day
    const nextDayExists =
      tasksByDay[currentDay + 1] && tasksByDay[currentDay + 1].length > 0;

    // If all current day tasks are completed and we don't have next day tasks yet,
    // automatically generate tasks for the next day
    if (
      allCurrentTasksCompleted &&
      !nextDayExists &&
      currentDay < parseInt(goal.timeframe)
    ) {
      generateTasksForDay(currentDay + 1);
      toast.success(
        `All tasks for day ${currentDay} completed! Generated tasks for day ${
          currentDay + 1
        }.`
      );
    }
  }, [tasks]);

  const handleTaskCheck = (taskId: string, checked: boolean) => {
    console.log("Marking task complete:", taskId, checked);

    // Update in local storage
    // markTaskComplete(taskId, checked);
    !checked;
    onTasksUpdated();
  };

  const generateTasksForDay = async (day: number) => {
    if (loading) return;

    // Check if current day tasks are complete before generating next day tasks
    if (day > currentDay) {
      const currentDayTasks = tasksByDay[currentDay] || [];
      const allCurrentTasksCompleted =
        currentDayTasks.length > 0 &&
        currentDayTasks.every((task) => task.completed);

      if (!allCurrentTasksCompleted) {
        setNextDay(day);
        setShowAlert(true);
        return;
      }
    }

    setLoading(true);

    try {
      // console.log("Generating tasks for day:", day);

      // Get relevant roadmap items to inform task generation
      const relevantRoadmapItems = goal.roadmapItems.filter((item) => {
        // Extract day range from timePeriod
        const dayMatch = item.timePeriod.match(/Day\s+(\d+)(?:-(\d+))?/i);
        if (!dayMatch) return false;

        const startDay = parseInt(dayMatch[1]);
        const endDay = dayMatch[2] ? parseInt(dayMatch[2]) : startDay;

        // Check if the current day is within this range
        return day >= startDay && day <= endDay;
      });

      // Extract tasks from the roadmap to guide the API
      const roadmapGuidance = relevantRoadmapItems.flatMap(
        (item) => item.tasks || []
      );
      // console.log("Roadmap guidance for task generation:", roadmapGuidance);

      // Pass additional context to the API
      const newTasks = ["asdas", "adsd"];
      // console.log("Generated tasks:", newTasks);

      // Save to local storage
      newTasks.forEach((task) => {
        // saveTask(task);
      });

      toast.success(`Generated ${newTasks.length} tasks for day ${day}`);
      onTasksUpdated();
    } catch (error) {
      console.error("Error generating tasks:", error);
      toast.error("Failed to generate tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartJourney = async () => {
    if (!startDate) {
      toast.error("Please select a start date");
      return;
    }

    // Calculate the day number based on the selected start date
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // If start date is in the past, we're on a later day, otherwise day 1
    const dayNum = startDate <= today ? diffDays + 1 : 1;

    // update the start date of the todo in backend
    console.log(today);
    const updatedGoalResponse = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/goal/update/starttime/${
        goal.id
      }`,
      {
        startDate: today,
      }
    );

    console.log("Updated goal response:", updatedGoalResponse);
    setShowStartDatePicker(false);
    generateTasksForDay(dayNum);
  };

  const handleGenerateTasksForToday = () => {
    generateTasksForDay(currentDay);
  };

  const handleCheckboxChange = (key: string, checked: boolean) => {
    setisChecked((prev) => ({
      ...prev,
      [key]: checked
    }))
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center">
          <ListChecks className="mr-2 h-5 w-5" /> Tasks
        </h2>

        {!showStartDatePicker && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerateTasksForToday}
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
        )}
      </div>

      {showStartDatePicker ? (
        <Card>
          <CardHeader>
            <CardTitle>When would you like to start your journey?</CardTitle>
            <CardDescription>
              Select a date to begin tracking your progress and generating daily
              tasks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2">
                <Popover open={isDateOpen} onOpenChange={setIsDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      {startDate ? format(startDate, "PPP") : "Select a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        setIsDateOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="text-sm text-muted-foreground">
                {startDate && startDate < new Date()
                  ? `You are starting ${format(
                      startDate,
                      "PPP"
                    )}, which means you're on day ${
                      Math.ceil(
                        Math.abs(new Date().getTime() - startDate.getTime()) /
                          (1000 * 60 * 60 * 24)
                      ) + 1
                    } of your journey.`
                  : "Starting today will begin with day 1 of your journey."}
              </div>
            </div>

            <Button
              onClick={handleStartJourney}
              disabled={loading || !startDate}
              className="w-full"
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Start My Journey
            </Button>
          </CardContent>
        </Card>
      ) : Object.keys(tasksByDay).length === 0 ? (
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
              <Card
                key={Math.random()}
                className={
                  parseInt(day) === currentDay ? "border-primary/50" : ""
                }
              >
                <CardHeader className="pb-3 bg-muted/30">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center">
                      <CalendarDays className="mr-2 h-4 w-4" />
                      Day {day}
                      {parseInt(day) === currentDay && (
                        <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          Current Day
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>
                      {dayTasks.filter((t) => t.completed).length} of{" "}
                      {dayTasks.length} completed
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <ul className="space-y-3">
                    {dayTasks.map((task) =>
                      task.description.split("####").map((line, index) => (
                        <li key={index.toString()} className="flex space-x-2">
                          <Checkbox // task completion checkbox
                            id={index.toString()}
                            checked={!!isChecked[index]}
                            onCheckedChange={(checked) => handleCheckboxChange(index.toString(), checked as boolean)}
                            className="mt-0.5"
                            name={index.toString()}
                          />
                          <label key={index} htmlFor={index.toString()}>
                            {line}
                            <br />
                          </label>
                        </li>
                      ))
                    )}
                  </ul>
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      {/* Alert Dialog for incomplete tasks */}
      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-amber-500" />
              Complete current tasks first
            </AlertDialogTitle>
            <AlertDialogDescription>
              You still have incomplete tasks for day {currentDay}. It's
              recommended to complete these tasks before moving to day {nextDay}
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go back</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowAlert(false);
                // if (nextDay) generateTasksForDay(nextDay);
              }}
            >
              Generate anyway
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

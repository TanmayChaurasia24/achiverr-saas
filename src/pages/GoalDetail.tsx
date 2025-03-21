
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ListChecks, Map, Trash2 } from "lucide-react";
import { RoadmapView } from "@/components/RoadmapView";
import { TaskList } from "@/components/TaskList";
import { Goal, Task } from "@/types";
import { 
  calculateGoalProgress, 
  deleteGoal, 
  getGoalById, 
  getTasksByGoalId, 
  saveGoal 
} from "@/utils/storage";
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
import { toast } from "sonner";

const GoalDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    
    const loadGoal = () => {
      const foundGoal = getGoalById(id);
      if (!foundGoal) {
        toast.error("Goal not found");
        navigate("/");
        return;
      }
      
      // Calculate current progress
      const progress = calculateGoalProgress(id);
      foundGoal.progress = progress;
      saveGoal(foundGoal);
      
      setGoal(foundGoal);
      setTasks(getTasksByGoalId(id));
    };
    
    loadGoal();
  }, [id, navigate]);
  
  const handleTasksUpdated = () => {
    if (!goal) return;
    
    setTasks(getTasksByGoalId(goal.id));
    
    // Update goal progress
    const progress = calculateGoalProgress(goal.id);
    const updatedGoal = { ...goal, progress };
    setGoal(updatedGoal);
    saveGoal(updatedGoal);
  };
  
  const handleDeleteGoal = () => {
    if (!goal) return;
    
    deleteGoal(goal.id);
    toast.success("Goal deleted successfully");
    navigate("/");
  };
  
  if (!goal) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up p-8">
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Goals
        </Button>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Goal
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this goal and all its associated tasks and roadmap.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteGoal}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">{goal.title}</h1>
        <p className="text-muted-foreground">{goal.description}</p>
      </div>
      
      <Tabs defaultValue="roadmap" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="roadmap" className="flex items-center">
            <Map className="mr-2 h-4 w-4" />
            Roadmap
          </TabsTrigger>
          <TabsTrigger value="tasks" className="flex items-center">
            <ListChecks className="mr-2 h-4 w-4" />
            Tasks
          </TabsTrigger>
        </TabsList>
        <TabsContent value="roadmap">
          <RoadmapView goal={goal} />
        </TabsContent>
        <TabsContent value="tasks">
          <TaskList 
            goal={goal} 
            tasks={tasks} 
            onTasksUpdated={handleTasksUpdated} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GoalDetail;

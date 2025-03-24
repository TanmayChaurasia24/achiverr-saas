
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
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const GoalDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    
    const loadGoal = async () => {
      setLoading(true);
      console.log("Loading goal with ID:", id);
      
      try {
        // Load goal from local storage
        const localGoal = getGoalById(id);
        if (!localGoal) {
          toast.error("Goal not found");
          navigate("/");
          return;
        }
        
        setGoal(localGoal);
        setTasks(getTasksByGoalId(id));
      } catch (error) {
        console.error("Error loading goal:", error);
        toast.error("Failed to load goal");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    
    loadGoal();
  }, [id, navigate]);
  
  const handleTasksUpdated = () => {
    if (!goal) return;
    
    // Update tasks
    setTasks(getTasksByGoalId(goal.id));
    
    // Update goal progress
    const progress = calculateGoalProgress(goal.id);
    const updatedGoal = { ...goal, progress };
    setGoal(updatedGoal);
    saveGoal(updatedGoal);
  };
  
  const handleDeleteGoal = () => {
    if (!goal) return;
    
    // Delete goal from local storage
    deleteGoal(goal.id);
    
    toast.success("Goal deleted successfully");
    navigate("/dashboard");
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  if (!goal) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-muted-foreground">Goal not found</div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-8"
    >
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => navigate("/dashboard")}
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
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">{goal.title}</h1>
        <p className="text-muted-foreground">{goal.description}</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
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
      </motion.div>
    </motion.div>
  );
};

export default GoalDetail;

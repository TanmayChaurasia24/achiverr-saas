
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
        if (user) {
          // Fetch from Supabase
          console.log("Fetching goal from Supabase");
          
          const { data: goalData, error: goalError } = await supabase
            .from('goals')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();
            
          if (goalError) {
            console.error("Error fetching goal from Supabase:", goalError);
            // Fall back to local storage
            const localGoal = getGoalById(id);
            if (!localGoal) {
              toast.error("Goal not found");
              navigate("/");
              return;
            }
            setGoal(localGoal);
            setTasks(getTasksByGoalId(id));
          } else if (goalData) {
            console.log("Goal fetched from Supabase:", goalData);
            
            // Fetch roadmap items
            const { data: roadmapData, error: roadmapError } = await supabase
              .from('roadmap_items')
              .select('*')
              .eq('goal_id', id);
              
            if (roadmapError) {
              console.error("Error fetching roadmap:", roadmapError);
            }
            
            // Fetch tasks
            const { data: tasksData, error: tasksError } = await supabase
              .from('tasks')
              .select('*')
              .eq('goal_id', id);
              
            if (tasksError) {
              console.error("Error fetching tasks:", tasksError);
            }
            
            // Calculate progress
            const completedTasks = tasksData ? tasksData.filter(task => task.completed).length : 0;
            const totalTasks = tasksData ? tasksData.length : 0;
            
            let progressValue = goalData.progress || 0;
            if (totalTasks > 0) {
              progressValue = Math.round((completedTasks / totalTasks) * 100);
              
              // Update progress in Supabase
              await supabase
                .from('goals')
                .update({ progress: progressValue })
                .eq('id', id);
            }
            
            // Group roadmap items by day
            const groupedRoadmap = (roadmapData || []).reduce((acc, item) => {
              const day = item.day;
              if (!acc[day]) {
                acc[day] = {
                  id: crypto.randomUUID(),
                  timePeriod: `Day ${day}`,
                  tasks: [],
                  completed: item.completed
                };
              }
              
              // Add task from description
              if (item.description) {
                if (item.description.includes('|')) {
                  acc[day].tasks.push(...item.description.split('|').map(task => task.trim()));
                } else {
                  acc[day].tasks.push(item.description);
                }
              }
              
              return acc;
            }, {} as Record<number, any>);
            
            // Convert to array and sort by day
            const finalRoadmap = Object.values(groupedRoadmap).sort((a: any, b: any) => {
              const dayA = parseInt(a.timePeriod.replace(/[^0-9]/g, '')) || 0;
              const dayB = parseInt(b.timePeriod.replace(/[^0-9]/g, '')) || 0;
              return dayA - dayB;
            });
            
            const fullGoal: Goal = {
              id: goalData.id,
              title: goalData.title,
              description: goalData.description || "",
              timeframe: goalData.timeframe,
              deadline: goalData.deadline,
              progress: progressValue,
              createdAt: goalData.created_at,
              roadmap: finalRoadmap,
              tasks: tasksData || []
            };
            
            console.log("Constructed goal:", fullGoal);
            setGoal(fullGoal);
            setTasks(tasksData || []);
          }
        } else {
          // No user, use local storage
          const localGoal = getGoalById(id);
          if (!localGoal) {
            toast.error("Goal not found");
            navigate("/");
            return;
          }
          setGoal(localGoal);
          setTasks(getTasksByGoalId(id));
        }
      } catch (error) {
        console.error("Error loading goal:", error);
        toast.error("Failed to load goal");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    
    loadGoal();
  }, [id, navigate, user]);
  
  const handleTasksUpdated = async () => {
    if (!goal) return;
    
    if (user) {
      // Fetch latest tasks from Supabase
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select('*')
        .eq('goal_id', goal.id);
        
      if (tasksError) {
        console.error("Error fetching updated tasks:", tasksError);
        return;
      }
      
      setTasks(tasksData || []);
      
      // Calculate progress
      const completedTasks = tasksData ? tasksData.filter(task => task.completed).length : 0;
      const totalTasks = tasksData ? tasksData.length : 0;
      
      let progressValue = goal.progress;
      if (totalTasks > 0) {
        progressValue = Math.round((completedTasks / totalTasks) * 100);
        
        // Update progress in Supabase
        await supabase
          .from('goals')
          .update({ progress: progressValue })
          .eq('id', goal.id);
      }
      
      // Update goal
      const updatedGoal = { ...goal, progress: progressValue };
      setGoal(updatedGoal);
    } else {
      // Local storage
      setTasks(getTasksByGoalId(goal.id));
      
      // Update goal progress
      const progress = calculateGoalProgress(goal.id);
      const updatedGoal = { ...goal, progress };
      setGoal(updatedGoal);
      saveGoal(updatedGoal);
    }
  };
  
  const handleDeleteGoal = async () => {
    if (!goal) return;
    
    if (user) {
      // Delete from Supabase
      try {
        // Delete goal (should cascade delete roadmap items and tasks)
        const { error } = await supabase
          .from('goals')
          .delete()
          .eq('id', goal.id);
          
        if (error) {
          console.error("Error deleting goal from Supabase:", error);
          toast.error("Failed to delete goal");
          // Fall back to local storage
          deleteGoal(goal.id);
        }
      } catch (error) {
        console.error("Exception deleting goal:", error);
        // Fall back to local storage
        deleteGoal(goal.id);
      }
    } else {
      // Delete from local storage
      deleteGoal(goal.id);
    }
    
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

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ListChecks, Map, Trash2, Calendar, ClipboardList } from "lucide-react";
import { RoadmapView } from "@/components/RoadmapView";
import { TaskList } from "@/components/TaskList";
import { Goal } from "@/types";
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
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";
import axios from "axios";

const GoalDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [goal, setGoal] = useState<Goal | null>(null);
  const [tasks, setTasks] = useState<Array<{
    id: string;
    goalId: string;
    title: string;
    completed: boolean;
    day: string;
    description: string;
    createdAt: string;
  }>>([]); 
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!id) {
      // console.log("no id found");
      navigate("/");
      return;
    }
    loadGoal();
  }, [id, navigate]);

     
  const loadGoal = async () => {
    setLoading(true);
    // console.log("Loading goal with ID:", id);
    
    try {
      // Load goal data from backend
      const localGoal: {
        data:{
          message: string;
          goal: Goal;
        }
      } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/goal/get/${id}`)
      if (!localGoal) {
        toast.error("Goal not found");
        navigate("/");
        return;
      }
      // console.log("localGoal from backend: ", localGoal.data.goal);
      setGoal(localGoal.data.goal);
      setTasks(getTasksByGoalId(id));
    } catch (error) {
      console.error("Error loading goal:", error);
      toast.error("Failed to load goal");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };
  
  const handleTasksUpdated = async() => {
       
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

  // Calculate days remaining
  // const deadline = new Date(goal.deadline);
  // const today = new Date();
  // const daysRemaining = Math.max(0, Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
  // Calculate completed tasks
  const completedTasks = tasks.filter(task => task.completed).length;

  return (
    <FadeIn className="space-y-8 p-8">
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
          <AlertDialogContent className="enhanced-card">
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
      
      <div className="grid lg:grid-cols-3 gap-8">
        <ScaleIn className="lg:col-span-2">
          <Card className="enhanced-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold tracking-tight mb-2">{goal.title}</h1>
                  <p className="text-muted-foreground mb-4">{goal.description}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-3">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" /> Deadline
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground mb-1 flex items-center">
                        <ClipboardList className="h-3 w-3 mr-1" /> Tasks
                      </div>
                      <div className="font-medium">
                        {completedTasks}/{tasks.length} completed
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScaleIn>
      </div>
      
        <Tabs defaultValue="roadmap" className="w-full">
          <TabsList className="mb-6 enhanced-card">
            <TabsTrigger value="roadmap" className="flex items-center">
              <Map className="mr-2 h-4 w-4" />
              Roadmap
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center">
              <ListChecks className="mr-2 h-4 w-4" />
              Tasks
            </TabsTrigger>
          </TabsList>
          <TabsContent value="roadmap" key={Math.random()}>
            <StaggerItem>
              <Card className="enhanced-card">
                <CardContent className="p-6">
                  <RoadmapView 
                    roadmapItems={goal?.roadmapItems}
                    loading={loading}
                  />
                </CardContent>
              </Card>
            </StaggerItem>
          </TabsContent>
          <TabsContent value="tasks" key={Math.random()}>
            <StaggerItem>
              <Card className="enhanced-card">
                <CardContent className="p-6">
                  <TaskList 
                    goal={goal} 
                    tasks={goal?.tasks} 
                    onTasksUpdated={handleTasksUpdated} 
                  />
                </CardContent>
              </Card>
            </StaggerItem>
          </TabsContent>
        </Tabs>
    </FadeIn>
  );
};

export default GoalDetail;

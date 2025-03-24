
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, ListChecks, Map, Trash2, Calendar, ClipboardList } from "lucide-react";
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
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { SceneWrapper } from "@/components/3d/SceneWrapper";
import { GoalModel } from "@/components/3d/GoalModel";
import { RoadmapModel } from "@/components/3d/RoadmapModel";
import { FadeIn, ScaleIn, StaggerContainer, StaggerItem } from "@/components/ui/animations";

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

  // Calculate days remaining
  const deadline = new Date(goal.deadline);
  const today = new Date();
  const daysRemaining = Math.max(0, Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  
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
                <div className="h-40 w-40 mx-auto md:mx-0">
                  <SceneWrapper className="h-40 w-40">
                    <GoalModel progress={goal.progress || 0} size={1.3} />
                  </SceneWrapper>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold tracking-tight mb-2">{goal.title}</h1>
                  <p className="text-muted-foreground mb-4">{goal.description}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-3">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1 flex items-center">
                        <Calendar className="h-3 w-3 mr-1" /> Deadline
                      </div>
                      <div className="font-medium">
                        {new Date(goal.deadline).toLocaleDateString()} 
                        <span className="text-muted-foreground ml-2 text-sm">
                          ({daysRemaining} days left)
                        </span>
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
                  
                  <div className="mt-6">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span className="font-medium">{goal.progress || 0}%</span>
                    </div>
                    <Progress value={goal.progress || 0} className="h-2" 
                      indicatorClassName={goal.progress && goal.progress > 75 
                        ? "bg-gradient-to-r from-accent to-accent-foreground" 
                        : undefined
                      } 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScaleIn>
        
        <FadeIn delay={0.2}>
          <Card className="enhanced-card h-full">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Roadmap Overview</h3>
              
              <div className="h-48">
                <SceneWrapper className="h-48 w-full" autoRotate={false}>
                  <RoadmapModel 
                    steps={goal.roadmap.length} 
                    currentStep={Math.floor((goal.progress || 0) * goal.roadmap.length / 100)} 
                    size={0.7} 
                  />
                </SceneWrapper>
              </div>
              
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">
                  Your journey is divided into {goal.roadmap.length} steps.
                  {goal.progress && goal.progress > 0 
                    ? ` You've completed ${Math.floor(goal.progress / 100 * goal.roadmap.length)} steps so far.` 
                    : " Let's get started!"}
                </p>
              </div>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
      
      <StaggerContainer>
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
          <TabsContent value="roadmap">
            <StaggerItem>
              <Card className="enhanced-card">
                <CardContent className="p-6">
                  <RoadmapView goal={goal} />
                </CardContent>
              </Card>
            </StaggerItem>
          </TabsContent>
          <TabsContent value="tasks">
            <StaggerItem>
              <Card className="enhanced-card">
                <CardContent className="p-6">
                  <TaskList 
                    goal={goal} 
                    tasks={tasks} 
                    onTasksUpdated={handleTasksUpdated} 
                  />
                </CardContent>
              </Card>
            </StaggerItem>
          </TabsContent>
        </Tabs>
      </StaggerContainer>
    </FadeIn>
  );
};

export default GoalDetail;

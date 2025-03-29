
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Goal } from "@/types";
import { GoalCard } from "@/components/GoalCard";
import { NewGoalForm } from "@/components/NewGoalForm";
import { getGoals } from "@/utils/storage";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, ListChecks, Calendar, PlusCircle, Sparkles } from "lucide-react";
import { AIGoalSuggestions } from "@/components/AIGoalSuggestions";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

import { FadeIn, ScaleIn, StaggerContainer, StaggerItem, HoverCard } from "@/components/ui/animations";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    loadGoals();
  }, []);
  
  const loadGoals = async() => {
    // setLoading(true);
    
    // try {
    //   console.log("user details: ", user);
      
    //   const fetchAllGoals = await axios.get(`${import.meta.env.BACKEND_URL}/api/goal/bulk/${user?.id}`)
    //   console.log("fetched goals from backend: ", fetchAllGoals);
    //   setGoals(fetchAllGoals.data.goals);
    // } catch (error) {
    //   console.error("Error loading goals:", error);
    //   toast.error("Failed to load goals");
    // } finally {
    //   setLoading(false);
    // }
  };
  
  const handleSelectGoal = (goalId: string) => {
    navigate(`/goals/${goalId}`);
  };

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "there";

  return (
    <Layout>
      <FadeIn className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Hello, <span className="gradient-text">{userName}!</span>
            </h1>
            <p className="text-muted-foreground max-w-xl mt-1">
              Track your goals and daily progress toward what matters most.
            </p>
          </div>
          <NewGoalForm onGoalCreated={loadGoals} />
        </div>
        
        <div className="grid gap-6 md:grid-cols-3">
          <HoverCard>
            <Card className="enhanced-card overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  Active Goals
                  <ListChecks className="h-4 w-4 text-accent ml-2" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{10}</div>
                    {/* <p className="text-xs text-muted-foreground mt-1">
                      {activeGoals === 0 ? "No goals yet" : `${activeGoals} goal${activeGoals !== 1 ? 's' : ''} in progress`}
                    </p> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </HoverCard>
          
          <HoverCard>
            <Card className="enhanced-card overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  Completed Tasks
                  <Calendar className="h-4 w-4 text-accent ml-2" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">{10}</div>
                    {/* <p className="text-xs text-muted-foreground mt-1">
                      {totalTasks > 0 
                        ? `${completedTasks}/${totalTasks} tasks completed` 
                        : "No tasks yet"}
                    </p> */}
                  </div>
                </div>
              </CardContent>
            </Card>
          </HoverCard>
          
          <HoverCard>
            <Card className="enhanced-card overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  Average Progress
                  <TrendingUp className="h-4 w-4 text-accent ml-2" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">
                      {50}%
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Overall goal completion
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </HoverCard>
        </div>
        
        {/* AI Goal Suggestions */}
        <ScaleIn>
          <AIGoalSuggestions onGoalAdded={loadGoals} />
        </ScaleIn>
        
        <div>
          <Tabs defaultValue="current" className="w-full">
            <div className="flex justify-between items-center mb-4">
              <TabsList>
                <TabsTrigger value="current">Current Goals</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="current" className="mt-0">
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-pulse text-muted-foreground">Loading goals...</div>
                </div>
              ) : goals.length > 0 ? (
                <StaggerContainer className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {goals.map((goal: Goal) => (
                    <StaggerItem key={goal.id.toString()}>
                      <GoalCard 
                        goal={goal} 
                        onSelect={handleSelectGoal}
                      />
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              ) : (
                <FadeIn delay={0.2}>
                  <Card className="enhanced-card p-8 text-center">
                    <div className="mx-auto w-20 h-20 rounded-full bg-secondary/70 flex items-center justify-center mb-4 glow">
                      <Sparkles className="h-8 w-8 text-accent" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Create your first goal to get started. Set a clear objective with a timeframe,
                      and we'll help you create a roadmap to achieve it.
                    </p>
                    <NewGoalForm onGoalCreated={loadGoals} />
                  </Card>
                </FadeIn>
              )}
            </TabsContent>
            
            <TabsContent value="completed">
              <Card className="enhanced-card">
                <CardHeader>
                  <CardTitle>Completed Goals</CardTitle>
                  <CardDescription>
                    View all your past achievements.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="mx-auto w-16 h-16 rounded-full bg-secondary/70 flex items-center justify-center mb-4">
                        <TrendingUp className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">Coming soon...</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </FadeIn>
    </Layout>
  );
};

export default Dashboard;

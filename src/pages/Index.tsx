
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Goal } from "@/types";
import { GoalCard } from "@/components/GoalCard";
import { NewGoalForm } from "@/components/NewGoalForm";
import { getGoals } from "@/utils/storage";
import { Layout } from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { AIGoalSuggestions } from "@/components/AIGoalSuggestions";
import { BarChart3, TrendingUp, ListChecks, Calendar, PlusCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    loadGoals();
  }, []);
  
  const loadGoals = () => {
    const storedGoals = getGoals();
    setGoals(storedGoals);
  };
  
  const handleSelectGoal = (goalId: string) => {
    navigate(`/goals/${goalId}`);
  };
  
  // Calculate some basic metrics
  const activeGoals = goals.length;
  const completedTasks = goals.reduce((total, goal) => {
    const completed = goal.tasks?.filter(task => task.completed)?.length || 0;
    return total + completed;
  }, 0);
  
  const userName = user?.user_metadata?.full_name?.split(' ')[0] || 
                  user?.email?.split('@')[0] || 
                  'there';

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Hello, {userName}!
            </h1>
            <p className="text-muted-foreground max-w-xl mt-1">
              Track your goals and daily progress toward what matters most.
            </p>
          </div>
          <NewGoalForm onGoalCreated={loadGoals} />
        </div>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Goals
              </CardTitle>
              <ListChecks className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeGoals}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeGoals === 0 ? "No goals yet" : `${activeGoals} goal${activeGoals !== 1 ? 's' : ''} in progress`}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Tasks
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTasks}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {completedTasks === 0 ? "No tasks completed yet" : `${completedTasks} task${completedTasks !== 1 ? 's' : ''} completed`}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Progress
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {activeGoals ? `${Math.round(goals.reduce((sum, goal) => sum + (goal.progress || 0), 0) / activeGoals)}%` : "0%"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Overall goal completion
              </p>
            </CardContent>
          </Card>
        </div>
        
        {/* AI Goal Suggestions - Unique Feature */}
        <AIGoalSuggestions onGoalAdded={loadGoals} />
        
        <Tabs defaultValue="current" className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="current">Current Goals</TabsTrigger>
              <TabsTrigger value="completed" disabled={true}>Completed</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="current" className="mt-0">
            {goals.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {goals.map((goal) => (
                  <GoalCard 
                    key={goal.id} 
                    goal={goal} 
                    onSelect={handleSelectGoal}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-8 text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
                  <PlusCircle className="h-6 w-6 text-secondary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No goals yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Create your first goal to get started. Set a clear objective with a timeframe,
                  and we'll help you create a roadmap to achieve it.
                </p>
                <NewGoalForm onGoalCreated={loadGoals} />
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Goals</CardTitle>
                <CardDescription>
                  View all your past achievements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Index;

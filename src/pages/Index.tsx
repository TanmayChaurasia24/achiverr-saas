
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Goal } from "@/types";
import { GoalCard } from "@/components/GoalCard";
import { NewGoalForm } from "@/components/NewGoalForm";
import { getGoals } from "@/utils/storage";
import { Layout } from "@/components/Layout";

const Index = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<Goal[]>([]);
  
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

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">Your Goals</h1>
          <p className="text-muted-foreground max-w-xl">
            Set your goals, get AI-powered roadmaps, and track your daily progress 
            toward achieving what matters most to you.
          </p>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">
              {goals.length > 0 
                ? 'Current Goals' 
                : 'No goals yet. Create one to get started!'
              }
            </h2>
          </div>
          <NewGoalForm onGoalCreated={loadGoals} />
        </div>
        
        {goals.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <GoalCard 
                key={goal.id} 
                goal={goal} 
                onSelect={handleSelectGoal} 
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;

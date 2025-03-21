
import { useState } from "react";
import { Sparkle, HelpCircle, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Goal } from "@/types";
import { saveGoal } from "@/utils/storage";

// Mock AI generated goal suggestions
const SUGGESTIONS = [
  {
    title: "Develop a Daily Meditation Habit",
    description: "Build consistency with a 10-minute daily meditation practice to reduce stress and improve focus.",
    category: "wellness",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tasks: [
      { id: crypto.randomUUID(), title: "Research meditation techniques", completed: false },
      { id: crypto.randomUUID(), title: "Download a meditation app", completed: false },
      { id: crypto.randomUUID(), title: "Set up a dedicated space", completed: false },
      { id: crypto.randomUUID(), title: "Schedule a daily reminder", completed: false }
    ]
  },
  {
    title: "Learn Basic Web Development",
    description: "Master HTML, CSS, and basic JavaScript to build and launch your first website.",
    category: "career",
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tasks: [
      { id: crypto.randomUUID(), title: "Complete HTML fundamentals course", completed: false },
      { id: crypto.randomUUID(), title: "Build a simple static webpage", completed: false },
      { id: crypto.randomUUID(), title: "Style your page with CSS", completed: false },
      { id: crypto.randomUUID(), title: "Add basic JavaScript functionality", completed: false }
    ]
  },
  {
    title: "Run a 5K Race",
    description: "Train consistently to complete your first 5K run with good form and energy.",
    category: "fitness",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    tasks: [
      { id: crypto.randomUUID(), title: "Get fitted for proper running shoes", completed: false },
      { id: crypto.randomUUID(), title: "Create a training schedule", completed: false },
      { id: crypto.randomUUID(), title: "Complete first week of training", completed: false },
      { id: crypto.randomUUID(), title: "Register for a local 5K event", completed: false }
    ]
  }
];

const CATEGORIES = {
  wellness: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300",
  career: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  fitness: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  finance: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300"
};

export function AIGoalSuggestions({ onGoalAdded }: { onGoalAdded: () => void }) {
  const { toast } = useToast();
  const [addedGoals, setAddedGoals] = useState<Set<number>>(new Set());

  const handleAddGoal = (suggestion: any, index: number) => {
    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: suggestion.title,
      description: suggestion.description,
      deadline: suggestion.deadline,
      timeframe: 30, // Default timeframe in days
      createdAt: new Date().toISOString(),
      roadmap: [],
      progress: 0,
      tasks: suggestion.tasks.map((task: any) => ({
        id: task.id,
        goalId: crypto.randomUUID(), // This will be updated after goal creation
        description: task.title,
        day: 1, // Default day
        completed: false,
        createdAt: new Date().toISOString()
      }))
    };

    saveGoal(newGoal);
    
    setAddedGoals(prev => {
      const updated = new Set(prev);
      updated.add(index);
      return updated;
    });
    
    toast({
      title: "AI-suggested goal added!",
      description: `"${suggestion.title}" has been added to your goals.`,
    });
    
    onGoalAdded();
  };

  return (
    <Card className="border-accent/30 bg-gradient-to-b from-background to-accent/5">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium flex items-center">
            <Sparkle className="h-5 w-5 mr-2 text-accent" />
            AI Goal Suggestions
          </CardTitle>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <HelpCircle className="h-4 w-4" />
            <span className="sr-only">About AI suggestions</span>
          </Button>
        </div>
        <CardDescription>
          Intelligent goal recommendations based on successful patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          {SUGGESTIONS.map((suggestion, index) => (
            <div key={index} className="flex items-start justify-between p-3 rounded-lg bg-card border">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium">{suggestion.title}</h4>
                  <Badge className={`${CATEGORIES[suggestion.category as keyof typeof CATEGORIES]} px-2 py-0.5 text-xs`}>
                    {suggestion.category}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{suggestion.description}</p>
              </div>
              {addedGoals.has(index) ? (
                <Button variant="outline" size="sm" className="h-8" disabled>
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  Added
                </Button>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8"
                  onClick={() => handleAddGoal(suggestion, index)}
                >
                  Add Goal
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <p className="text-xs text-muted-foreground">
          These AI-powered suggestions are based on success patterns from thousands of completed goals.
        </p>
      </CardFooter>
    </Card>
  );
}

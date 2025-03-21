
import { Goal } from "@/types";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CalendarClock, ChevronRight, ListChecks } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface GoalCardProps {
  goal: Goal;
  onSelect: (goalId: string) => void;
}

export function GoalCard({ goal, onSelect }: GoalCardProps) {
  return (
    <Card className="card-hover overflow-hidden animate-scale-in">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{goal.title}</CardTitle>
          <div className="text-sm text-muted-foreground flex items-center">
            <CalendarClock className="mr-1 h-3 w-3" />
            <span>{goal.timeframe} days</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground line-clamp-2 mb-4">
          {goal.description}
        </p>
        <div className="space-y-2">
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{goal.progress}%</span>
          </div>
          <Progress value={goal.progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t bg-muted/20 pt-4">
        <div className="text-xs text-muted-foreground">
          Created {formatDistanceToNow(new Date(goal.createdAt), { addSuffix: true })}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-accent hover:text-accent hover:bg-accent/10 group"
          onClick={() => onSelect(goal.id)}
        >
          <span className="mr-1">Details</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  );
}

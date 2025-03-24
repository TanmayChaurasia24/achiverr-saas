
import { Goal, RoadmapItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Loader2, Map } from "lucide-react";
import { useState } from "react";

interface RoadmapViewProps {
  goal: Goal;
}

export function RoadmapView({ goal }: RoadmapViewProps) {
  const [loading, setLoading] = useState(false);
  const { roadmap, progress } = goal;
  
  // Log roadmap for debugging
  console.log("Roadmap in RoadmapView:", roadmap);
  
  // Extract distinct time periods from roadmap
  const timePeriods = roadmap
    .map(item => item.timePeriod)
    .filter((value, index, self) => self.indexOf(value) === index);
  
  // Group roadmap items by timePeriod with proper day formatting
  const groupedRoadmap = timePeriods.map(period => {
    const items = roadmap.filter(item => item.timePeriod === period);
    
    // Extract day ranges from the timePeriod (e.g., "Day 1-3" or "Days 1-3")
    // First try to match patterns like "Day 1-3" or "Days 1-3"
    let dayMatch = period.match(/Days?\s+(\d+)(?:-(\d+))?/i);
    
    // If no match, try to match just numbers (e.g., "1" or "1-3")
    if (!dayMatch) {
      dayMatch = period.match(/(\d+)(?:-(\d+))?/);
    }
    
    let startDay = 1;
    let endDay = 1;
    
    if (dayMatch) {
      startDay = parseInt(dayMatch[1]);
      endDay = dayMatch[2] ? parseInt(dayMatch[2]) : startDay;
    }
    
    // Format the time period to ensure it's in the format "Day 1-3" or "Day 4"
    const formattedTimePeriod = endDay > startDay 
      ? `Day ${startDay}-${endDay}`
      : `Day ${startDay}`;
    
    return {
      timePeriod: formattedTimePeriod,
      days: [startDay, endDay],
      items: items
    };
  }).sort((a, b) => a.days[0] - b.days[0]); // Sort by start day
  
  // Calculate current day
  const currentDay = Math.min(
    Math.max(
      1,
      Math.ceil(
        (new Date().getTime() - new Date(goal.createdAt).getTime()) / 
        (1000 * 60 * 60 * 24)
      )
    ),
    goal.timeframe
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center">
          <Map className="mr-2 h-5 w-5" /> Roadmap
        </h2>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span>Overall Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="space-y-4">
        {roadmap.length === 0 ? (
          <Card className="bg-accent/5">
            <CardContent className="pt-6 text-center">
              <p className="text-muted-foreground">
                No roadmap items available yet.
              </p>
            </CardContent>
          </Card>
        ) : (
          groupedRoadmap.map((group, index) => {
            const isFirst = index === 0;
            const isLast = index === groupedRoadmap.length - 1;
            const isCurrentPeriod = currentDay >= group.days[0] && currentDay <= group.days[1];
            
            return (
              <Card 
                key={group.timePeriod} 
                className={`relative overflow-hidden ${isCurrentPeriod ? 'border-primary/50' : ''}`}
              >
                {!isFirst && (
                  <div className="absolute top-0 left-6 w-px h-4 bg-border -mt-4"></div>
                )}
                {!isLast && (
                  <div className="absolute bottom-0 left-6 w-px h-4 bg-border -mb-4"></div>
                )}

                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground mr-3">
                      {group.days[0]}
                    </div>
                    <span>
                      {group.timePeriod}
                      {isCurrentPeriod && (
                        <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                          Current
                        </span>
                      )}
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <div className="pl-[60px] space-y-3">
                    {group.items.map((item, itemIndex) => {
                      // For each item in the timePeriod, we now have tasks
                      const tasks = item.tasks || [];
                      
                      return (
                        <div key={item.id || itemIndex}>
                          {itemIndex > 0 && <Separator className="my-3" />}
                          
                          {tasks.map((task, taskIndex) => (
                            <div key={`${item.id}-${taskIndex}`} className="mb-2">
                              <div className="flex items-start">
                                <div className="flex-1">
                                  <p className="text-sm">• {task}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

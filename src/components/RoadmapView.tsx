
import { Goal, RoadmapItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Map } from "lucide-react";

interface RoadmapViewProps {
  goal: Goal;
}

export function RoadmapView({ goal }: RoadmapViewProps) {
  const { roadmap, progress } = goal;
  
  // Group roadmap items to prevent too much scrolling
  const groupedRoadmap: { days: number[]; items: RoadmapItem[] }[] = [];
  
  if (goal.timeframe <= 10) {
    // For short timeframes, show each day
    roadmap.forEach(item => {
      groupedRoadmap.push({
        days: [item.day],
        items: [item]
      });
    });
  } else if (goal.timeframe <= 30) {
    // For medium timeframes, group by 3 days
    for (let i = 0; i < roadmap.length; i += 3) {
      const group = roadmap.slice(i, i + 3);
      groupedRoadmap.push({
        days: group.map(item => item.day),
        items: group
      });
    }
  } else {
    // For long timeframes, group by week
    for (let i = 0; i < roadmap.length; i += 7) {
      const group = roadmap.slice(i, i + 7);
      groupedRoadmap.push({
        days: group.map(item => item.day),
        items: group
      });
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-semibold tracking-tight flex items-center">
        <Map className="mr-2 h-5 w-5" /> Roadmap
      </h2>
      
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-sm">
          <span>Overall Progress</span>
          <span>{progress}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <div className="space-y-4">
        {groupedRoadmap.map((group, index) => {
          const isFirst = index === 0;
          const isLast = index === groupedRoadmap.length - 1;
          const dayLabel = group.days.length === 1
            ? `Day ${group.days[0]}`
            : `Days ${Math.min(...group.days)}-${Math.max(...group.days)}`;
          
          return (
            <Card key={index} className="relative overflow-hidden">
              {!isFirst && (
                <div className="absolute top-0 left-6 w-px h-4 bg-border -mt-4"></div>
              )}
              {!isLast && (
                <div className="absolute bottom-0 left-6 w-px h-4 bg-border -mb-4"></div>
              )}
              
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent text-accent-foreground mr-3">
                    {Math.min(...group.days)}
                  </div>
                  <span>{dayLabel}</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent>
                <div className="pl-[60px] space-y-3">
                  {group.items.map((item, itemIndex) => (
                    <div key={item.id}>
                      {itemIndex > 0 && <Separator className="my-3" />}
                      <div className="flex items-start">
                        <div className="flex-1">
                          <p className="text-sm">{item.description}</p>
                          {item.completed && (
                            <Badge variant="outline" className="mt-2">
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

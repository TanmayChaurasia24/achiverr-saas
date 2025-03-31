import React from 'react';
import { Goal, RoadmapItem } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Loader2, Map, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { StaggerContainer, StaggerItem } from '@/components/ui/animations';

interface RoadmapViewProps {
  roadmapItems?: RoadmapItem[];
  loading?: boolean;
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ roadmapItems = [], loading = false }) => {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!roadmapItems || roadmapItems.length === 0) {
    return (
      <Card className="bg-muted/50">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground">No roadmap items available yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <StaggerContainer className="space-y-4">
      {roadmapItems.map((item) => (
        <StaggerItem key={item.id}>
          <Card className={`transition-colors ${item.completed ? 'bg-primary/10' : 'bg-muted/50'}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center justify-between">
                <span>Day {item.day}</span>
                {item.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </CardContent>
          </Card>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
};

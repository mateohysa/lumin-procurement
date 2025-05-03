
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ChevronLeft, ChevronRight } from 'lucide-react';

// Sample AI insights
const insights = [
  {
    id: 1,
    title: "TechSolutions Inc. has the highest average score",
    description: "Consider for fast-track approval based on consistent high performance across 3 tenders.",
    action: "View Vendor Profile",
    link: "/vendors/techsolutions"
  },
  {
    id: 2,
    title: "Vendor X has incomplete submissions on 3 tenders",
    description: "Following up with Global Services about missing documents could improve completion rate.",
    action: "Send Reminder",
    link: "/vendors/global-services"
  },
  {
    id: 3,
    title: "IT Services tenders get 40% more submissions",
    description: "Consider expanding procurement in this category based on vendor interest and competition.",
    action: "View Category Report",
    link: "/reports/categories"
  }
];

export function AiInsights() {
  const [currentInsight, setCurrentInsight] = useState(0);
  
  const nextInsight = () => {
    setCurrentInsight((prev) => (prev + 1) % insights.length);
  };
  
  const prevInsight = () => {
    setCurrentInsight((prev) => (prev - 1 + insights.length) % insights.length);
  };
  
  const insight = insights[currentInsight];

  return (
    <Card className="bg-blue-50 border-blue-100">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-amber-500" />
          AI Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <h3 className="text-lg font-medium">{insight.title}</h3>
          <p className="text-sm text-muted-foreground">{insight.description}</p>
          
          <div className="flex justify-between items-center pt-2">
            <Button variant="link" className="text-blue-600 p-0 h-auto">
              {insight.action}
            </Button>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={prevInsight}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-xs text-muted-foreground">
                {currentInsight + 1}/{insights.length}
              </span>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-full"
                onClick={nextInsight}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

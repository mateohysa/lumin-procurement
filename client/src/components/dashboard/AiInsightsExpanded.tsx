
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

// Sample AI insights with more details than the existing AiInsights component
const insights = [
  {
    id: 1,
    title: "TechSolutions Inc. has the highest average score",
    description: "Consider for fast-track approval based on consistent high performance across 3 tenders. Their technical scores average 4.7/5.0 and budget compliance is excellent.",
    action: "View Vendor Profile",
    link: "/vendors/techsolutions"
  },
  {
    id: 2,
    title: "Vendor X has incomplete submissions on 3 tenders",
    description: "Following up with Global Services about missing documents could improve completion rate. The missing documents are primarily in the budget and timeline categories.",
    action: "Send Reminder",
    link: "/vendors/global-services"
  },
  {
    id: 3,
    title: "IT Services tenders get 40% more submissions",
    description: "Consider expanding procurement in this category based on vendor interest and competition. The average number of submissions for IT tenders is 12.3 vs. 8.8 for other categories.",
    action: "View Category Report",
    link: "/reports/categories"
  },
  {
    id: 4,
    title: "Evaluation timeline exceeding target by 2.3 days",
    description: "The average evaluation completion time is currently 9.3 days, which is above the target of 7 days. Consider sending reminders to evaluators or adjusting the timeline expectations.",
    action: "Review Evaluations",
    link: "/evaluations"
  }
];

export function AiInsightsExpanded() {
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
            <Button variant="link" className="text-blue-600 p-0 h-auto flex items-center gap-1">
              {insight.action}
              <ExternalLink className="h-3.5 w-3.5" />
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


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Sample data for the timeline
const timelineItems = [
  { 
    id: 'T-2023-42', 
    title: 'IT Infrastructure Upgrade', 
    phase: 'Submission Deadline', 
    date: '2025-05-15',
    completed: false
  },
  { 
    id: 'T-2023-41', 
    title: 'Office Furniture Procurement', 
    phase: 'Evaluation', 
    date: '2025-05-18',
    completed: false
  },
  { 
    id: 'T-2023-40', 
    title: 'Consulting Services', 
    phase: 'Winner Announcement', 
    date: '2025-05-05',
    completed: true
  },
  { 
    id: 'T-2023-39', 
    title: 'Marketing Campaign', 
    phase: 'Contract Signing', 
    date: '2025-05-10',
    completed: false
  }
];

export function ProcurementTimeline() {
  return (
    <Card className="card-hover">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-medium">Procurement Timeline</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pt-2">
          {/* The timeline vertical line */}
          <div className="absolute h-full w-0.5 bg-muted left-2 top-0"></div>
          
          <div className="space-y-6">
            {timelineItems.map((item, index) => (
              <div key={item.id} className="relative pl-10">
                {/* Circle indicator */}
                <div className={cn(
                  "absolute left-0 w-5 h-5 rounded-full border-2 top-1",
                  item.completed 
                    ? "bg-primary border-primary" 
                    : "bg-background border-muted"
                )}></div>
                
                {/* Content */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.id}</span>
                      <Badge variant={item.completed ? "secondary" : "outline"}>
                        {item.phase}
                      </Badge>
                    </div>
                    <h4 className="text-base font-medium mt-1">{item.title}</h4>
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {new Date(item.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

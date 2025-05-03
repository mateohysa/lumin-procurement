
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Clock } from 'lucide-react';

type ActivityItem = {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target: string;
  timestamp: string;
  timeAgo: string;
};

export function ActivityFeed() {
  // In a real app, these would come from an API
  const activities: ActivityItem[] = [
    {
      id: "activity-1",
      user: { name: "Jane Smith" },
      action: "evaluated",
      target: "TechSolutions Inc. for IT Infrastructure Tender",
      timestamp: "2023-05-01T10:30:00",
      timeAgo: "2 hours ago"
    },
    {
      id: "activity-2",
      user: { name: "John Doe" },
      action: "created",
      target: "new tender T-2023-44: Office Supplies Procurement",
      timestamp: "2023-05-01T09:15:00",
      timeAgo: "3 hours ago"
    },
    {
      id: "activity-3",
      user: { name: "Michael Johnson" },
      action: "submitted",
      target: "evaluation for Marketing Services proposal",
      timestamp: "2023-05-01T08:45:00",
      timeAgo: "4 hours ago"
    },
    {
      id: "activity-4",
      user: { name: "Sara Williams" },
      action: "verified",
      target: "vendor Global Consulting Group",
      timestamp: "2023-04-30T16:20:00",
      timeAgo: "1 day ago"
    },
    {
      id: "activity-5",
      user: { name: "Robert Chen" },
      action: "flagged",
      target: "budget discrepancy in BuildRight Construction proposal",
      timestamp: "2023-04-30T14:10:00",
      timeAgo: "1 day ago"
    }
  ];
  
  // Group activities by day
  const today = activities.filter(a => a.timeAgo.includes('hour') || a.timeAgo.includes('minute'));
  const yesterday = activities.filter(a => a.timeAgo.includes('day') && a.timeAgo.includes('1 day'));
  const older = activities.filter(a => !today.includes(a) && !yesterday.includes(a));
  
  const renderActivityGroup = (items: ActivityItem[], title: string) => {
    if (items.length === 0) return null;
    
    return (
      <div className="mb-6 last:mb-0">
        <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
          <Clock className="mr-1 h-3.5 w-3.5" />
          {title}
        </h4>
        <div className="space-y-3">
          {items.map(activity => (
            <div key={activity.id} className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
                {activity.user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-medium">{activity.user.name}</span>{' '}
                  <span className="text-muted-foreground">{activity.action}</span>{' '}
                  {activity.target}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {activity.timeAgo}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center">
          <Activity className="mr-2 h-5 w-5 text-green-500" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {renderActivityGroup(today, "Today")}
        {renderActivityGroup(yesterday, "Yesterday")}
        {renderActivityGroup(older, "Older")}
      </CardContent>
    </Card>
  );
}
